"""Exporteert de RoM-benchmark als slanke Excel: alleen wat de benchmark nodig heeft, plus de scores.

    python exporteer_excel.py runs/2026-10-24_040125 "C:/Testbestanden/Lokaal/Testsets-OZON/RoM-benchmark/RoM-benchmark testset v2 - 2026-10-24.xlsx"

Bron: golden.json (de gecureerde testset, uit bouw_golden.py) en resultaten.json van één run.
Schrijft nooit over een bestaand bestand heen. Vereist openpyxl.

Drie bladen:
  Testvragen  per vraag: locatie, bron, verwacht antwoord en artikel, tegel en subonderwerp
              (met herkomst: Excel of agent), kenmerk, en de handmatige oordelen N/O
  Scores      per vraag en per variant A/B/C/D: gevonden, aantal artikelen in tegel/chip, score
  Toelichting kolommen, weging, varianten, herkomst
"""
import json
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

TEGELNAAM = {   # thema.js ONDERWERPEN
    "riolering": "Riolering en lozen", "water": "Water", "waterkering": "Waterkeringen en grondwater",
    "geluid": "Geluid, geur en trillingen", "bedrijven": "Bedrijven, energie en milieu",
    "bouwen": "Bouwen en wonen", "natuur": "Natuur, bomen en landschap", "landbouw": "Landbouw en dieren",
    "bodem": "Bodem en graven", "openbare-ruimte": "Openbare ruimte en verkeer",
    "erfgoed": "Erfgoed en monumenten",
}
D_NAAM = {
    "d-bouwen": "Bouwen en gebruik", "d-werken": "Werken en recreëren", "d-landbouw": "Landbouw en veehouderij",
    "d-erfgoed": "Erfgoed", "d-natuur": "Natuur en landschap", "d-bodem-water": "Bodem en water",
    "d-milieu": "Milieu, gezondheid en veiligheid", "d-energie": "Energie en klimaat",
    "d-verkeer": "Verkeer en infrastructuur",
}
VARIANTEN = [("pad", "A · opschriftpad"), ("imow", "B · annotatie"), ("hybride", "C · hybride"),
             ("stelsel", "D · thema-en-activiteit"), ("meervoudig", "E · meervoudig")]
KOP = Font(bold=True, color="FFFFFF")
KOPVULLING = PatternFill("solid", fgColor="2F5D62")
AGENT = PatternFill("solid", fgColor="FFF2CC")


def matcher_tekst(docs):
    delen = []
    for d in docs:
        for m in d.get("match") or []:
            if "artikel" in m:
                delen.append("artikel " + m["artikel"])
            elif "sectie" in m:
                delen.append("sectie " + m["sectie"])
            elif "opschrift" in m:
                delen.append("'" + m["opschrift"] + "…'")
    return " of ".join(delen) or "—"


def blad(ws, kop, rijen, breedtes):
    ws.append(kop)
    for c in ws[1]:
        c.font, c.fill = KOP, KOPVULLING
        c.alignment = Alignment(wrap_text=True, vertical="top")
    for r in rijen:
        ws.append(r)
    for i, b in enumerate(breedtes, 1):
        ws.column_dimensions[get_column_letter(i)].width = b
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "C2"


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    run, doel = Path(sys.argv[1]), Path(sys.argv[2])
    if doel.exists():
        sys.exit(f"STOP: {doel} bestaat al — kies een nieuwe naam (nooit overschrijven).")
    hier = Path(__file__).resolve().parent
    golden = json.load(open(hier / "golden.json", encoding="utf-8"))
    res = json.load(open(run / "resultaten.json", encoding="utf-8"))
    meta, per = res["meta"], {x["id"]: x for x in res["resultaten"]}
    wb = Workbook()

    # ── Testvragen ──
    ws = wb.active
    ws.title = "Testvragen"
    rijen, agent_rijen = [], []
    for c in golden:
        e, x = c["excel"], per.get(c["id"], {})
        k = c.get("kenmerk") or {}
        rijen.append([
            c["id"], c["vraag"], e.get("locatie"), (x.get("locatie") or {}).get("label"),
            e.get("bevoegd_gezag"), e.get("type_bron"), e.get("im"), e.get("bron"),
            e.get("verwacht_antwoord"), matcher_tekst(c["documenten"]),
            TEGELNAAM.get(c.get("onderwerp"), c.get("onderwerp")) if c.get("onderwerp") else None,
            c.get("sub"), c.get("sub_fijn"),
            {"excel": "Excel kolom M", "agent": "agent (24-10-2026)"}.get(c.get("toeleiding_bron")),
            D_NAAM.get(c.get("onderwerp_d")),
            {"vertaald": "vertaald uit sitetegel", "brigitte": "tabel Brigitte (22-10)", "agent": "agent (24-10-2026)"}.get(
                c.get("onderwerp_d_bron")),
            ", ".join(c.get("termen_d") or []) or None,
            (k.get("soort", "") + ": " + k.get("naam", "")) if k else None,
            "ja" if c.get("negatief") else None,
            c.get("buiten_scope"),
            "ja" if c.get("benchmark30") else None,
            ("ja" if c.get("excel_n") else "nee") if c.get("benchmark30") else None,
            ("ja" if c.get("excel_o") else "nee") if c.get("benchmark30") else None,
        ])
        if c.get("toeleiding_bron") == "agent":
            agent_rijen.append(len(rijen) + 1)
    blad(ws, ["nr", "vraag", "locatie (Excel)", "locatie (opgelost, PDOK)", "bevoegd gezag", "type bron", "IM",
              "bron (document)", "verwacht antwoord", "verwacht artikel / sectie",
              "tegel site (A/B/C)", "subonderwerp", "fijne chip", "herkomst sitetegel",
              "tegel stelsel (D/E)", "herkomst stelseltegel", "zoekwoorden chips D/E", "kenmerk op het punt", "negatieve vraag",
              "buiten bereik", "in Excel-set (30)", "handmatig N (opschriftpad)", "handmatig O (annotatie)"],
         rijen, [5, 34, 22, 26, 18, 8, 6, 26, 34, 18, 22, 20, 22, 14, 20, 16, 16, 26, 9, 22, 9, 10, 10])
    for r in agent_rijen:
        for col in (11, 12, 14):
            ws.cell(row=r, column=col).fill = AGENT
    for i, c in enumerate(golden, 2):   # stelseltegel die niet uit de vertaling komt
        if c.get("onderwerp_d_bron") in ("agent", "brigitte"):
            for col in (15, 16):
                ws.cell(row=i, column=col).fill = AGENT

    # ── Scores ──
    ws2 = wb.create_sheet("Scores")
    srijen = []
    totaal = {m: {"30": 0.0, "40": 0.0, "g30": 0, "g40": 0, "h28": 0.0, "h38": 0.0} for m, _ in VARIANTEN}
    for c in golden:
        t = per.get(c["id"], {}).get("toegang") or {}
        rij = [c["id"], c["vraag"], TEGELNAAM.get(c.get("onderwerp")) if c.get("onderwerp") else None]
        for m, _ in VARIANTEN:
            v = t.get(m) or {}
            if v.get("gevonden"):
                rij += ["ja", v.get("n"), round(v.get("score", 0), 2), v.get("via")]
            else:
                rij += ["nee", None, 0.0, v.get("uitleg")]
            for s in ("40",) + (("30",) if c.get("benchmark30") else ()):
                totaal[m][s] += v.get("score", 0) or 0
                totaal[m]["g" + s] += bool(v.get("gevonden"))
            if not c.get("buiten_scope"):   # haalbaar: negatief telt als goed als hij terecht leeg is
                h = 1.0 if v.get("terecht_leeg") else (v.get("score", 0) or 0)
                totaal[m]["h38"] += h
                if c.get("benchmark30"):
                    totaal[m]["h28"] += h
        srijen.append(rij)
    kop = ["nr", "vraag", "tegel"]
    for _, naam in VARIANTEN:
        kop += [naam + " · gevonden", "artikelen", "score", "via / reden"]
    blad(ws2, kop, srijen, [5, 34, 20] + [9, 9, 7, 28] * len(VARIANTEN))
    ws2.append([])
    for s, label in (("30", "Totaal Excel-set (vragen 11–40)"), ("40", "Totaal alle 40 vragen")):
        rij = [None, label, None]
        for m, _ in VARIANTEN:
            rij += [totaal[m]["g" + s], None, round(totaal[m][s], 1), None]
        ws2.append(rij)
        for cel in ws2[ws2.max_row]:
            cel.font = Font(bold=True)
    n28 = sum(1 for c in golden if c.get("benchmark30") and not c.get("buiten_scope"))
    n38 = sum(1 for c in golden if not c.get("buiten_scope"))
    for s, label in (("h28", f"Haalbaar, Excel-set (noemer {n28})"), ("h38", f"Haalbaar, alle vragen (noemer {n38})")):
        rij = [None, label, None]
        for m, _ in VARIANTEN:
            rij += [None, None, round(totaal[m][s], 1), None]
        ws2.append(rij)
        for cel in ws2[ws2.max_row]:
            cel.font = Font(bold=True)
    ws2.append([None, "Haalbaar = zonder de vragen buiten bereik (37, 40); een negatieve vraag telt als goed als het kenmerk "
                      "terecht ontbreekt."])
    ws2.append([None, "Handmatig (Excel 20-10): kolom N 7/30 (eigenlijk 6, zie vraag 33), kolom O 5/30"])

    # ── Toelichting ──
    ws3 = wb.create_sheet("Toelichting")
    regels = [
        ("Bron", "Afgeleid van 'Testvragen AI experiment - RoM - EL - 20-10-2026.xlsx'. Alleen de kolommen die de "
                 "RoM-benchmark nodig heeft; de vrije-tekstoordelen L/N/O/P zijn vervangen door N/O als ja/nee."),
        ("Run", f"{run.name} · API {meta.get('api')} · {meta.get('start')}"),
        ("Herkomst tegel", "Excel kolom M, of (geel) agent-curatie van 24-10-2026 voor de Wro-vragen waar M leeg "
                           "was: de tegel die een bezoeker bij de vraag kiest, zoals de tester bij de Ow-vragen "
                           "(winkel → Bedrijven, energie en milieu; detailhandel)."),
        ("Verwacht artikel", "Uit het Excel waar het een nummer noemt; voor 5, 11, 12, 13 en 39 uit de data: het "
                             "artikel van de bestemming op het punt (OCD wro_tekst_link). Utrecht 15/18/19 met "
                             "de nummers van de geldende versie (2026-08-19)."),
        ("Score per vraag", "Valt het verwachte artikel onder de tegel, en tussen hoeveel artikelen staat het daar? "
                            "Met het verwachte (of fijne) subonderwerp telt dat subonderwerp, anders de hele tegel. "
                            "≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%."),
        ("A · opschriftpad", "Onderwerp uit de kopjes boven het artikel (OCD v2a.artikel_indeling; Wro: "
                             "v2a.wro_artikel_indeling via de bestemmingshoofdgroep)."),
        ("B · annotatie", "Alleen het IMOW-thema van de juridische regels. Wro heeft geen IMOW-annotatie."),
        ("C · hybride", "Opschriftpad, en waar dat zwijgt het IMOW-thema (de standaard op de site)."),
        ("D · thema-en-activiteit", "Simulatie van de parallelle sessie (voorstel Brigitte 22-10-2026): acht "
                                    "themategels plus chips uit subonderwerp, activiteit en gebiedsaanwijzing. "
                                    "Bestaat (nog) niet op de site."),
        ("Wro op de site", "De Wro-onderwerpen staan op productie in de API, maar de site toont ze pas met de "
                           "register-branch wro-onderwerpen (niet live). De Wro-scores meten dus die branch."),
        ("E · meervoudig", "Simulatie (24-10-2026): de tegels en chips van D, maar een artikel staat onder élke tegel "
                           "waarover het iets regelt: opschriftpad, alle IMOW-thema's, gebiedsaanwijzingen, "
                           "activiteitengroepen, en bij Wro de functies uit het hoofddeel van de bestemmingsomschrijving."),
        ("Tegelkeuze per tegelset", "Een variant = een tegelset + een indeling. Per tegelset kiest de bezoeker per vraag "
                                    "zelf een tegel, op grond van de vraag en zonder te weten waar het artikel staat. "
                                    "Site (A/B/C): kolom M of agent. Stelsel (D/E): vertaald uit de sitetegel, behalve 20 en "
                                    "40 (Energie en klimaat) en 26 (Natuur en landschap) uit de tabel van Brigitte, en 39 "
                                    "(Energie en klimaat, agent). Geel = niet uit het Excel of de vertaling."),
        ("Negatieve vragen", "4, 6, 17, 25, 27, 30: er is geen artikel om te vinden. In 'haalbaar' tellen ze als goed als het "
                             "kenmerk binnen het verwachte document terecht ontbreekt."),
        ("Buiten bereik", "37 (ontwerp-Nota Ruimte: het register toont alleen geldende documenten) en 40 (einde "
                          "inzagetermijn: procedure-informatie, staat in geen regel)."),
    ]
    blad(ws3, ["onderdeel", "uitleg"], regels, [24, 110])
    wb.save(doel)
    print(f"geschreven: {doel}")
    for m, naam in VARIANTEN:
        print(f"  {naam:26} 30: {totaal[m]['30']:.1f} · 40: {totaal[m]['40']:.1f} · haalbaar 28: {totaal[m]['h28']:.1f} · 38: {totaal[m]['h38']:.1f}")


if __name__ == "__main__":
    main()
