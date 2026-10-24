"""RoM-benchmark — vindt Regels op maat op deze locatie het juiste artikel?

Speelt per testvraag na wat de bezoeker van /regels-op-maat/ doet, via
dezelfde endpoints en met dezelfde indelingslogica als public/regels-op-maat/:

  locatie     PDOK Locatieserver (adres/perceel) of RD-coördinaat uit het Excel
  document    /v1/viewer/regelmix?x&y                      — staat het verwachte document op dit punt?
  kenmerk     /v1/viewer/objecten?x&y                      — de annotatie (norm, activiteit, gebiedsaanwijzing,
                                                             bestemming) die de vraag beantwoordt
  artikel     /v1/viewer/regelmix/document?x&y&bron        — staat het verwachte artikel bij dat document?
  pad/imow/   /v1/viewer/regeling/{expr}/onderwerpen       — onder welke tegel landt dat artikel, per indeling
  hybride       (+ /boom voor lid→artikel, zoals de site)
  stelsel     variant D (thema-en-activiteitindeling), nog niet op de site: tegel + chip uit pad, activiteit en gebiedsaanwijzing (README)
  vraag       POST /v1/regelteksten-bij-vraag              — staat het artikel in de eerste 10 treffers?

Gebruik:
  python -I run_benchmark.py                    # alle cases tegen productie
  python -I run_benchmark.py --case 8,15,21     # een selectie
  python -I run_benchmark.py --api http://localhost:8002

Elke run komt in een eigen map runs/<tijdstempel>/ (resultaten.json + rapport.md);
een eerdere run wordt nooit overschreven.

Alleen standaardbibliotheek. De verwachtingen staan in golden.json, afgeleid uit
'Testvragen AI experiment - RoM - EL - 20-10-2026.xlsx' (zie README.md).
"""
import argparse
import datetime
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HIER = Path(__file__).resolve().parent
PDOK = "https://api.pdok.nl/bzk/locatieserver/search/v3_1"
UA = {"User-Agent": "rom-benchmark/1.0 (+omgevingsdocumentenregister.nl tests)"}
VRAAG_ZICHTBAAR = 10   # app.js: limiet = 10 — wat de bezoeker zonder doorklikken ziet

# ── zelfde indeling als public/regels-op-maat/thema.js en app.js ──
KOEPELTHEMAS = {"milieu", "procedures", "planologisch gebruik"}
# --water-als-waterkering: de tegelindeling van vóór 2026-10-23 (bd1ffb9, de versie waarop het
# Excel van 20-10 is gescoord). Toen ging water zonder subcategorie naar 'waterkering'.
WATER_OUD = False


def onderwerp_van(categorie, sub):
    if not categorie:
        return "niet-ingedeeld"
    if categorie == "water":
        if not sub:
            return "waterkering" if WATER_OUD else "water"
        return "riolering" if re.search(r"lozen|afvalwater", sub) else "waterkering"
    if categorie == "geluid":
        return "geluid"
    if categorie == "milieu":
        return "geluid" if sub == "geur" else "bedrijven"
    if categorie in ("economie", "lucht", "energie", "duurzaamheid", "gezondheid", "veiligheid"):
        return "bedrijven"
    if categorie in ("bouwen", "wonen", "planologisch gebruik"):
        return "bouwen"
    if categorie in ("natuur", "landschap"):
        return "natuur"
    if categorie == "landbouw":
        return "landbouw"
    if categorie == "bodem":
        return "bodem"
    if categorie == "recreatie":
        return "bedrijven" if sub == "schietbanen" else "openbare-ruimte"
    if categorie in ("infrastructuur", "mobiliteit"):
        return "openbare-ruimte"
    if categorie == "erfgoed":
        return "erfgoed"
    if categorie == "procedures":
        return "overheid" if sub == "instructieregels" else "aanvragen"
    return "niet-ingedeeld"


def onderwerpen_uit_themas(themas):
    specifiek = [t for t in themas if t not in KOEPELTHEMAS]
    uit = []
    for t in (specifiek or themas):
        i = onderwerp_van(t, None)
        if i != "niet-ingedeeld" and i not in uit:
            uit.append(i)
    return uit or ["niet-ingedeeld"]


# ── variant D: thema-en-activiteitindeling (voorstel Brigitte 22-10-2026, kop 2) ──
# Interne modus-id blijft "stelsel" (zo heten de velden in de runs van 2026-10-23).
# Bestaat (nog) niet op de site; de test simuleert hem op dezelfde gegevens.
# Niveau 1: haar acht categorieën, elk een clustering van IMOW-thema's, plus Landbouw los
#   (aanvulling 2026-10-23). Het artikel krijgt zijn tegel uit het pad, anders uit de annotatie
#   (zoals C), plus een tegel per gebiedsaanwijzing van een onderwerpstype.
# Niveau 2: chips — subonderwerp uit het pad, activiteitnaam, naam van de gebiedsaanwijzing.
# D' (stelsel_act) voegt daarbovenop een tegel per activiteitengroep toe: Brigittes letterlijke
#   lezing "activiteitengroep i.c.m. thema" op niveau 1, om dat effect apart te meten.
TEGELS_D = {
    "d-bouwen": "Bouwen en gebruik", "d-werken": "Werken en recreëren", "d-landbouw": "Landbouw en veehouderij",
    "d-erfgoed": "Erfgoed", "d-natuur": "Natuur en landschap", "d-bodem-water": "Bodem en water",
    "d-milieu": "Milieu, gezondheid en veiligheid", "d-energie": "Energie en klimaat",
    "d-verkeer": "Verkeer en infrastructuur",
}
THEMA_D = {
    "bouwen": "d-bouwen", "wonen": "d-bouwen", "planologisch gebruik": "d-bouwen",
    "economie": "d-werken", "recreatie": "d-werken", "landbouw": "d-landbouw", "erfgoed": "d-erfgoed",
    "natuur": "d-natuur", "landschap": "d-natuur", "bodem": "d-bodem-water", "water": "d-bodem-water",
    "milieu": "d-milieu", "geluid": "d-milieu", "lucht": "d-milieu", "veiligheid": "d-milieu", "gezondheid": "d-milieu",
    "energie": "d-energie", "duurzaamheid": "d-energie", "infrastructuur": "d-verkeer", "mobiliteit": "d-verkeer",
}
# TypeGebiedsaanwijzing (label) → tegel. functie, ruimtelijk gebruik en beperkingengebied zeggen wat
# voor juridisch gebied het is, niet waar het over gaat: geen tegel (objectroute-analyse 2026-09-16 §3.5).
GA_TYPE_D = {
    "water en watersysteem": "d-bodem-water", "bodem": "d-bodem-water", "mijnbouw": "d-bodem-water",
    "natuur": "d-natuur", "landschap": "d-natuur", "energievoorziening": "d-energie", "erfgoed": "d-erfgoed",
    "bouw": "d-bouwen", "geluid": "d-milieu", "lucht": "d-milieu", "geur": "d-milieu",
    "externe veiligheid": "d-milieu", "defensie": "d-milieu", "verkeer": "d-verkeer", "leiding": "d-verkeer",
    "recreatie": "d-werken",
}
# Waardelijst Activiteitengroep (IMOW 5.1.0) → thema, zoals de waardelijst zelf indeelt.
ACTGROEP_THEMA = {g: t for t, gs in {
    "bodem": ["bodemactiviteit", "mijnbouwlocatieactiviteit", "ontgrondingsactiviteit"],
    "bouwen": ["bouwactiviteit ruimtelijk", "bouwactiviteit technisch", "gebruiken-van-bouwwerkenactiviteit",
               "in-stand-houden-van-bouwwerkenactiviteit", "sloopactiviteit"],
    "economie": ["cultuuractiviteit", "dienstverleningsactiviteit", "evenementactiviteit", "exploitatieactiviteit bedrijf",
                 "exploitatieactiviteit detailhandel", "exploitatieactiviteit horeca", "exploitatieactiviteit kantoor",
                 "festiviteitactiviteit", "maatschappelijke activiteit", "reclameactiviteit", "standplaatsactiviteit"],
    "erfgoed": ["cultureel-erfgoedactiviteit", "monumentenactiviteit", "rijksmonumentenactiviteit", "werelderfgoedactiviteit"],
    "infrastructuur": ["aansluitactiviteit", "beperkingengebiedactiviteit m.b.t. een leiding"],
    "landbouw": ["agrarische activiteit", "landinrichtingsactiviteit"],
    "milieu": ["lozingsactiviteit", "milieubelastende activiteit", "milieubelastende activiteit met beperkt effect",
               "milieubelastende activiteit overig", "opslagactiviteit", "stortingsactiviteit"],
    "mobiliteit": ["beperkingengebiedactiviteit m.b.t. een luchthaven", "beperkingengebiedactiviteit m.b.t. een spoorweg",
                   "beperkingengebiedactiviteit m.b.t. een weg", "parkeeractiviteit", "uitritactiviteit", "wegactiviteit"],
    "natuur": ["dierenactiviteit", "flora- en fauna-activiteit", "jachtgeweeractiviteit", "kapactiviteit",
               "natura 2000-activiteit", "natuuractiviteit", "toegangsactiviteit", "valkeniersactiviteit"],
    "planologisch gebruik": ["herstructureringsactiviteit", "moderniseringsactiviteit", "planologische gebruiksactiviteit"],
    "recreatie": ["gelegenheid-tot-zwemmen-en-baden-biedenactiviteit", "kampeeractiviteit", "ontspanningsactiviteit",
                  "recreatieactiviteit", "sportactiviteit"],
    "veiligheid": ["alarminstallatieactiviteit"],
    "water": ["beperkingengebiedactiviteit m.b.t. een bergingsgebied",
              "beperkingengebiedactiviteit m.b.t. een installatie in een waterstaatswerk",
              "beperkingengebiedactiviteit m.b.t. een oppervlaktewaterlichaam",
              "beperkingengebiedactiviteit m.b.t. een waterkering", "beperkingengebiedactiviteit m.b.t. een waterstaatswerk",
              "beperkingengebiedactiviteit m.b.t. een zuiveringtechnisch werk", "beperkingengebiedactiviteit m.b.t. grondwater",
              "beperkingengebiedactiviteit m.b.t. zeegebied", "grondwateractiviteit", "hemelwateractiviteit",
              "noordzee-activiteit", "wateronttrekkingsactiviteit", "waterstaatswerkenactiviteit"],
    "wonen": ["ligplaatsactiviteit", "woonactiviteit"],
}.items() for g in gs}


def tegel_d(categorie, sub):
    if not categorie:
        return None
    if categorie == "procedures":
        return "overheid" if sub == "instructieregels" else "aanvragen"
    return THEMA_D.get(categorie)


def tegels_d(a, met_actgroep):
    """Variant D: (tegels, chips, herkomst). Chips zijn de labels die de bezoeker op niveau 2 ziet."""
    p, themas = a["pad"], a["imow"]
    uit, herkomst = [], None
    if p:
        t = tegel_d(p["categorie"], p["sub"])
        if t:
            uit.append(t)
            herkomst = "pad"
    elif themas:
        specifiek = [t for t in themas if t not in KOEPELTHEMAS]
        for th in (specifiek or themas):
            t = THEMA_D.get(th)
            if t and t not in uit:
                uit.append(t)
        herkomst = "annotatie" if uit else None
    for ga in a["ann"]["ga"]:
        t = GA_TYPE_D.get(norm(ga["type"]))
        if t and t not in uit:
            uit.append(t)
            herkomst = herkomst or "gebiedsaanwijzing"
    if met_actgroep:
        for ac in a["ann"]["act"]:
            t = THEMA_D.get(ACTGROEP_THEMA.get(norm(ac["groep"]), ""))
            if t and t not in uit:
                uit.append(t)
                herkomst = herkomst or "activiteitengroep"
    chips = ([p["sub"]] if p and p.get("sub") else []) + [x["naam"] for x in a["ann"]["act"]] + \
            [x["naam"] for x in a["ann"]["ga"]]
    chips = list(dict.fromkeys(c for c in chips if c))
    return uit or ["niet-ingedeeld"], chips, herkomst


def artikel_wid(wid):
    m = re.match(r"^(.*?__art_[^_]+)", wid or "")
    return m.group(1) if m else wid


# ── hulpjes ──
def norm(s):
    s = unicodedata.normalize("NFKD", str(s or "")).encode("ascii", "ignore").decode()
    s = re.sub(r"[‘’“”'\"]", "", s.lower())
    return re.sub(r"\s+", " ", s).strip()


def norm_nr(s):
    return norm(s).rstrip(".").replace(" ", "")


class Api:
    def __init__(self, basis, timeout=90):
        self.basis = basis.rstrip("/")
        self.timeout = timeout
        self.cache = {}
        self.aanroepen = 0

    def _haal(self, url, body=None):
        sleutel = url + "|" + (json.dumps(body, sort_keys=True) if body is not None else "")
        if sleutel in self.cache:
            return self.cache[sleutel]
        data = json.dumps(body).encode() if body is not None else None
        hdr = dict(UA, **({"Content-Type": "application/json"} if body is not None else {}))
        fout = None
        for poging in range(3):
            try:
                self.aanroepen += 1
                with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=hdr), timeout=self.timeout) as r:
                    uit = json.load(r)
                self.cache[sleutel] = uit
                return uit
            except urllib.error.HTTPError as e:
                fout = e
                if e.code < 500:   # 4xx: opnieuw proberen helpt niet
                    break
            except (urllib.error.URLError, TimeoutError) as e:
                fout = e
            time.sleep(2 * (poging + 1))   # koude cache op prod geeft soms een 500 na 20 s
        raise RuntimeError("%s → %s" % (url, fout))

    def get(self, pad):
        return self._haal(self.basis + pad)

    def post(self, pad, body):
        return self._haal(self.basis + pad, body)

    def pdok(self, pad):
        return self._haal(PDOK + pad)


def q(s):
    return urllib.parse.quote(str(s), safe="")


# ── stap 1: locatie ──
def los_locatie(api, loc):
    if "rd" in loc:
        x, y = loc["rd"]
        return {"x": round(x), "y": round(y), "label": "RD %s, %s" % (x, y), "ok": True}
    d = api.pdok("/free?rows=1&fq=%s&fl=%s&q=%s" % (
        q("type:(adres OR perceel)"), q("weergavenaam,type,centroide_rd"), q(loc["pdok_q"])))
    docs = d.get("response", {}).get("docs", [])
    if not docs:
        return {"ok": False, "label": None, "melding": "PDOK vond niets voor %r" % loc["pdok_q"]}
    m = re.search(r"POINT\s*\(\s*([\d.]+)\s+([\d.]+)\s*\)", docs[0].get("centroide_rd", ""))
    label = docs[0].get("weergavenaam")
    ok = norm(loc["verwacht"]) in norm(label)
    return {"x": round(float(m.group(1))), "y": round(float(m.group(2))), "label": label, "ok": ok,
            "melding": None if ok else "PDOK gaf %r, verwacht %r" % (label, loc["verwacht"])}


# ── stap 2: kenmerk op het punt (de 'filter op kenmerken'-route) ──
def kandidaten_kenmerk(obj, k):
    s = k["soort"]
    if s == "normwaarde":
        return [(o.get("naam"), o) for o in obj.get("normwaarden", [])]
    if s == "omgevingswaarde":
        return [(o.get("naam"), o) for o in obj.get("normwaarden", []) + obj.get("omgevingsnormen", [])]
    if s == "activiteit":
        return [(o.get("naam"), o) for o in obj.get("activiteitlocatieaanduidingen", [])]
    if s == "gebiedsaanwijzing":
        return [("%s %s" % (o.get("naam") or "", o.get("groep") or ""), o) for o in obj.get("gebiedsaanwijzingen", [])]
    if s == "wro":
        return [(o.get("naam"), o) for o in obj.get("wro_bestemmingen", [])
                if not k.get("object_type") or norm(o.get("object_type")) == norm(k["object_type"])]
    raise ValueError(s)


def regelingen_van(o):
    """Uit welke regeling(en) komt dit object op het punt? (objecten-endpoint, per soort anders)"""
    uit = list(o.get("regelingen") or [])
    for sleutel in ("regeling", "plan"):
        if o.get(sleutel):
            uit.append(o[sleutel])
    return uit


def toets_kenmerk(obj, k, negatief, docs=None):
    if not k:
        return {"status": "n.v.t."}
    treffers = [o for naam, o in kandidaten_kenmerk(obj, k) if norm(k["naam"]) in norm(naam)]
    if negatief and docs:
        # Een negatieve vraag gaat over het verwachte document: "Dakkapel bouwen" uit het Bbl
        # (landelijk ambtsgebied) maakt "het omgevingsplan regelt hier niets" niet onwaar.
        def uit_verwacht(o):
            return any(all(norm(f) in norm(r) for f in d["titel"]) for d in docs for r in regelingen_van(o))
        treffers = [o for o in treffers if uit_verwacht(o)]
    namen = sorted({o.get("naam") for o in treffers if o.get("naam")})
    if negatief:
        return {"status": "FAIL" if treffers else "PASS", "gevonden": namen,
                "uitleg": "kenmerk staat er ten onrechte" if treffers else "terecht geen kenmerk"}
    if not treffers:
        return {"status": "FAIL", "gevonden": [], "uitleg": "geen %s '%s' op dit punt" % (k["soort"], k["naam"])}
    if k.get("waarden"):
        gevonden = sorted({float(o["waarde"]) for o in treffers if o.get("waarde") is not None})
        verwacht = sorted(float(w) for w in k["waarden"])
        st = "PASS" if gevonden == verwacht else ("DEELS" if set(gevonden) & set(verwacht) else "FAIL")
        return {"status": st, "gevonden": namen, "waarden": gevonden, "verwacht": verwacht}
    return {"status": "PASS", "gevonden": namen}


# ── stap 3: document en artikel ──
def zoek_document(docs, spec):
    frs = [norm(f) for f in spec["titel"]]
    hits = [d for d in docs if d.get("bron_type") == spec["type"] and all(f in norm(d.get("regeling")) for f in frs)
            and (not spec.get("bron") or spec["bron"] in (d.get("bron_id") or ""))]
    # meerdere kandidaten: de meeste regels op het punt wint (een paraplu-herziening noemt 'binnenstad' ook)
    return sorted(hits, key=lambda d: -(d.get("aantal") or 0))


def waar_is_document(api, spec):
    """Niet op het punt: bestaat het document wel in het register, en met hoeveel artikelen?"""
    zoekterm = " ".join(spec["titel"])   # alle fragmenten: één fragment ("windpark") vond het juiste document niet
    try:
        d = api.get("/v1/regelingen/zoek?q=%s%s" % (q(zoekterm), "&wro=true" if spec["type"] == "wro" else ""))
    except RuntimeError:
        return "document niet bij dit punt"
    frs = [norm(f) for f in spec["titel"]]
    kand = [r for r in d.get("regelingen") or [] if all(f in norm(r.get("titel")) for f in frs)
            and (r.get("regime") or "").lower() == spec["type"]]
    if not kand:
        return "document niet bij dit punt, en niet te vinden in het register"
    r = kand[0]
    if spec["type"] == "wro" and not r.get("totaal_artikelen"):
        return ("'%s' staat in het register met 0 artikelen; zonder tekst laat regelmix het plan weg "
                "(datalaag)" % r.get("titel"))
    return "'%s' staat in het register (%s artikelen), maar niet bij dit punt" % (r.get("titel"), r.get("totaal_artikelen"))


def boom_index(boom):
    """wid -> artikel-wid, wid -> [nummers van omhullende containers], artikelnummer -> opschrift,
    artikel-wid -> {act: [{naam, groep}], ga: [{naam, type}]} (annotaties van artikel en leden, voor variant D)."""
    ouder, secties, nummers, ann = {}, {}, {}, {}

    def loop(knoop, art, pad):
        t = knoop.get("type")
        a = knoop.get("wid") if t == "Artikel" else art
        p = pad + ([str(knoop.get("nummer"))] if t != "Artikel" and knoop.get("nummer") else [])
        if t == "Artikel" and knoop.get("nummer"):
            nummers[norm_nr(knoop["nummer"])] = knoop.get("opschrift") or ""
        if knoop.get("wid"):
            if a:
                ouder[knoop["wid"]] = a
            secties[knoop["wid"]] = p
        an = knoop.get("annotaties") or {}
        if a and (an.get("activiteiten") or an.get("gebiedsaanwijzingen")):
            v = ann.setdefault(a, {"act": [], "ga": []})
            for x in an.get("activiteiten") or []:
                e = {"naam": x.get("naam") or "", "groep": x.get("groep") or ""}
                if e not in v["act"]:
                    v["act"].append(e)
            for x in an.get("gebiedsaanwijzingen") or []:
                e = {"naam": x.get("naam") or "", "type": x.get("type") or ""}
                if e not in v["ga"]:
                    v["ga"].append(e)
        for k in knoop.get("kinderen") or []:
            loop(k, a, p)

    for k in boom or []:
        loop(k, None, [])
    return ouder, secties, nummers, ann


def raakt_matcher(m, nummer, wid, secties, opschrift=None):
    if "artikel" in m:
        return norm_nr(nummer) == norm_nr(m["artikel"])
    if "sectie" in m:
        s = m["sectie"]
        if wid and s in (secties.get(wid) or []):
            return True
        if wid and re.search(r"_(?:chp|subchp|subsec|sec|para|dvs|div)_%s(?:__|$)" % re.escape(s), wid):
            return True
        # Wro-rijen hebben geen wId: een lid hoort bij de sectie als zijn nummer ermee begint (29.1 -> 29)
        n = norm_nr(nummer)
        return bool(not wid and n and (n == norm_nr(s) or n.startswith(norm_nr(s) + ".")))
    if "opschrift" in m:
        # tekstdelen zonder nummer (structuurvisies, programma's): het opschrift begint met deze tekst
        return norm(opschrift).startswith(norm(m["opschrift"]))
    raise ValueError(m)


def is_groot_rijk(doc):
    # Programma's en visies (via=gebied) zijn klein; zonder boom vond de sectie-matcher par. 2.3 van het
    # Programma Integraal Riviermanagement niet (vraag 34) — dat was een gat in de test, niet in de data.
    return doc.get("bestuurslaag") == "rijk" and doc.get("via") != "gebied" \
        and not re.match(r"^voorbeschermings", doc.get("documenttype") or "", re.I)


def analyseer_document(api, loc, doc):
    rijen = api.get("/v1/viewer/regelmix/document?x=%d&y=%d&bron=%s&bron_type=%s" % (
        loc["x"], loc["y"], q(doc["bron_id"]), doc["bron_type"])).get("regelmix") or []
    ond, boom = None, None
    if doc["bron_type"] == "ow":
        try:
            ond = api.get("/v1/viewer/regeling/%s/onderwerpen?met_annotatie=true" % q(doc["bron_id"]))
        except RuntimeError:
            ond = None
        if not is_groot_rijk(doc):
            try:
                boom = (api.get("/v1/viewer/regeling/%s/boom" % q(doc["bron_id"])) or {}).get("boom")
            except RuntimeError:
                boom = None
    ouder, secties, nummers, ann = boom_index(boom)

    pad = {}
    if ond and ond.get("categorieen"):
        for c in ond["categorieen"]:
            via_annot = set(c.get("wids_annotatie") or [])
            for w in c.get("wids") or []:
                if w not in via_annot:
                    pad[w] = {"categorie": c["naam"], "sub": None}
            for s in c.get("sub") or []:
                for w in s.get("wids") or []:
                    if w in pad:
                        pad[w]["sub"] = s["naam"]
    imow = (ond and (ond.get("imow_themas") or ond.get("annotatie_themas"))) or {}

    artikelen = {}
    for i, r in enumerate(rijen):
        if doc["bron_type"] == "wro":
            sleutel, aw = "wro-%d" % i, None
        else:
            aw = ouder.get(r.get("wid")) or artikel_wid(r.get("wid"))
            sleutel = aw
        a = artikelen.get(sleutel)
        if not a:
            p = pad.get(aw) if aw else None
            if doc["bron_type"] == "wro" and r.get("categorie"):
                # Wro-indeling per rij (OCD v2a.wro_artikel_indeling), zoals app.js bouwAnalyse
                p = {"categorie": r["categorie"], "sub": r.get("subcategorie")}
            a = artikelen[sleutel] = {
                "wid": aw, "nummer": r.get("artikel_nummer") or "", "opschrift": r.get("artikel_opschrift") or r.get("artikel") or "",
                "pad": p, "imow": imow.get(aw) if aw else None, "rij_wids": [], "inhoud": r.get("inhoud"),
                "ann": ann.get(aw) or {"act": [], "ga": []}}
        if r.get("wid"):
            a["rij_wids"].append(r["wid"])
        # zonder boom (grote rijksregelingen) kent alleen de regelmix-rij de activiteit, zonder groep
        if r.get("activiteit_naam") and not any(x["naam"] == r["activiteit_naam"] for x in a["ann"]["act"]):
            a["ann"] = {"act": a["ann"]["act"] + [{"naam": r["activiteit_naam"], "groep": ""}], "ga": a["ann"]["ga"]}
    return {"rijen": len(rijen), "artikelen": list(artikelen.values()), "secties": secties, "nummers": nummers,
            "indeling_opgehaald": bool(ond and ond.get("categorieen")), "boom": boom is not None}


def tegels(a, modus):
    p = a["pad"] if modus != "imow" else None
    themas = a["imow"] if (modus == "imow" or (modus == "hybride" and not p)) else None
    if p:
        return [onderwerp_van(p["categorie"], p["sub"])], p.get("sub"), "pad"
    if themas:
        return onderwerpen_uit_themas(themas), None, "annotatie"
    return ["niet-ingedeeld"], None, None


# ── stap 4: vraag ──
def toets_vraag(api, loc, vraag, gevonden_docs, specs):
    d = api.post("/v1/regelteksten-bij-vraag", {"question": vraag, "x": loc["x"], "y": loc["y"], "max_concepts": 5,
                                                "max_regelteksten": 50, "uitgesloten_termen": []})
    hits = sorted(d.get("regelteksten") or [], key=lambda h: -float(h.get("relevantie") or 0))
    top = [{"rang": i + 1, "artikel": h.get("artikel_nummer"), "opschrift": h.get("artikel_opschrift") or h.get("artikel"),
            "regeling": h.get("regeling"), "route": h.get("join_pad")} for i, h in enumerate(hits[:5])]
    eerste_doc, eerste_art = None, None
    for i, h in enumerate(hits):
        for doc, spec in zip(gevonden_docs, specs):
            zelfde = doc and h.get("regeling_expression") == doc["bron_id"]
            zelfde = zelfde or all(norm(f) in norm(h.get("regeling")) for f in spec["titel"])
            if not zelfde:
                continue
            eerste_doc = eerste_doc or i + 1
            if eerste_art is None and any(raakt_matcher(m, h.get("artikel_nummer"), h.get("wid"), {}, h.get("artikel_opschrift") or h.get("artikel")) for m in spec.get("match") or []):
                eerste_art = i + 1
    return {"aantal": len(hits), "rang_artikel": eerste_art, "rang_document": eerste_doc, "top5": top,
            "begrippen": [c.get("naam") for c in d.get("matched_concepts") or []]}


# ── toegang via onderwerp (Excel kolom N en O) ──
# Hoeveel artikelen deelt het gezochte artikel zijn tegel (of subonderwerp) mee? Te veel en
# het sneeuwt onder. Weging volgens gebruikersbesluit 2026-10-23.
def gewicht(n):
    return 1.0 if n <= 10 else 0.9 if n <= 20 else 0.7 if n <= 30 else 0.5


def is_voorbescherming(d):
    return d.get("bron_type") == "ow" and re.match(r"^voorbeschermingsregels", d.get("documenttype") or "", re.I)


def ouder_type(d):
    t = (d.get("documenttype") or "").lower()
    if "omgevingsverordening" in t:
        return "Omgevingsverordening"
    if "omgevingsplan" in t:
        return "Omgevingsplan"
    if re.search("omgevingsverordening", d.get("regeling") or "", re.I):
        return "Omgevingsverordening"
    if re.search("omgevingsplan", d.get("regeling") or "", re.I):
        return "Omgevingsplan"
    return "Omgevingsverordening" if d.get("bestuurslaag") == "provincie" else "Omgevingsplan"


def aanvullend_bij(docs, doc):
    """Voorbeschermingsregels die de site onder dit document hangt (koppelAanvullend in app.js)."""
    bh = lambda d: (str(d.get("bron_id") or "").split("/") + [""] * 5)[4]
    hoofd = [d for d in docs if not is_voorbescherming(d)]
    uit = []
    for v in docs:
        if not is_voorbescherming(v):
            continue
        kand = [d for d in hoofd if d.get("bron_type") == "ow" and d.get("documenttype") == ouder_type(v)]
        ouder = ([d for d in kand if bh(d) == bh(v)] or kand or [None])[0]
        if ouder is doc:
            uit.append(v)
    return uit


def normsub(s):
    return norm(s).replace(" ", "")


# Subonderwerpen die een verfijning zijn van een breder subonderwerp uit kolom M.
# Spiegel van VERFIJNING in OCD dso-loader/curatie/subcategorie_regels.py
# (2026-10-23). Valt het artikel in zo'n verfijning, dan kiest de bezoeker die
# fijnere chip en telt dát subonderwerp.
VERFIJND_UIT = {
    "bouwen en verbouwen": {"dakkapellen, dakopbouwen en dakterrassen", "bijbehorende bouwwerken",
                            "bouwwerken, geen gebouwen", "woonschepen, woonarken en woonwagens",
                            "gevoelige gebouwen", "aansluitingen, bluswater en bereikbaarheid", "welstand",
                            "hoofdgebouwen", "vergunningen voor bouwen"},
    "natuur en bomen": {"bomen en houtopstanden", "flora en fauna", "natuurgebieden"},
}


def past_sub(s, verwacht):
    if not (s and verwacht):
        return False
    return normsub(s) == normsub(verwacht) or normsub(s) in {normsub(f) for f in VERFIJND_UIT.get(norm(verwacht), ())}


def toegang(raak, alle, tegel, sub, modus, sub_fijn=None):
    """Valt een gezocht artikel onder de verwachte tegel, en tussen hoeveel artikelen staat het?
    Met het verwachte subonderwerp telt de sub; zonder (of als het artikel een andere sub heeft) de tegel."""
    per = [(a,) + tegels(a, modus) for a in alle]
    in_tegel = [x for x in per if tegel in x[1]]
    beste = None
    for a in raak:
        t, s, h = tegels(a, modus)
        if tegel not in t:
            continue
        if sub_fijn:   # strenge lezing: alleen de chip die de bezoeker bij deze vraag kiest telt
            if s and normsub(s) == normsub(sub_fijn):
                n, via = len([x for x in in_tegel if x[2] and normsub(x[2]) == normsub(s)]), "chip '%s'" % s
            else:
                n, via = len(in_tegel), "onderwerp — niet in chip '%s' maar in '%s'" % (sub_fijn, s or "–")
        elif past_sub(s, sub):
            n = len([x for x in in_tegel if x[2] and normsub(x[2]) == normsub(s)])
            via = "subonderwerp" if normsub(s) == normsub(sub) else "subonderwerp '%s'" % s
        else:
            n, via = len(in_tegel), "onderwerp"
        kand = {"gevonden": True, "artikel": a["nummer"] or a["opschrift"], "n": n, "via": via, "score": gewicht(n)}
        if not beste or kand["score"] > beste["score"] or (kand["score"] == beste["score"] and n < beste["n"]):
            beste = kand
    if beste:
        return beste
    waar = sorted({t for a in raak for t in tegels(a, modus)[0]})
    return {"gevonden": False, "score": 0.0, "uitleg": "artikel valt onder %s" % ("+".join(waar) or "?")}


MODI_D = {"stelsel": False, "stelsel_act": True}   # modus -> activiteitengroep op niveau 1
MODI_E = ("meervoudig",)
MODI = ("pad", "imow", "hybride") + tuple(MODI_D) + MODI_E

# ── Variant E: D + meer tegels per artikel (2026-10-24) ──
# Zelfde tegels en chips als D, maar een artikel staat onder ELKE tegel waarover het iets regelt:
# het opschriftpad, alle IMOW-thema's (ook naast het pad), elke gebiedsaanwijzing en activiteitengroep,
# en bij Wro de functies uit de bestemmingsomschrijving (alleen het hoofddeel, vóór "ondergeschikt").
# Doel: vragen waarvan het antwoord in een artikel over iets anders staat ("houtzagerij" -> Wonen - A1,
# dat bedrijven van categorie 1 en 2 toelaat). Risico: vollere tegels, dus lagere weging.
FUNCTIE_E = [
    (r"bedrij|winkel|detailhandel|horeca|kantoor|dienstverlen|verhuur|pension|bed (?:en|&) breakfast|logies",
     "d-werken"),
    (r"recreati|sport|kampe|jachthaven|ligplaats", "d-werken"),
    (r"agrari|landbouw|veehouder|glastuin|paardenhouder", "d-landbouw"),
    (r"natuur|bos\b|landschapswaarde", "d-natuur"),
    (r"waterstaat|waterkering|waterberging", "d-bodem-water"),
    (r"verkeer|parkeer|spoor", "d-verkeer"),
    (r"archeolog|monument|cultuurhistor", "d-erfgoed"),
    (r"energie|windturbine|zonne", "d-energie"),
    (r"wonen|woning", "d-bouwen"),
]


def tegels_e(a):
    """Variant E: (tegels, chips, herkomst)."""
    uit, chips, herkomst = tegels_d(a, True)
    uit = [t for t in uit if t != "niet-ingedeeld"]
    for th in a.get("imow") or []:
        t = THEMA_D.get(th)
        if t and t not in uit:
            uit.append(t)
            herkomst = herkomst or "annotatie"
    if re.search(r"bestemmingsomschrijving", a.get("opschrift") or "", re.I) and a.get("inhoud"):
        hoofd = re.split(r"ondergeschikt", a["inhoud"], 1, flags=re.I)[0].lower()
        for patroon, t in FUNCTIE_E:
            if re.search(patroon, hoofd) and t not in uit:
                uit.append(t)
                herkomst = herkomst or "bestemmingsomschrijving"
    return uit or ["niet-ingedeeld"], chips, herkomst


def toegang_d(raak, alle, tegel, termen, met_actgroep, fn=None):
    """Variant D: valt het artikel onder de D-tegel, en tussen hoeveel artikelen staat het? Herkent de
    bezoeker een chip van het artikel aan een woord uit zijn vraag, dan telt die chip (de kleinste)."""
    fn = fn or (lambda a: tegels_d(a, met_actgroep))
    per = [(a,) + fn(a) for a in alle]
    in_tegel = [x for x in per if tegel in x[1]]
    termen = [norm(t) for t in termen or []]
    beste = None
    for a in raak:
        t, chips, _ = fn(a)
        if tegel not in t:
            continue
        n, via = len(in_tegel), "onderwerp"
        for chip in chips:
            if any(term in norm(chip) for term in termen):
                m = len([x for x in in_tegel if chip in x[2]])
                if m < n:
                    n, via = m, "chip '%s'" % chip
        kand = {"gevonden": True, "artikel": a["nummer"] or a["opschrift"], "n": n, "via": via, "score": gewicht(n)}
        if not beste or kand["score"] > beste["score"] or (kand["score"] == beste["score"] and n < beste["n"]):
            beste = kand
    if beste:
        return beste
    waar = sorted({t for a in raak for t in fn(a)[0]})
    return {"gevonden": False, "score": 0.0, "uitleg": "artikel valt onder %s" % ("+".join(waar) or "?")}


# ── één case ──
def draai_case(api, c, met_vraag=True):
    uit = {"id": c["id"], "vraag": c["vraag"], "routes": {}, "documenten": []}
    R = uit["routes"]
    loc = los_locatie(api, c["locatie"])
    uit["locatie"] = loc
    R["locatie"] = "PASS" if loc.get("ok") else "FAIL"
    if "x" not in loc:
        return uit

    docs = api.get("/v1/viewer/regelmix?x=%d&y=%d" % (loc["x"], loc["y"])).get("documenten") or []
    uit["documenten_op_punt"] = len(docs)

    obj = api.get("/v1/viewer/objecten?x=%d&y=%d" % (loc["x"], loc["y"]))
    kt = toets_kenmerk(obj, c.get("kenmerk"), c.get("negatief"), c["documenten"])
    uit["kenmerk"] = kt
    R["kenmerk"] = kt["status"]

    gevonden, doc_ok, art_st, ond_st = [], [], [], {m: [] for m in MODI}
    for spec in c["documenten"]:
        kand = zoek_document(docs, spec)
        doc = kand[0] if kand else None
        du = {"spec": spec["titel"], "gevonden": bool(doc), "afwezig": bool(spec.get("afwezig"))}
        uit["documenten"].append(du)
        if spec.get("afwezig"):   # negatieve case: het document hoort hier juist niet
            doc_ok.append(not doc)
            du["uitleg"] = "staat er ten onrechte" if doc else "terecht niet op dit punt"
            gevonden.append(None)
            continue
        gevonden.append(doc)
        doc_ok.append(bool(doc))
        if not doc:
            du["uitleg"] = waar_is_document(api, spec)
            if spec.get("match"):
                art_st.append("FAIL")
            continue
        du.update(regeling=doc["regeling"], bron_id=doc["bron_id"], via=doc.get("via"), aantal=doc.get("aantal"))
        if not spec.get("match"):
            continue
        an = analyseer_document(api, loc, doc)
        du["artikelen_op_punt"] = len(an["artikelen"])
        raak = [a for a in an["artikelen"]
                if any(raakt_matcher(m, a["nummer"], w, an["secties"], a["opschrift"]) for m in spec["match"] for w in (a["rij_wids"] or [a["wid"]]))]
        du["geraakt"] = [a["nummer"] or a["opschrift"] or (a["wid"] or "").split("__")[-1] for a in raak]
        if raak:
            art_st.append("PASS")
        else:
            art_st.append("FAIL")
            gezocht = [m.get("artikel") for m in spec["match"] if "artikel" in m]
            if an["boom"] and gezocht:
                bestaat = ["%s '%s'" % (g, an["nummers"][norm_nr(g)]) for g in gezocht if norm_nr(g) in an["nummers"]]
                du["uitleg"] = ("artikel %s staat in de geldende versie, maar niet bij dit punt "
                                "(let op: het Excel kan een oudere versie bedoelen)" % "; ".join(bestaat)
                                if bestaat else "artikelnummer niet in de documentboom van de geldende versie")
            elif doc["bron_type"] == "wro":
                # Wro levert alle teksten van het plan, niet per punt: ontbreekt het artikel,
                # dan ontbreekt het in de datalaag. Tel wat OCD van het plan heeft.
                try:
                    tk = api.get("/v1/viewer/wro/%s/detail" % q(doc["bron_id"])).get("teksten") or []
                    du["uitleg"] = ("Wro: OCD heeft %d tekstobjecten van dit plan, %d met een nummer; %s zit er niet bij "
                                    "(datalaag, niet de route)" % (len(tk), len([t for t in tk if t.get("nummer")]),
                                                                    ", ".join(gezocht) or "het artikel"))
                except RuntimeError:
                    du["uitleg"] = "Wro: regelmix/document levert %d rijen, artikel zit er niet bij" % an["rijen"]
            else:
                du["uitleg"] = "niet bij de artikelen op dit punt"
        if not raak:
            continue
        # Wro telt sinds 2026-10-24 mee: het onderwerp per rij komt uit de Wro-indeling
        # (OCD v2a.wro_artikel_indeling), zoals de register-branch wro-onderwerpen het toont.
        # Een Wro-plan heeft geen IMOW-annotatie, dus variant B vindt daar niets — terecht.
        alle = list(an["artikelen"])
        for v in aanvullend_bij(docs, doc):
            alle += analyseer_document(api, loc, v)["artikelen"]
        du["aanvullend"] = len(alle) - len(an["artikelen"])
        if c.get("onderwerp"):
            du["toegang"] = {m: toegang(raak, alle, c["onderwerp"], c.get("sub"), m, c.get("sub_fijn"))
                             for m in ("pad", "imow", "hybride")}
            if c.get("onderwerp_d"):
                du["toegang"].update({m: toegang_d(raak, alle, c["onderwerp_d"], c.get("termen_d"), act)
                                      for m, act in MODI_D.items()})
                du["toegang"]["meervoudig"] = toegang_d(raak, alle, c["onderwerp_d"], c.get("termen_d"), True, tegels_e)
        du["indeling"] = {}
        for modus in MODI:
            per = []
            for a in raak:
                if modus in MODI_D or modus in MODI_E:
                    t, chips, h = tegels_d(a, MODI_D[modus]) if modus in MODI_D else tegels_e(a)
                    s = " · ".join(chips) or None
                else:
                    t, s, h = tegels(a, modus)
                per.append({"artikel": a["nummer"] or a["opschrift"] or (a["wid"] or "").split("__")[-1],
                            "tegels": t, "sub": s, "herkomst": h})
            du["indeling"][modus] = per
            doel_tegel = c.get("onderwerp_d") if (modus in MODI_D or modus in MODI_E) else c.get("onderwerp")
            if doel_tegel:
                ond_st[modus].append("PASS" if any(doel_tegel in p["tegels"] for p in per) else "FAIL")
            else:
                ond_st[modus].append("info")

    uit["toegang"] = toegang_case(c, uit["documenten"], kt)
    R["document"] = ("PASS" if all(doc_ok) else ("DEELS" if any(doc_ok) else "FAIL")) if doc_ok else "n.v.t."
    R["artikel"] = samen(art_st)
    for modus, lijst in ond_st.items():
        R[modus] = samen(lijst) if lijst else "n.v.t."

    if met_vraag:
        try:
            v = toets_vraag(api, loc, c["vraag"], gevonden, c["documenten"])
        except RuntimeError as e:
            v = {"fout": str(e)}
        uit["vraag_route"] = v
        heeft_matcher = any(s.get("match") for s in c["documenten"])
        if "fout" in v:
            R["vraag"] = "FOUT"
        elif c.get("negatief"):
            R["vraag"] = "info"
        elif heeft_matcher:
            r = v["rang_artikel"]
            R["vraag"] = "PASS" if r and r <= VRAAG_ZICHTBAAR else ("LAAT" if r else "FAIL")
        else:
            r = v["rang_document"]
            R["vraag"] = "DOC" if r and r <= VRAAG_ZICHTBAAR else "FAIL"
    return uit


def toegang_case(c, documenten, kenmerk=None):
    """Per indeling: de beste toegang over de verwachte documenten, of de reden dat er geen is.

    Negatieve vraag: niet te vinden langs een tegel, maar "terecht leeg" als het kenmerk terecht
    ontbreekt (telt in het totaal 'haalbaar'). Buiten bereik (37, 40): telt in 'haalbaar' niet mee."""
    def geen(reden, **extra):
        return {m: dict({"gevonden": False, "score": 0.0, "uitleg": reden}, **extra) for m in MODI}
    if c.get("buiten_scope"):
        return geen("buiten bereik: " + c["buiten_scope"], buiten_scope=True)
    if c.get("negatief"):
        leeg = bool(kenmerk and kenmerk.get("status") == "PASS")
        return geen("negatieve vraag: " + ("terecht leeg" if leeg else "kenmerk staat er ten onrechte of is niet getoetst"),
                    terecht_leeg=leeg)
    if not c.get("onderwerp"):
        return geen("geen toeleiding (kolom M) in het Excel")
    if not any(s.get("match") for s in c["documenten"]):
        return geen("geen verwacht artikel om naar te zoeken")
    uit = {}
    for m in MODI:
        kand = [d["toegang"][m] for d in documenten if d.get("toegang") and m in d["toegang"]]
        if kand:
            uit[m] = max(kand, key=lambda t: (t["score"], -t.get("n", 0)))
            continue
        d = next((d for d in documenten if not d.get("afwezig")), {})
        if not d.get("gevonden"):
            reden = "document niet op dit punt"
        elif d.get("bron_id", "").startswith("NL.IMRO"):
            reden = "Wro-plan: geen onderwerp-indeling"
        elif not d.get("geraakt"):
            reden = "artikel niet op dit punt"
        else:
            reden = "geen indeling opgehaald"
        uit[m] = {"gevonden": False, "score": 0.0, "uitleg": reden}
    return uit


def samen(lijst):
    lijst = [s for s in lijst if s != "info"] or lijst
    if not lijst:
        return "n.v.t."
    if all(s == "info" for s in lijst):
        return "info"
    if all(s == "PASS" for s in lijst):
        return "PASS"
    return "DEELS" if "PASS" in lijst else "FAIL"


# ── rapport ──
KOLOMMEN = [("locatie", "Loc"), ("document", "Doc"), ("kenmerk", "Kenmerk"), ("artikel", "Artikel"),
            ("pad", "Opschriftpad"), ("imow", "Annotatie"), ("hybride", "Hybride"), ("stelsel", "Thema+act"),
            ("stelsel_act", "Thema+actgroep"), ("meervoudig", "Meervoudig"), ("vraag", "Vraag")]


def excel_ja(v):
    v = norm(v)
    if not v or v.startswith("niet bepaald") or v in ("ro", "zoeken op punt", "zie 15", "geen ro"):
        return None
    if v.startswith("nee") or v.startswith("niet ") or "ontbreekt" in v or "niet gevonden" in v or "verkeerde" in v \
            or "teveel" in v or "100-en" in v or "geen " in v:
        return False
    return True


VARIANTEN = [("pad", "A · opschriftpad"), ("imow", "B · annotatie"), ("hybride", "C · hybride"),
             ("stelsel", "D · thema-en-activiteitindeling"), ("stelsel_act", "D′ · + activiteitengroep als tegel"),
             ("meervoudig", "E · meervoudig (D + meer tegels per artikel)")]


def toegang_cel(t):
    if not t:
        return "–"
    if t["gevonden"]:
        return "✓ %s · %d art. (%s) → %d%%" % (t["artikel"], t["n"], t["via"], round(100 * t["score"]))
    return "✗ " + t.get("uitleg", "")


def toegang_sectie(resultaten, g):
    rij = [x for x in resultaten if g[x["id"]].get("benchmark30")]
    if not rij:
        return []
    r = ["", "## Toegang via onderwerp — de %d benchmarkvragen (Excel kolom N en O)" % len(rij), "",
         "Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel "
         "artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. "
         "Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.", "",
         "| Variant | Gevonden | Gewogen score | Excel |", "|---|---|---|---|"]
    excel = {"pad": sum(g[x["id"]]["excel_n"] for x in rij), "imow": sum(g[x["id"]]["excel_o"] for x in rij)}
    for m, naam in VARIANTEN:
        t = [(x.get("toegang") or {}).get(m) or {"gevonden": False, "score": 0} for x in rij]
        r.append("| %s | %d / %d | %.1f / %d (%d%%) | %s |" % (
            naam, sum(1 for y in t if y["gevonden"]), len(rij), sum(y["score"] for y in t), len(rij),
            round(100 * sum(y["score"] for y in t) / len(rij)),
            ("%d / %d (kolom %s)" % (excel[m], len(rij), "N" if m == "pad" else "O")) if m in excel else "—"))
    # Haalbaar: zonder de vragen buiten bereik, en een negatieve vraag telt als goed als hij terecht leeg is.
    for label, ids in (("vragen 11–40", [x for x in rij]), ("alle 40 vragen", resultaten)):
        tel = [x for x in ids if not g[x["id"]].get("buiten_scope")]
        r += ["", "**Haalbaar, %s** (noemer %d: zonder buiten bereik; negatief = goed als terecht leeg):" % (label, len(tel)), "",
              "| Variant | Gewogen score |", "|---|---|"]
        for m, naam in VARIANTEN:
            sc = 0.0
            for x in tel:
                t = (x.get("toegang") or {}).get(m) or {}
                sc += 1.0 if t.get("terecht_leeg") else (t.get("score") or 0)
            r.append("| %s | %.1f / %d (%d%%) |" % (naam, sc, len(tel), round(100 * sc / max(len(tel), 1))))
    r += ["", "| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |",
          "|---|---|---|---|---|---|---|"]
    for x in rij:
        c, t = g[x["id"]], x.get("toegang") or {}
        r.append("| %d | %s | %s | %s | %s | %s | %s |" % (
            x["id"], c["excel"].get("toeleiding") or "—", "ja" if c["excel_n"] else "nee", toegang_cel(t.get("pad")),
            "ja" if c["excel_o"] else "nee", toegang_cel(t.get("imow")), toegang_cel(t.get("hybride"))))
    r += ["", "### Variant D — thema-en-activiteitindeling", "",
          "Tegel = Brigittes categorie (via kolom M, afwijkingen in `bouw_golden.py` `D_TEGEL`); chip = een label van "
          "het artikel (subonderwerp, activiteit, gebiedsaanwijzing) met een woord uit de vraag (`D_TERMEN`). "
          "D′ zet daarbij elke activiteitengroep als extra tegel.", "",
          "| # | D-tegel | woorden | C · hybride | D · thema en activiteit | D′ · + activiteitengroep |", "|---|---|---|---|---|---|"]
    for x in rij:
        c, t = g[x["id"]], x.get("toegang") or {}
        r.append("| %d | %s | %s | %s | %s | %s |" % (
            x["id"], TEGELS_D.get(c.get("onderwerp_d"), "—"), ", ".join(c.get("termen_d") or []) or "—",
            toegang_cel(t.get("hybride")), toegang_cel(t.get("stelsel")), toegang_cel(t.get("stelsel_act"))))
    return r


def rapport(resultaten, golden, meta):
    g = {c["id"]: c for c in golden}
    r = ["# RoM-benchmark — run %s" % meta["start"], "",
         "API: `%s` · %d cases · %d API-aanroepen · %.0f s%s" % (meta["api"], len(resultaten), meta["aanroepen"], meta["duur"],
             " · **tegelindeling van vóór 2026-10-23** (water zonder sub → Waterkeringen)" if meta.get("water_als_waterkering") else ""), "",
         "## Totalen", "", "| Route | PASS | DEELS | FAIL | overig | toetsbaar |", "|---|---|---|---|---|---|"]
    for k, naam in KOLOMMEN:
        st = [x["routes"].get(k, "n.v.t.") for x in resultaten]
        p, d, f = st.count("PASS"), st.count("DEELS"), st.count("FAIL") + st.count("LAAT")
        overig = len([s for s in st if s not in ("PASS", "DEELS", "FAIL", "LAAT", "n.v.t.")])
        r.append("| %s | %d | %d | %d | %d | %d |" % (naam, p, d, f, overig, p + d + f))
    r += toegang_sectie(resultaten, g)
    r += ["", "Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, "
          "(sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.", "",
          "## Per case", "",
          "| # | Vraag | " + " | ".join(n for _, n in KOLOMMEN) + " | Excel K/P/A/V |",
          "|---|---|" + "---|" * len(KOLOMMEN) + "---|"]
    for x in resultaten:
        e = g[x["id"]]["excel"]
        ex = "/".join({True: "ja", False: "nee", None: "–"}[excel_ja(e.get(k))]
                      for k in ("filter_op_kenmerken", "opschriftpad", "annotatie", "vraag_route"))
        vr = x["vraag"][:48] + ("…" if len(x["vraag"]) > 48 else "")
        r.append("| %d | %s | %s | %s |" % (x["id"], vr, " | ".join(x["routes"].get(k, "n.v.t.") for k, _ in KOLOMMEN), ex))
    r += ["", "## Toelichting per case", ""]
    for x in resultaten:
        c = g[x["id"]]
        r.append("### %d. %s" % (x["id"], x["vraag"]))
        r.append("- Locatie: %s (%s, %s)%s" % (x["locatie"].get("label"), x["locatie"].get("x"), x["locatie"].get("y"),
                                                " ⚠️ " + x["locatie"]["melding"] if x["locatie"].get("melding") else ""))
        r.append("- Verwacht: %s — *%s*" % (c["excel"]["verwacht_antwoord"], c["excel"]["bron"]))
        k = x.get("kenmerk") or {}
        if k.get("status") not in (None, "n.v.t."):
            extra = (" waarden %s (verwacht %s)" % (k.get("waarden"), k.get("verwacht"))) if "waarden" in k else ""
            r.append("- Kenmerk %s: %s%s%s" % (k["status"], ", ".join(k.get("gevonden") or []) or "—", extra,
                                               " — " + k["uitleg"] if k.get("uitleg") else ""))
        for d in x["documenten"]:
            if d.get("afwezig") or not d["gevonden"]:
                r.append("- Document *%s*: %s" % (" + ".join(d["spec"]), d.get("uitleg") or "niet gevonden op dit punt"))
                continue
            regel = "- Document *%s* (%s regels, via %s)" % (d["regeling"], d.get("aantal"), d.get("via"))
            if "artikelen_op_punt" in d:
                regel += ": %d artikelen op het punt, geraakt %s" % (d["artikelen_op_punt"], ", ".join(d["geraakt"]) or "geen")
            if d.get("uitleg"):
                regel += " — " + d["uitleg"]
            r.append(regel)
            for modus, per in (d.get("indeling") or {}).items():
                r.append("  - %s: %s" % (modus, "; ".join("%s → %s%s" % (p["artikel"], "+".join(p["tegels"]),
                                                                           " / " + p["sub"] if p.get("sub") else "") for p in per)))
        v = x.get("vraag_route")
        if v and "fout" not in v:
            r.append("- Vraag: %d treffers, artikel op rang %s, document op rang %s; begrippen %s" % (
                v["aantal"], v["rang_artikel"] or "—", v["rang_document"] or "—", ", ".join(v["begrippen"]) or "—"))
            for t in v["top5"][:3]:
                r.append("  - %d. art. %s %s — %s" % (t["rang"], t["artikel"] or "", t["opschrift"] or "", t["regeling"] or ""))
        elif v:
            r.append("- Vraag: FOUT %s" % v["fout"])
        r.append("")
    return "\n".join(r)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--api", default="https://omgevingsdocumentenregister.nl/api")
    ap.add_argument("--golden", default=str(HIER / "golden.json"))
    ap.add_argument("--case", help="komma-gescheiden id's, bv. 8,15,21")
    ap.add_argument("--zonder-vraag", action="store_true", help="sla de vraagroute over (scheelt de meeste tijd)")
    ap.add_argument("--water-als-waterkering", action="store_true",
                    help="tegelindeling van vóór 2026-10-23 (water zonder sub → Waterkeringen), zoals het Excel van 20-10 zag")
    ap.add_argument("--uit", default=str(HIER / "runs"))
    a = ap.parse_args()
    global WATER_OUD
    WATER_OUD = a.water_als_waterkering

    golden = json.load(open(a.golden, encoding="utf-8"))
    if a.case:
        ids = {int(i) for i in a.case.split(",")}
        golden = [c for c in golden if c["id"] in ids]
    api = Api(a.api)
    start = datetime.datetime.now()
    resultaten = []
    for c in golden:
        try:
            x = draai_case(api, c, met_vraag=not a.zonder_vraag)
        except RuntimeError as e:
            x = {"id": c["id"], "vraag": c["vraag"], "routes": {"locatie": "FOUT"}, "documenten": [],
                 "locatie": {}, "fout": str(e)}
        resultaten.append(x)
        print("%3d  %s  %s" % (c["id"], "  ".join("%s=%s" % (n, x["routes"].get(k, "-")) for k, n in KOLOMMEN),
                               ("FOUT " + x["fout"][:80]) if x.get("fout") else ""), flush=True)

    meta = {"start": start.strftime("%Y-%m-%d %H:%M"), "api": a.api, "water_als_waterkering": WATER_OUD, "aanroepen": api.aanroepen,
            "duur": (datetime.datetime.now() - start).total_seconds(), "golden": a.golden, "cases": len(golden)}
    doel = Path(a.uit) / start.strftime("%Y-%m-%d_%H%M%S")
    doel.mkdir(parents=True, exist_ok=False)   # nooit een eerdere run overschrijven
    json.dump({"meta": meta, "resultaten": resultaten}, open(doel / "resultaten.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1, default=list)
    (doel / "rapport.md").write_text(rapport(resultaten, json.load(open(a.golden, encoding="utf-8")), meta), encoding="utf-8")
    print("\nRapport: %s" % (doel / "rapport.md"))


if __name__ == "__main__":
    main()
