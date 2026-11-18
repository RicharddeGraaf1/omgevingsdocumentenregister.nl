"""Bouwt golden_scope2.json uit 'Benchmark testvragen RoM - nieuwe scope - EL - 17-11-2026.xlsx'.

De nieuwe scope (Erik, 17-11-2026) telt 30 vragen: 19 uit de oude set (kolom *Nr oud*) en 11 nieuwe,
waaronder vijf over landelijke regels (Bal, Bbl, Bkl en de voorbeschermingsregels van een luchthavenbesluit).
Het Excel heeft geen kolom Toeleiding meer: welke tegel een bezoeker kiest is voor alle vragen curatie.

- Oude vragen nemen hun curatie over uit golden.json (de vorige scope), inclusief de tegel uit de oude
  kolom M waar die er was; `toeleiding_bron` zegt dan `excel-oud`.
- Nieuwe vragen: curatie van de agent (2026-11-17) in N hieronder, gelezen uit de vraag, zonder te weten
  waar het artikel staat. Indeling I is voor deze vragen NIET aangepast: de nieuwe vragen zijn voor I een
  toets buiten de set waarmee hij ontworpen is.

  python bouw_golden_scope2.py "C:/Testbestanden/Lokaal/Testsets-OZON/RoM-benchmark/Benchmark testvragen RoM - nieuwe scope - EL - 17-11-2026.xlsx"

Vereist openpyxl.
"""
import datetime
import json
import sys
from pathlib import Path

import openpyxl

HIER = Path(__file__).resolve().parent
sys.path.insert(0, str(HIER))
from run_benchmark import I_KEUZE   # noqa: E402  (keuze bij indeling I voor de oude vragen)

KOLOMMEN = ["nr", "nr_oud", "vraag", "locatie", "bevoegd_gezag", "type_bron", "im", "bron", "datum_bron",
            "verwacht_antwoord", "annotatie_toeleiding", "annotatie_naam"]
OUD_EXCEL = ["filter_op_kenmerken", "toeleiding", "opschriftpad", "annotatie", "vraag_route"]
D_UIT_M = {"bouwen": "d-bouwen", "bedrijven": "d-werken", "bodem": "d-bodem-water", "waterkering": "d-bodem-water",
           "natuur": "d-natuur", "landbouw": "d-landbouw", "openbare-ruimte": "d-verkeer", "erfgoed": "d-erfgoed"}

BAL, BBL, BKL = "/BWBR0041330/", "/BWBR0041297/", "/BWBR0041313/"


def arts(*nrs):
    return [{"artikel": n} for n in nrs]


# Aanpassingen aan oude vragen (sleutel = nieuw nummer).
OUD_EXTRA = {
    1: dict(match=arts("5.9"), termen=["bouwhoogte"], keuze_i=("i-bouwen", "maat")),   # was zonder verwacht artikel
}

# Nieuwe vragen. tegel: (site, sub, sub_fijn) · stelsel: tegel van D/E/F/H · keuze_i: (tegel, sub) van I.
N = {
 19: dict(loc=("pdok", "3512JC 1", "Domplein 1"),
          docs=[dict(titel=["besluit"], bron=BAL, type="ow", match=arts("4.624", "4.625", "4.626", "4.627", "4.628", "4.628a")),
                dict(titel=["besluit"], bron=BBL, type="ow", match=arts("7.9", "7.10", "7.11", "7.12", "7.13", "7.14"))],
          noot="Excel noemt voor beide reeksen het Bal; 7.9-7.14 (asbestinventarisatie, sloopmelding) staan in het Bbl",
          kenmerk=dict(soort="activiteit", naam="asbest"),
          tegel=("bedrijven", None, None), stelsel="d-milieu", keuze_i=("i-hinder", "veiligheid"), termen=["asbest"]),
 20: dict(loc=("pdok", "3512JC 1", "Domplein 1"),
          docs=[dict(titel=["besluit"], bron=BKL, type="ow", match=arts("7.3", "7.4"))],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="limes"),
          tegel=("erfgoed", "archeologie", None), stelsel="d-erfgoed", keuze_i=("i-erfgoed", "archeologie"), termen=["archeolog"]),
 21: dict(loc=("pdok", "LBH00 B 4891", "LBH00) B 4891"),
          docs=[dict(titel=["waterschapsverordening", "rijn en ijssel"], type="ow", match=arts("5.60"))],
          kenmerk=dict(soort="activiteit", naam="asverstrooi"),
          tegel=("openbare-ruimte", None, None), stelsel="d-verkeer", keuze_i=("i-verkeer", "openbaar"), termen=["verstroo"]),
 22: dict(loc=("pdok", "GOE00 O 1228", "GOE00) O 1228"),
          docs=[dict(titel=["waterschapsverordening", "scheldestromen"], type="ow", match=arts("13.3"))],
          kenmerk=dict(soort="activiteit", naam="zwemmen of varen"),
          tegel=("water", None, None), stelsel="d-werken", keuze_i=("i-recreatie", "sport"), termen=["zwem"]),
 23: dict(loc=("pdok", "4462LR 25", "Bob Marleylaan 25"),
          docs=[dict(titel=["besluit"], bron=BBL, type="ow", match=arts("2.26"))],
          kenmerk=dict(soort="activiteit", naam="perceelafscheiding"),
          tegel=("bouwen", "bouwen en verbouwen", None), stelsel="d-bouwen", keuze_i=("i-bouwen", "erf"),
          termen=["perceelafscheiding", "afscheiding"]),
 24: dict(loc=("pdok", "1012RJ 147", "Nieuwezijds Voorburgwal 147"),
          docs=[dict(titel=["postcodegebied 1012"], type="wro", match=arts("20.2.5"))],
          kenmerk=dict(soort="wro", naam="koninklijk paleis", object_type="Enkelbestemming"),
          tegel=("bouwen", "bouwen en verbouwen", "dakkapellen, dakopbouwen en dakterrassen"), stelsel="d-bouwen",
          keuze_i=("i-bouwen", "dak"), termen=["dakterras"]),
 25: dict(loc=("pdok", "2011GR 2", "Gedempte Oude Gracht 2"),
          docs=[dict(titel=["omgevingsplan gemeente haarlem"], type="ow", match=arts("2.79"))],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="sportschool"),
          tegel=("bedrijven", None, None), stelsel="d-werken", keuze_i=("i-recreatie", "sport"), termen=["sportschool", "sport"]),
 26: dict(loc=("pdok", "2011VA 26", "Raaks 26"),
          docs=[dict(titel=["omgevingsplan gemeente haarlem"], type="ow")],
          kenmerk=dict(soort="gebiedsaanwijzing", naam="sportschool"), negatief=True,
          tegel=("bedrijven", None, None), stelsel="d-werken", keuze_i=("i-recreatie", "sport"), termen=["sportschool", "sport"]),
 28: dict(loc=("pdok", "WRG03 D 886", "WRG03) D 886"),
          docs=[dict(titel=["besluit"], bron=BKL, type="ow", match=arts("2.7"))],
          kenmerk=None,   # Excel: thema lucht; het objectenpaneel kent geen thema's
          tegel=("bedrijven", None, None), stelsel="d-milieu", keuze_i=("i-hinder", "lucht"), termen=["ozon", "concentratie"]),
 29: dict(loc=("pdok", "2642LH 46", "Tarweakker 46"),
          docs=[dict(titel=["omgevingsplan gemeente pijnacker"], type="ow", match=arts("4.184"))],
          kenmerk=None,   # Excel: thema geluid
          tegel=("geluid", None, None), stelsel="d-milieu", keuze_i=("i-hinder", "geluid"), termen=["geluid"]),
 30: dict(loc=("pdok", "9755PD 22", "Dorpsweg 22"),
          docs=[dict(titel=["voorbeschermingsregels luchthavenbesluit eelde"], type="ow", match=arts("2.1"))],
          kenmerk=dict(soort="normwaarde", naam="maximale bouwhoogte boven nap"),
          tegel=("bouwen", "bouwen en verbouwen", None), stelsel="d-bouwen", keuze_i=("i-bouwen", "maat"), termen=["bouwhoogte"]),
}


def lees_excel(pad):
    ws = openpyxl.load_workbook(pad).active
    uit = []
    for r in ws.iter_rows(min_row=2, values_only=True):
        if not isinstance(r[0], int):
            continue
        uit.append({k: (v.date().isoformat() if isinstance(v, datetime.datetime) else (v.strip() if isinstance(v, str) else v))
                    for k, v in zip(KOLOMMEN, r)})
    return uit


excel = lees_excel(sys.argv[1])
doel = Path(sys.argv[2]) if len(sys.argv) > 2 else HIER / "golden_scope2.json"
oud = {c["id"]: c for c in json.load(open(HIER / "golden.json", encoding="utf-8"))}
uit = []
for r in excel:
    ex = {k: r[k] for k in KOLOMMEN[3:]}
    ex.update({k: None for k in OUD_EXCEL})
    ex["nr_oud"] = r["nr_oud"]
    if r["nr_oud"]:
        o = dict(oud[r["nr_oud"]])
        e = OUD_EXTRA.get(r["nr"], {})
        docs = o["documenten"]
        if "match" in e:
            docs = [dict(docs[0], match=e["match"])] + docs[1:]
        ex.update({k: o["excel"].get(k) for k in OUD_EXCEL})   # ter informatie: hoe het in de oude scope ging
        c = {"id": r["nr"], "nr_oud": r["nr_oud"], "vraag": r["vraag"].strip(), "locatie": o["locatie"], "documenten": docs,
             "kenmerk": o["kenmerk"], "negatief": o["negatief"], "onderwerp": o["onderwerp"], "sub": o["sub"],
             "sub_fijn": o["sub_fijn"], "toeleiding_bron": {"excel": "excel-oud", "agent": "agent-oud"}.get(o["toeleiding_bron"]),
             "buiten_scope": o["buiten_scope"], "onderwerp_d": o["onderwerp_d"], "onderwerp_d_bron": o["onderwerp_d_bron"],
             "termen_d": e.get("termen") or o["termen_d"], "keuze_i": e.get("keuze_i") or I_KEUZE.get(r["nr_oud"])}
    else:
        n = N[r["nr"]]
        kind = n["loc"][0]
        loc = {"rd": [n["loc"][1], n["loc"][2]]} if kind == "rd" else {"pdok_q": n["loc"][1], "verwacht": n["loc"][2]}
        site, sub, fijn = n["tegel"]
        c = {"id": r["nr"], "nr_oud": None, "vraag": r["vraag"].strip(), "locatie": loc, "documenten": n["docs"],
             "kenmerk": n["kenmerk"], "negatief": n.get("negatief", False), "onderwerp": site, "sub": sub, "sub_fijn": fijn,
             "toeleiding_bron": "agent", "buiten_scope": None, "onderwerp_d": n["stelsel"],
             "onderwerp_d_bron": "vertaald" if D_UIT_M.get(site) == n["stelsel"] else "agent",
             "termen_d": n["termen"], "keuze_i": n["keuze_i"], "noot": n.get("noot")}
    c.update({"benchmark30": True, "excel_n": None, "excel_o": None, "excel": ex})
    uit.append(c)
assert len(uit) == 30, len(uit)
json.dump(uit, open(doel, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(uit), "cases ->", doel)
for c in uit:
    print("%2d (oud %s) %-15s %-12s %-28s %s" % (c["id"], c["nr_oud"] or "-", c["onderwerp"], c["onderwerp_d"],
                                                "%s/%s" % tuple(c["keuze_i"]) if c["keuze_i"] else "-", c["vraag"][:50]))
