"""Indeling I — onderwerpen en subonderwerpen in de taal van de bezoeker (2026-11-17).

De indeling zelf staat in public/regels-op-maat/indeling-i.js (JSON in een script); dit bestand
past haar toe. Spiegel van indeelI() en bereidWroVoor() in public/regels-op-maat/thema.js:
wijzig ze samen.

Een artikel: {"pad": {categorie, sub}|None, "imow": [..]|None, "opschrift", "nummer", "inhoud",
              "kopjepad": [opschriften, van buiten naar binnen],
              "ann": {"act": [{naam, groep}], "ga": [{naam, type}]},
              "wro": {bestemming, soort}|None}   # gezet door bereid_wro_voor()
"""
import json
import re
import unicodedata
from pathlib import Path

BRON = Path(__file__).resolve().parents[2] / "public" / "regels-op-maat" / "indeling-i.js"
KOEPEL = {"milieu", "procedures", "planologisch gebruik"}
OVERIG = "overig"
REST = "i-overig"   # de kleine tegel voor wat nergens onder valt
VAST = "*"   # staat vast bovenaan elk subonderwerp van de tegel (de bestemming van de plek)


def klein(s):
    """Zoals klein() in thema.js: zonder accenten, kleine letters, enkele spaties, zonder aanhalingstekens."""
    s = unicodedata.normalize("NFKD", str(s or ""))
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub(r"[‘’“”'\"]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def laad(pad=BRON):
    t = Path(pad).read_text(encoding="utf-8")
    d = json.loads(t[t.index("window.RomIndelingI"):].split("=", 1)[1].rsplit(";", 1)[0])
    rx = lambda p: re.compile(p) if p else None
    for tegel in d["tegels"]:
        for s in tegel["subs"]:
            s["_w"], s["_wro"], s["_niet"] = rx(s.get("w")), rx(s.get("wro")), rx(s.get("niet"))
            s["_pad"], s["_groep"], s["_gatype"] = set(s.get("pad") or []), set(s.get("groep") or []), set(s.get("gatype") or [])
            s["_wrosoort"] = set(s.get("wrosoort") or [])
        for k in ("cat", "imow", "groep", "gatype"):
            tegel["_" + k] = set(tegel.get(k) or [])
        tegel["_wro"] = rx(tegel.get("wro"))
    for k in d["klein"]:
        k["_w"], k["_pad"], k["_wrosoort"] = rx(k.get("w")), set(k.get("pad") or []), set(k.get("wrosoort") or [])
    d["_structuur"], d["_vaag"] = re.compile(d["structuur_act"]), re.compile(d["vaag"])
    d["_wro"] = {k: re.compile(v) for k, v in d["wro"].items()}
    d["_naam"] = {t["id"]: t["naam"] for t in d["tegels"] + d["klein"]}
    d["_sub"] = {(t["id"], s["id"]): s["naam"] for t in d["tegels"] for s in t["subs"]}
    return d


I = laad()


def tegel_naam(tid):
    return I["_naam"].get(tid, tid)


def sub_naam(tid, sid):
    if sid == OVERIG:
        return "Andere regels over " + tegel_naam(tid).lower()
    return I["_sub"].get((tid, sid), sid)


# ── Wro: bestemming en soort regel per artikel ──
def _top(nummer):
    return str(nummer or "").split(".")[0]


def _zonder_nummer(opschrift):
    return re.sub(r"^(artikel\s+)?[\d.]+\s*", "", klein(opschrift))


def bereid_wro_voor(artikelen):
    """Zet a["wro"] = {bestemming, soort} op elk artikel van één bestemmingsplan.
    soort: begrip | meten | algemeen | bouw | gebruik."""
    W = I["_wro"]
    groepen = {}
    for a in artikelen:
        groepen.setdefault(_top(a.get("nummer")), []).append(a)
    for top, xs in groepen.items():
        kop = next((_zonder_nummer(a.get("opschrift")) for a in xs if str(a.get("nummer") or "") == top), "")
        bestemming = ""
        for a in xs:
            m = W["bestemming"].search(klein(a.get("inhoud"))[:400])
            if m:
                bestemming = m.group(1)[:80]
                break
        aangewezen = bool(bestemming)
        bestemming = bestemming or kop
        if top == "":
            groep_soort = None
        # Sommige plannen leveren de begrippen zonder hun kop "Artikel 1 Begrippen".
        elif W["begrip"].search(kop) or (top == "1" and len(xs) >= 5 and not aangewezen):
            groep_soort = "begrip"
        elif W["meten"].search(kop):
            groep_soort = "meten"
        elif W["algemeen"].search(kop):
            groep_soort = "algemeen"
        else:
            groep_soort = None
        kop_van = {str(a.get("nummer") or ""): _zonder_nummer(a.get("opschrift")) for a in xs}
        for a in xs:
            eigen = _zonder_nummer(a.get("opschrift"))
            soort = groep_soort or ("algemeen" if W["algemeen"].search(eigen) else "bouw" if W["bouw"].search(eigen) else "gebruik")
            if soort == "gebruik":
                # Zegt het eigen kopje niets, dan telt het kopje erboven (20.2.5 Dakbeëindiging onder 20.2 Bouwregels).
                delen = str(a.get("nummer") or "").split(".")
                for i in range(len(delen) - 1, 1, -1):
                    boven = kop_van.get(".".join(delen[:i]), "")
                    if W["bouw"].search(boven):
                        soort = "bouw"
                        break
            a["wro"] = {"bestemming": "" if groep_soort else bestemming, "soort": soort, "eigen": eigen}


# ── indelen ──
def _subs_op_tekst(tekst, veld="_w"):
    return [(t["id"], s["id"]) for t in I["tegels"] for s in t["subs"]
            if s[veld] and s[veld].search(tekst) and not (s["_niet"] and s["_niet"].search(tekst))]


def _uniek_op_naam(xs):
    gezien, uit = set(), []
    for x in xs:
        n = klein(x["naam"])
        if n not in gezien:
            gezien.add(n)
            uit.append(x)
    return uit


def indeel(a):
    """-> [(tegel_id, sub_id)], sub_id is None bij een kleine tegel. Nooit leeg."""
    uit = []

    def voeg(paren):
        for p in paren:
            if p not in uit:
                uit.append(p)

    wro = a.get("wro")
    pad = a.get("pad")
    pad_s = "%s > %s" % (pad["categorie"], pad["sub"]) if pad and pad.get("sub") else None
    lagen = [klein(a.get("opschrift"))] + [klein(k) for k in reversed(a.get("kopjepad") or [])]
    if wro:
        lagen = [wro["eigen"]]
    lagen = [l for l in lagen if l and not I["_vaag"].search(l)]

    # Kleine tegels: begrippen en slotbepalingen zeggen niets over een onderwerp.
    klein_hits = []
    alles = " > ".join([klein(a.get("opschrift"))] + [klein(k) for k in a.get("kopjepad") or []])
    for k in I["klein"]:
        if (pad_s and not wro and pad_s in k["_pad"]) or (wro and wro["soort"] in k["_wrosoort"]) or (k["_w"] and k["_w"].search(wro["eigen"] if wro else alles)):
            klein_hits.append((k["id"], None))
    if wro and wro["soort"] in ("begrip", "meten", "algemeen"):
        return klein_hits or [(REST, None)]
    if ("i-begrippen", None) in klein_hits:
        return [("i-begrippen", None)]

    if wro:
        best = wro["bestemming"]
        dubbel = bool(re.match(r"(waarde|leiding|waterstaat)\b", best))
        op_naam = _subs_op_tekst(best, "_wro") + _subs_op_tekst(best) if best else []
        eigen = _subs_op_tekst(wro["eigen"]) + _subs_op_tekst(wro["eigen"], "_wro")
        if wro["soort"] == "bouw" and not dubbel:
            bouw = [p for p in eigen if p[0] == "i-bouwen"]
            voeg(bouw or [("i-bouwen", "maat")])
            voeg([p for p in eigen if p[0] != "i-bouwen"])
        else:
            voeg(op_naam)
            voeg(eigen)
            if "bestemmingsomschrijving" in wro["eigen"] and not dubbel:
                hoofd = re.split(r"ondergeschikt", klein(a.get("inhoud")))[0]
                voeg(_subs_op_tekst(hoofd, "_wro"))
                voeg([(tid, VAST) for tid in I["bestemming"]["tegels"]])
            met_sub = {p[0] for p in uit if p[1] != VAST}
            voeg([(t["id"], OVERIG) for t in I["tegels"] if best and t["_wro"] and t["_wro"].search(best) and t["id"] not in met_sub])
        if not uit and pad_s:
            voeg([(t["id"], s["id"]) for t in I["tegels"] for s in t["subs"] if pad_s in s["_pad"]])
        if not uit and pad:
            voeg([(t["id"], OVERIG) for t in I["tegels"] if pad["categorie"] in t["_cat"]])
        return uit + klein_hits or [(REST, None)]

    # Omgevingswet: het meest specifieke kopje dat iets zegt, wint.
    for laag in lagen:
        h = _subs_op_tekst(laag)
        if h:
            voeg(h)
            break
    ann = a.get("ann") or {}
    acts = _uniek_op_naam(x for x in ann.get("act") or [] if x.get("naam") and not I["_structuur"].search(klein(x["naam"])))
    gas = _uniek_op_naam(x for x in ann.get("ga") or [] if x.get("naam"))
    weinig = len(acts) + len(gas) <= I["max_annotaties"]
    groepen = {klein(x.get("groep")) for x in acts} if weinig else set()
    gatypes = {klein(x.get("type")) for x in gas} if weinig else set()
    if weinig:
        for x in acts + gas:
            voeg(_subs_op_tekst(klein(x["naam"])))
    for t in I["tegels"]:
        for s in t["subs"]:
            if (pad_s and pad_s in s["_pad"]) or (groepen & s["_groep"]) or (gatypes & s["_gatype"]):
                voeg([(t["id"], s["id"])])

    # Alleen het onderwerp bekend: "Andere regels over ...". Het kopje uit het register telt altijd;
    # thema, activiteitengroep en type gebied alleen als het artikel nog nergens een subonderwerp heeft,
    # en een artikel met meer dan max_themas thema's zegt over geen enkel onderwerp iets bijzonders.
    themas = a.get("imow") or []
    specifiek = [x for x in themas if x not in KOEPEL]
    themas = set(specifiek or themas)
    if len(themas) > I["max_themas"]:
        themas = set()
    met_sub = {p[0] for p in uit}
    kaal = not uit
    for t in I["tegels"]:
        if t["id"] in met_sub:
            continue
        if (pad and pad["categorie"] in t["_cat"]) or (kaal and ((themas & t["_imow"]) or (groepen & t["_groep"]) or (gatypes & t["_gatype"]))):
            voeg([(t["id"], OVERIG)])
    uit += klein_hits
    return uit or [(REST, None)]


def staat_onder(plekken, tegel, sub):
    """Staat een artikel met deze plekken onder dit subonderwerp? Ook als het er vast bovenaan staat."""
    return (tegel, sub) in plekken or (tegel, VAST) in plekken
