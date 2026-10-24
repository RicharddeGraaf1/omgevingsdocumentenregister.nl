"""Bouwt golden.json uit het benchmark-Excel plus de curatie hieronder.

Het Excel is vrije tekst; per regel staat hier wat er machinaal te toetsen valt.
De Excel-kolommen gaan ongewijzigd mee onder `excel`.

  python bouw_golden.py "C:/Testbestanden/Lokaal/Testsets-OZON/RoM-benchmark/Testvragen AI experiment - RoM - EL - 20-10-2026.xlsx"

Vereist openpyxl (alleen dit script; de runner zelf is standaardbibliotheek).
"""
import datetime, json, re, sys
from pathlib import Path

import openpyxl

KOLOMMEN = ["nr", "vraag", "locatie", "bevoegd_gezag", "type_bron", "im", "bron", "datum_bron",
            "verwacht_antwoord", "annotatie_toeleiding", "annotatie_naam", "filter_op_kenmerken",
            "toeleiding", "opschriftpad", "annotatie", "vraag_route"]


def lees_excel(pad):
    ws = openpyxl.load_workbook(pad).active
    uit = []
    for r in ws.iter_rows(min_row=2, values_only=True):
        if not isinstance(r[0], int):
            continue   # de totaalregels onderaan
        uit.append({k: (v.date().isoformat() if isinstance(v, datetime.datetime) else (v.strip() if isinstance(v, str) else v))
                    for k, v in zip(KOLOMMEN, r)})
    return uit


# loc: ("rd", x, y) of ("pdok", zoekterm, verwachte weergavenaam-fragment)
# docs: lijst van {titel: [fragmenten, alle verplicht], type: ow|wro, match: [matchers]}
#   bron: fragment dat in het bron_id moet staan (bv. "/pv23/" — Overijssel heet kaal "Omgevingsverordening provincie")
#   afwezig: True = het document hoort hier juist NIET (negatieve case)
# toeleiding_agent: de tegel (in de vorm van kolom M) die een bezoeker bij deze vraag kiest, voor de
#   Wro-vragen waar kolom M leeg is (2026-10-24, curatie van de agent, NIET uit het Excel). Zelfde lezing
#   als de tester bij de Ow-vragen: "winkel beginnen" -> Bedrijven, energie en milieu; detailhandel (vraag 10).
#   De artikelen bij 5, 11, 12, 13 en 39 komen uit de data: de bestemming op het punt (wro_tekst_link).
# sub_fijn: de fijne subonderwerp-chip die een bezoeker bij deze vraag kiest (curatie van de agent,
#   2026-10-23, NIET uit het Excel — kolom M kende alleen het brede subonderwerp). Staat het artikel
#   in een andere chip, dan vindt de bezoeker het daar niet en telt de hele tegel.
#   matcher: {"artikel": "4.22"} | {"sectie": "8.3"}
# kenmerk: {soort, naam, [waarden]}  soort: normwaarde|omgevingsnorm|activiteit|gebiedsaanwijzing|wro
# negatief: het verwachte kenmerk mag hier NIET voorkomen
C = {
 1: dict(loc=("rd", 154799, 466865), docs=[dict(titel=["omgevingsplan gemeente amersfoort"], type="ow")],
         kenmerk=dict(soort="normwaarde", naam="maximale bouwhoogte", waarden=[14])),
 2: dict(loc=("rd", 154803, 466873), docs=[dict(titel=["omgevingsplan gemeente amersfoort"], type="ow")],
         kenmerk=dict(soort="normwaarde", naam="maximale bouwhoogte", waarden=[8])),
 3: dict(loc=("pdok", "3828EB 22", "Kerklaan 22"), docs=[dict(titel=["omgevingsplan gemeente amersfoort"], type="ow")],
         kenmerk=dict(soort="normwaarde", naam="maximale bouwhoogte", waarden=[5, 6, 8, 10, 11, 25, 55])),
 4: dict(loc=("rd", 154737, 466858), docs=[dict(titel=["omgevingsplan gemeente amersfoort"], type="ow")],
         kenmerk=dict(soort="normwaarde", naam="maximale bouwhoogte"), negatief=True),
 5: dict(loc=("pdok", "3811GN 32", "Boldershof 32"), docs=[dict(titel=["binnenstad"], type="wro", match=[{"sectie": "25"}])],
         kenmerk=dict(soort="wro", naam="bouwhoogte", object_type="Maatvoering")),
 6: dict(loc=("rd", 155143, 463394), docs=[dict(titel=["binnenstad"], type="wro")],
         kenmerk=dict(soort="wro", naam="bouwhoogte", object_type="Maatvoering"), negatief=True),
 7: dict(toeleiding_agent="Bouwen en wonen; bouwen en verbouwen", loc=("pdok", "9264TS 3", "De Reidt"), docs=[dict(titel=["earnew", "2013"], type="wro")],
         kenmerk=dict(soort="wro", naam="bebouwingspercentage", object_type="Maatvoering")),
 8: dict(toeleiding_agent="Bedrijven, energie en milieu; detailhandel", loc=("pdok", "1211BN 9", "s-Gravelandseweg 9"), docs=[dict(titel=["binnenstad 2013"], type="wro", match=[{"artikel": "11.1"}])],
         kenmerk=dict(soort="wro", naam="dienstverlening", object_type="Enkelbestemming")),
 9: dict(toeleiding_agent="Bedrijven, energie en milieu; detailhandel", loc=("pdok", "9712CA 7", "Vismarkt 7"), docs=[dict(titel=["binnenstad"], type="wro", match=[{"artikel": "4.1"}])],
         kenmerk=dict(soort="wro", naam="centrum - 1", object_type="Enkelbestemming")),
 10: dict(loc=("pdok", "9713ED 237", "Damsterdiep 237"), docs=[dict(titel=["omgevingsplan gemeente groningen"], type="ow")],
          kenmerk=dict(soort="activiteit", naam="detailhandel")),
 11: dict(toeleiding_agent="Bedrijven, energie en milieu; bedrijven", loc=("pdok", "9264TE 9", "9264TE"), docs=[dict(titel=["earnew", "2013"], type="wro", match=[{"sectie": "29"}])],
          kenmerk=dict(soort="wro", naam="wonen - a1", object_type="Enkelbestemming")),
 12: dict(toeleiding_agent="Bedrijven, energie en milieu; bedrijven", loc=("pdok", "9264TK 17", "Smidspaed 17"), docs=[dict(titel=["earnew", "2013"], type="wro", match=[{"sectie": "22"}, {"sectie": "28"}])],
          kenmerk=dict(soort="wro", naam="recreatie - 1a", object_type="Enkelbestemming")),
 13: dict(toeleiding_agent="Bedrijven, energie en milieu; bedrijven", loc=("pdok", "9264TG 5", "Tsjerkepaed 5"), docs=[dict(titel=["earnew", "2013"], type="wro", match=[{"sectie": "29"}])],
          kenmerk=dict(soort="wro", naam="wonen - a1", object_type="Enkelbestemming")),
 14: dict(toeleiding_agent="Openbare ruimte en verkeer; parkeren", loc=("pdok", "1211JA 13", "Torenlaan 13"), docs=[dict(titel=["noordwestelijk villagebied", "parkeernormen"], type="wro", match=[{"sectie": "4.1"}])],   # 4.1 Parkeren heeft zelf geen tekst: 4.1.1/4.1.2
          kenmerk=dict(soort="wro", naam="parkeernormen 2018", object_type="Gebiedsaanduiding")),
 15: dict(sub_fijn="dakkapellen, dakopbouwen en dakterrassen", loc=("pdok", "3453MD 30", "Does 30"), docs=[dict(titel=["omgevingsplan gemeente utrecht"], type="ow", match=[{"artikel": "4.26"}])],   # Excel: 4.22 (versie 2024-12-27); geldend 2026-08-19: 4.26
          kenmerk=dict(soort="activiteit", naam="dakopbouw")),
 16: dict(loc=("pdok", "7941LC 3", "Vledderstraat 3"),
          docs=[dict(titel=["omgevingsplan gemeente meppel"], type="ow", match=[{"sectie": "8.3"}]),
                dict(titel=["voorbereidingsbesluit", "monumenten"], type="ow", match=[{"artikel": "2.2"}])],
          kenmerk=dict(soort="activiteit", naam="monument")),
 17: dict(loc=("pdok", "9713DD 8", "Zagerij 8"), docs=[dict(titel=["omgevingsplan gemeente groningen"], type="ow")],
          negatief=True),   # 'Dakkapel bouwen' ligt hier wél, maar op het landelijke ambtsgebied (Bbl): geen toetsbaar negatief kenmerk
 18: dict(sub_fijn="dakkapellen, dakopbouwen en dakterrassen", loc=("pdok", "3453MD 30", "Does 30"), docs=[dict(titel=["omgevingsplan gemeente utrecht"], type="ow", match=[{"artikel": "4.24"}])],   # Excel: 4.20 (versie 2024-12-27); geldend 2026-08-19: 4.24
          kenmerk=dict(soort="activiteit", naam="dakkapel")),
 19: dict(sub_fijn="dakkapellen, dakopbouwen en dakterrassen", loc=("pdok", "3453MD 30", "Does 30"), docs=[dict(titel=["omgevingsplan gemeente utrecht"], type="ow", match=[{"artikel": "4.42"}])],   # Excel: 4.31 (versie 2024-12-27); geldend 2026-08-19: 4.42
          kenmerk=dict(soort="activiteit", naam="dakterras")),
 20: dict(loc=("pdok", "7531TS 38", "Aronskelkstraat 38"), docs=[dict(titel=["omgevingsverordening provincie"], bron="/pv23/", type="ow", match=[{"artikel": "3.42"}])],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="kotkamp")),
 21: dict(loc=("pdok", "ODB04 F 405", "ODB04) F 405"), docs=[dict(titel=["waterschapsverordening", "frysl"], type="ow",
          match=[{"sectie": "3.7"}] + [{"artikel": "3.%d" % i} for i in range(8, 17)])],
          kenmerk=dict(soort="activiteit", naam="grondwater onttrekken")),
 22: dict(loc=("rd", 172304, 607360), docs=[dict(titel=["waterschapsverordening", "frysl"], type="ow", match=[{"artikel": "3.5"}])],
          kenmerk=dict(soort="activiteit", naam="oppervlaktewater onttrekken")),
 23: dict(loc=("pdok", "1812PW 34", "Laanenderweg 34"), docs=[dict(titel=["omgevingsverordening nh2022"], type="ow", match=[{"artikel": "6.32b"}])],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="datacenters uitgesloten")),
 24: dict(sub_fijn="flora en fauna", loc=("pdok", "WKP00 F 2523", "WKP00) F 2523"), docs=[dict(titel=["omgevingsverordening zeeland"], type="ow", match=[{"artikel": "12.6"}, {"artikel": "2.153"}])],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="damherten")),
 25: dict(loc=("pdok", "1012JS 1", "Dam 1"), docs=[dict(titel=["omgevingsverordening nh2022"], type="ow")],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="damherten"), negatief=True),
 26: dict(loc=("pdok", "9003XT 1", "De Sayter 1"), docs=[dict(titel=["alde feanen"], type="ow", match=[{"artikel": "2"}])],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="alde feanen")),
 27: dict(loc=("pdok", "9263RB 23", "Inialoane 23"), docs=[dict(titel=["alde feanen"], type="ow", afwezig=True)],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="alde feanen"), negatief=True),
 28: dict(loc=("pdok", "9264TE 9", "9264TE"), docs=[dict(titel=["omgevingsverordening frysl"], type="ow", match=[{"artikel": "3.9"}])],
          kenmerk=dict(soort="omgevingswaarde", naam="overstromingskans bebouwd gebied")),
 29: dict(loc=("pdok", "OTM00 K 530", "OTM00) K 530"), docs=[dict(titel=["omgevingsverordening frysl"], type="ow", match=[{"artikel": "3.9"}])],
          kenmerk=dict(soort="omgevingswaarde", naam="overstromingskans grasland")),
 30: dict(loc=("pdok", "HLM05 A 424", "HLM05) A 424"), docs=[dict(titel=["omgevingsverordening frysl"], type="ow")],
          kenmerk=dict(soort="omgevingswaarde", naam="overstromingskans"), negatief=True),
 31: dict(loc=("pdok", "SDR00 W 583", "SDR00) W 583"), docs=[dict(titel=["omgevingsverordening gelderland"], type="ow", match=[{"artikel": "3.11"}])],
          kenmerk=dict(soort="omgevingswaarde", naam="wateroverlast")),
 32: dict(loc=("pdok", "7201HX 16", "Groenmarkt 16"), docs=[dict(titel=["omgevingsverordening gelderland"], type="ow", match=[{"artikel": "3.11"}])],
          kenmerk=dict(soort="omgevingswaarde", naam="wateroverlast")),
 33: dict(loc=("pdok", "7411CC 23D", "Welle 23D"), docs=[dict(titel=["omgevingsverordening provincie"], bron="/pv23/", type="ow", match=[{"artikel": "2.7"}])]),
 34: dict(loc=("pdok", "6916BC 1", "Rijnstraat 1"), docs=[dict(titel=["integraal riviermanagement"], type="ow", match=[{"sectie": "2.3"}])]),
 35: dict(loc=("pdok", "LLS00 R 214", "LLS00) R 214"), docs=[dict(titel=["natuurbeheerplan", "flevoland"], type="ow", match=[{"sectie": "4"}])]),
 36: dict(loc=("rd", 170239, 489741), docs=[dict(titel=["natuurbeheerplan", "flevoland"], type="ow", match=[{"sectie": "4"}])]),
 37: dict(loc=("pdok", "9263RB 23", "Inialoane 23"), docs=[dict(titel=["nota ruimte"], type="ow", match=[{"sectie": "9.5"}])]),
 38: dict(loc=("pdok", "Saneringsweg 3a IJzendoorn", "Saneringsweg 3A"), docs=[dict(titel=["omgevingsvisie", "neder-betuwe"], type="ow")]),
 39: dict(toeleiding_agent="Bedrijven, energie en milieu", loc=("pdok", "7334DP 701", "Laan van Westenenk 701"),
          docs=[dict(titel=["gaaf gelderland"], type="wro", match=[{"opschrift": "§ 1 Energietransitie"}])]),
 40: dict(loc=("pdok", "Saneringsweg 3a IJzendoorn", "Saneringsweg 3A"), docs=[dict(titel=["windpark", "echteld"], type="ow")]),
}

# Kolom M (Toeleiding) -> tegel-id van RomThema (zelfde namen als thema.js) + subonderwerp.
# Dit is de route waarlangs de tester zocht; kolom N en O zeggen of het lukte.
TEGEL = {
 "bouwen en wonen": "bouwen", "bedrijven, energie en milieu": "bedrijven", "bodem en graven": "bodem",
 "waterkeringen en grondwater": "waterkering", "natuur, bomen en landschap": "natuur",
 "landbouw en dieren": "landbouw", "openbare ruimte en verkeer": "openbare-ruimte", "openbare ruime en verkeer": "openbare-ruimte",
}

# Variant D (thema-en-activiteitindeling, voorstel Brigitte 22-10-2026 kop 2): welke tegel kiest de bezoeker daar?
# D volgt strikt de tegel uit kolom M via D_UIT_M — zo telt D dezelfde vragen als A/B/C, krijgt geen
# vraag zonder toeleiding er stilletjes een, en meet het verschil de indeling en niet de tegelkeuze.
# D_TEGEL is voor bewuste afwijkingen en staat leeg. Eerste run 2026-10-23 had er drie, naar
# Brigittes tabel: 20 (bodemenergie) en 40 (windturbine) naar Energie en klimaat, 26 (aalscholver)
# naar Natuur en landschap. Die won vraag 26 puur door de tegelkeuze (+1,0) en verloor vraag 20.
D_UIT_M = {"bouwen": "d-bouwen", "bedrijven": "d-werken", "bodem": "d-bodem-water", "waterkering": "d-bodem-water",
           "natuur": "d-natuur", "landbouw": "d-landbouw", "openbare-ruimte": "d-verkeer", "erfgoed": "d-erfgoed"}
D_TEGEL = {}
# Niveau 2 van D: de chips (subonderwerp uit het pad, activiteitnaam, naam van de gebiedsaanwijzing).
# De bezoeker herkent een chip aan een woord uit zijn eigen vraag; alleen woorden die (als stam) in de
# vraag staan. Het meetpunt is optimistisch: matchen meerdere chips, dan kiest hij de beste.
D_TERMEN = {
 # Wro-vragen (2026-10-24, agent; zelfde regel: alleen woorden uit de vraag)
 5: ["bouwhoogte"], 7: ["bebouwingspercentage"], 8: ["winkel"], 9: ["winkel"], 11: ["houtzagerij"],
 12: ["houtzagerij"], 13: ["boten", "verhuur"], 14: ["parkeer"], 39: ["broeikas"],
 15: ["dakopbouw"], 18: ["dakkapel"], 19: ["dakterras"], 20: ["warmtepomp", "bodem"],
 21: ["grondwater", "onttrek", "besproei", "gewas"], 23: ["datacenter"], 24: ["damhert", "doden"],
 26: ["aalscholver", "diersoort", "beschermd"], 28: ["overstroming"], 29: ["overstroming"],
 30: ["overstroming"], 31: ["wateroverlast"], 32: ["wateroverlast"], 33: ["wateroverlast"],
 34: ["hoogwater"], 35: ["subsidie", "beheer"], 37: ["spoor"], 38: ["betuwelijn"],
 40: ["windpark", "zienswijze"],
}

# Handmatige lezing van kolom N en O (vrije tekst -> gevonden ja/nee), getoetst tegen de
# totaalregel van het Excel: N 7/30, O 5/30. Twijfelgevallen:
#  N 24 "12.6 (en veel andere artikelen)" = ja (gevonden, wel ondergesneeuwd)
#  N 30 "veel regels" = nee (negatieve vraag: er is geen omgevingswaarde)
#  N 15 "alleen via ctrl-f in omgevingsplan" = nee (niet via het onderwerp)
#  O 21 "onderscheid ... wordt niet getoond" = ja (anders sluit het totaal van 5 niet)
#  N 33 "2.7 gevonden" = ja zoals het Excel zegt, maar vermoedelijk een vals positief (onderzocht
#       2026-10-23): het bedoelde art. 2.7 (wateroverlast binnen de bebouwde kom) is niet ingedeeld.
#       Onder Waterkeringen staat in dezelfde weergave wél een "Artikel 2.7", uit het voorbereidingsbesluit
#       dat de site eronder hangt (boringsvrije zone Kotkamp/Schreurs). Zonder deze is N 6/30.
EXCEL_N_JA = {21, 23, 24, 28, 29, 31, 33}
EXCEL_O_JA = {21, 28, 29, 31, 32}
BENCHMARK_30 = range(11, 41)   # de totaalregel telt /30: vragen 11-40 (L 12, N 7 en O 5 sluiten alleen zo)


def toeleiding(m, per_nr, nr):
    """'Bouwen en wonen; bouwen en verbouwen' -> {'tegel': 'bouwen', 'sub': 'bouwen en verbouwen'}."""
    m = (m or "").strip()
    z = re.match(r"zie (\d+)", m.lower())
    if z:
        m = (per_nr[int(z.group(1))].get("toeleiding") or "").strip()
    if not m:
        return None
    cat, _, sub = m.partition(";")
    tegel = TEGEL.get(cat.strip().lower())
    if not tegel:
        raise SystemExit("onbekende toeleiding bij %s: %r" % (nr, m))
    return {"tegel": tegel, "sub": sub.strip() or None, "excel": m}

excel = lees_excel(sys.argv[1])
doel = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parent / "golden.json"
per_nr = {r["nr"]: r for r in excel}
uit = []
for r in excel:
    c = C[r["nr"]]
    kind = c["loc"][0]
    loc = {"rd": [c["loc"][1], c["loc"][2]]} if kind == "rd" else {"pdok_q": c["loc"][1], "verwacht": c["loc"][2]}
    t = toeleiding(r.get("toeleiding"), per_nr, r["nr"])
    t_bron = "excel" if t else None
    if not t and c.get("toeleiding_agent"):
        t, t_bron = toeleiding(c["toeleiding_agent"], per_nr, r["nr"]), "agent"
    uit.append({
        "id": r["nr"], "vraag": r["vraag"].strip(), "locatie": loc, "documenten": c["docs"],
        "kenmerk": c.get("kenmerk"), "negatief": c.get("negatief", False),
        "onderwerp": t and t["tegel"], "sub": t and t["sub"], "sub_fijn": c.get("sub_fijn"), "toeleiding_bron": t_bron,
        "onderwerp_d": t and D_TEGEL.get(r["nr"], D_UIT_M[t["tegel"]]), "termen_d": D_TERMEN.get(r["nr"], []),
        "benchmark30": r["nr"] in BENCHMARK_30,
        "excel_n": r["nr"] in EXCEL_N_JA, "excel_o": r["nr"] in EXCEL_O_JA,
        "excel": {k: r[k] for k in ("locatie", "bevoegd_gezag", "type_bron", "im", "bron", "datum_bron",
                                     "verwacht_antwoord", "annotatie_toeleiding", "annotatie_naam",
                                     "filter_op_kenmerken", "toeleiding", "opschriftpad", "annotatie", "vraag_route")},
    })
json.dump(uit, open(doel, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(uit), "cases")
