export interface OfficialSeries {
    seriesId?: string
    name: string
    licenseClass: "Rookie" | "D" | "C" | "B" | "A"
    url?: string
    src?: string
}

export function getRoadSeries(id: string): OfficialSeries | null {
    const series = iRacing2024S1RoadSeries.find((seriesObj) =>seriesObj.seriesId == id)
    return series || null
}

export const iRacing2024S1RoadSeries: OfficialSeries[] = [
    {seriesId: '4555', name: 'Global Mazda MX‑5 Fanatec Cup', src: '/iracing/2024s1/GlobalMazda.png', licenseClass: 'Rookie'},
    {seriesId: '4556', name: 'Formula Vee SIMAGIC Series', src: '/iracing/2024s1/Vee.png', licenseClass: 'Rookie'},
    {seriesId: '4557', name: 'Formula 1600 Rookie Sim‑Motion Series Fixed', src: '/iracing/2024s1/Formula1600.png', licenseClass: 'Rookie'},
    {seriesId: '4568', name: 'Ferrari GT3 Challenge Fixed', src: '/iracing/2024s1/FerrariGT3.png', licenseClass: 'D'},
    {seriesId: '4560', name: 'GR Buttkicker Cup Fixed', src: '/iracing/2024s1/GRCup.png', licenseClass: 'D'},
    {seriesId: '4563', name: 'Production Car Sim‑Lab Challenge', src: '/iracing/2024s1/PCC.png', licenseClass: 'D'},
    {seriesId: '4561', name: 'Formula 1600 Thrustmaster Trophy', src: '/iracing/2024s1/FF1600D.png', licenseClass: 'D'},
    {seriesId: '4570', name: 'FIA Formula 4 Challenge', src: '/iracing/2024s1/Formula4.png', licenseClass: 'D'},
    {seriesId: '4569', name: 'FIA Formula 4 Challenge Fixed', src: '/iracing/2024s1/Formula4Fixed.png', licenseClass: 'D'},
    {seriesId: '4564', name: 'GT4 Falken Tyre Challenge Fixed', src: '/iracing/2024s1/GT4Fixed.png', licenseClass: 'D'},
    {seriesId: '4670', name: 'Weekly Race Challenge', src: '/iracing/2024s1/WeeklyRace.png', licenseClass: 'D'},
    {seriesId: '4575', name: 'Global Fanatec Challenge', src: '/iracing/2024s1/GlobalFanatec.png', licenseClass: 'D'},
    {seriesId: '4571', name: 'Skip Barber Race Series', src: '/iracing/2024s1/SkipBarber.png', licenseClass: 'D'},
    {seriesId: '4562', name: 'Clio Cup Fixed', src: '/iracing/2024s1/ClioCup.png', licenseClass: 'D'},
    {seriesId: '4567', name: 'Touring Car Challenge', src: '/iracing/2024s1/TCC.png', licenseClass: 'D'},
    {seriesId: '4566', name: 'Touring Car Challenge Fixed', src: '/iracing/2024s1/TCCFixed.png', licenseClass: 'D'},
    {seriesId: '4574', name: 'Spec Racer Ford Challenge', src: '/iracing/2024s1/SpecRacer.png', licenseClass: 'D'},
    {seriesId: '4559', name: 'US Open Wheel D USF 2000 Series Fixed', src: '/iracing/2024s1/OpenWheelD.png', licenseClass: 'D'},
    {seriesId: '4578', name: 'FIA F4 Esports Regional Tour Europe North', src: '/iracing/2024s1/F4RegionalEurNo.png', licenseClass: 'D'},
    {seriesId: '4577', name: 'FIA F4 Esports Regional Tour Americas', src: '/iracing/2024s1/F4RegionalAmericas.png', licenseClass: 'D'},
    {seriesId: '4579', name: 'FIA F4 Esports Regional Tour Europe South', src: '/iracing/2024s1/F4RegionalEurSo.png', licenseClass: 'D'},
    {seriesId: '4576', name: 'FIA F4 Esports Regional Tour Asia Pacific', src: '/iracing/2024s1/F4RegionalAsiaPac.png', licenseClass: 'D'},
    {seriesId: '4572', name: 'Mustang Skip Barber Challenge Fixed', src: '/iracing/2024s1/MustangBarber.png', licenseClass: 'D'},
    {seriesId: '4573', name: 'Mission R Challenge Fixed', src: '/iracing/2024s1/MissionR.png', licenseClass: 'D'},
    {seriesId: '4565', name: 'Falken Tyre Sports Car Challenge', src: '/iracing/2024s1/SCC.png', licenseClass: 'C'},
    {seriesId: '4609', name: 'Proto‑GT Thrustmaster Challenge', src: '/iracing/2024s1/ProtoGT.png', licenseClass: 'C'},
    {seriesId: '4666', name: 'Ring Meister Ricmotech Series Fixed', src: '/iracing/2024s1/RingMeister.png', licenseClass: 'C'},
    {seriesId: '4608', name: 'iRacing Porsche Cup Fixed', src: '/iracing/2024s1/PorscheCupFixed.png', licenseClass: 'C'},
    {seriesId: '4607', name: 'iRacing Porsche Cup', src: '/iracing/2024s1/PorscheCup.png', licenseClass: 'C'},
    {seriesId: '4602', name: 'Formula C DOF Reality Dallara F3 Series', src: '/iracing/2024s1/FormulaC.png', licenseClass: 'C'},
    {seriesId: '4603', name: 'Formula C Thrustmaster Dallara F3 Series Fixed', src: '/iracing/2024s1/FormulaCFixed.png', licenseClass: 'C'},
    {seriesId: '4620', name: 'GT Endurance VRS Series', src: '/iracing/2024s1/GTEndurance.png', licenseClass: 'C'},
    {seriesId: '4589', name: 'IMSA Michelin Pilot Challenge Series', src: '/iracing/2024s1/IMSAPilot.png', licenseClass: 'C'},
    {seriesId: '4601', name: 'Advanced Mazda MX‑5 Cup Series', src: '/iracing/2024s1/AdvancedMazda.png', licenseClass: 'C'},
    {seriesId: '4585', name: 'LMP3 Turn Racing Trophy Fixed', src: '/iracing/2024s1/LMP3Trophy.png', licenseClass: 'C'},
    {seriesId: '4586', name: 'Radical Esports Cup Fixed', src: '/iracing/2024s1/RadicalCup.png', licenseClass: 'C'},
    {seriesId: '4617', name: 'Classic Lotus Grand Prix', src: '/iracing/2024s1/ClassicLotus.png', licenseClass: 'C'},
    {seriesId: '4590', name: 'Dallara Formula iR Fixed', src: '/iracing/2024s1/FormulaiRFixed.png', licenseClass: 'C'},
    {seriesId: '4587', name: 'IMSA Vintage Series', src: '/iracing/2024s1/IMSAVintage.png', licenseClass: 'C'},
    {seriesId: '4605', name: 'Supercars Series', src: '/iracing/2024s1/SupercarsSeries.png', licenseClass: 'C'},
    {seriesId: '4606', name: 'Supercars Series Australian Servers', src: '/iracing/2024s1/SupercarsSeriesAus.png', licenseClass: 'C'},
    {seriesId: '4604', name: 'US Open Wheel C Indy Pro 2000 Series', src: '/iracing/2024s1/OpenWheelC.png', licenseClass: 'C'},
    {seriesId: '4610', name: 'Grand Prix Legends', src: '/iracing/2024s1/GrandPrixLegends.png', licenseClass: 'C'},
    {seriesId: '4588', name: 'Stock Car Brasil Fixed', src: '/iracing/2024s1/StockCarBrasil.png', licenseClass: 'C'},
    {seriesId: '4618', name: 'GT3 Fanatec Challenge Fixed', src: '/iracing/2024s1/GT3Fixed.png', licenseClass: 'B'},
    {seriesId: '4619', name: 'GT Sprint VRS Series', src: '/iracing/2024s1/GTSprint.png', licenseClass: 'B'},
    {seriesId: '4626', name: 'Formula B Super Formula IMSIM Series Fixed', src: '/iracing/2024s1/SuperFormulaFixed.png', licenseClass: 'B'},
    {seriesId: '4625', name: 'Formula B Super Formula IMSIM Series', src: '/iracing/2024s1/SuperFormula.png', licenseClass: 'B'},
    {seriesId: '4622', name: 'Global Endurance Pure Driving School Tour', src: '/iracing/2024s1/GlobalEndurance.png', licenseClass: 'B'},
    {seriesId: '4614', name: 'LMP2 Prototype Challenge Fixed', src: '/iracing/2024s1/LMP2Proto.png', licenseClass: 'B'},
    {seriesId: '4621', name: 'GTE Sprint Pure Driving School Series', src: '/iracing/2024s1/GTESprint.png', licenseClass: 'B'},
    {seriesId: '4623', name: 'IMSA Endurance Series', src: '/iracing/2024s1/IMSAEndurance.png', licenseClass: 'B'},
    {seriesId: '4600', name: 'US Open Wheel B Dallara IR‑18', src: '/iracing/2024s1/OpenWheelB.png', licenseClass: 'B'},
    {seriesId: '4624', name: 'Formula B Formula Renault 3.5 Series', src: '/iracing/2024s1/FormulaB.png', licenseClass: 'B'},
    {seriesId: '4615', name: 'IMSA iRacing Series', src: '/iracing/2024s1/IMSA.png', licenseClass: 'A'},
    {seriesId: '4616', name: 'IMSA iRacing Series Fixed', src: '/iracing/2024s1/IMSAFixed.png', licenseClass: 'A'},
    {seriesId: '4629', name: 'Formula A Grand Prix Series', src: '/iracing/2024s1/FormulaA.png', licenseClass: 'A'},
    {seriesId: '4630', name: 'Formula A Grand Prix Series Fixed', src: '/iracing/2024s1/FormulaAFixed.png', licenseClass: 'A'},
]

export const iRacing2024S1OvalSeries: OfficialSeries[] = [
    {seriesId: '', name: 'Street Stock Fanatec Series R', src: '/iracing/2024s1/StreetStock.png', licenseClass: 'Rookie'},
    {seriesId: '', name: 'Rookie Legends VRS Cup', src: '/iracing/2024s1/RookieLegends.png', licenseClass: 'Rookie'},

    {seriesId: '', name: 'ARCA Menards Series', src: '/iracing/2024s1/ARCASeries.png', licenseClass: 'D'},
    {seriesId: '', name: 'Draft Master Fixed', src: '/iracing/2024s1/DraftMaster.png', licenseClass: 'D'},
    {seriesId: '', name: 'CARS Late Model Stock Tour Fixed', src: '/iracing/2024s1/LateModelStockFixed.png', licenseClass: 'D'},
    {seriesId: '', name: 'SK Modified Weekly Series Fixed', src: '/iracing/2024s1/SKModifiedFixed.png', licenseClass: 'D'},
    {seriesId: '', name: 'SK Modified Weekly Series', src: '/iracing/2024s1/SKModifiedWeekly.png', licenseClass: 'D'},

    {seriesId: '', name: 'NASCAR Class C Maconi Setup Shop Fixed', src: '/iracing/2024s1/NascarCFixed.png', licenseClass: 'C'},
    {seriesId: '', name: 'NASCAR iRacing Class C', src: '/iracing/2024s1/NascarC.png', licenseClass: 'C'},
    {seriesId: '', name: 'US Open Wheel C Dallara IR‑18 Fixed', src: '/iracing/2024s1/OpenWheelC.png', licenseClass: 'C'},
    {seriesId: '', name: 'Gen 4 Cup Fixed', src: '/iracing/2024s1/Gen4CupFixed.png', licenseClass: 'C'},
    {seriesId: '', name: 'Advanced Legends Cup', src: '/iracing/2024s1/AdvancedLegends.png', licenseClass: 'C'},
    {seriesId: '', name: 'CARS Late Model Stock Tour', src: '/iracing/2024s1/LateModelStock.png', licenseClass: 'C'},
    {seriesId: '', name: 'Street Stock Next Level Racing Series C', src: '/iracing/2024s1/StreetStockC.png', licenseClass: 'C'},
    {seriesId: '', name: 'Super Late Model Series Fixed', src: '/iracing/2024s1/SuperLateModelFixed.png', licenseClass: 'C'},
    {seriesId: '', name: 'Super Late Model Series', src: '/iracing/2024s1/SuperLateModel.png', licenseClass: 'C'},
    {seriesId: '', name: 'NASCAR Tour Modified Series Fixed', src: '/iracing/2024s1/NascarTourModifiedFixed.png', licenseClass: 'C'},
    {seriesId: '', name: 'NASCAR Tour Modified Series ', src: '/iracing/2024s1/NascarTourModified.png', licenseClass: 'C'},

    {seriesId: '', name: 'NASCAR Class B Fixed', src: '/iracing/2024s1/NascarBFixed.png', licenseClass: 'B'},
    {seriesId: '', name: 'NASCAR iRacing Class B', src: '/iracing/2024s1/NascarB.png', licenseClass: 'B'},
    {seriesId: '', name: 'NASCAR Legends Series', src: '/iracing/2024s1/NascarLegends.png', licenseClass: 'B'},
    {seriesId: '', name: 'Sprint Car Cup', src: '/iracing/2024s1/SprintCarCup.png', licenseClass: 'B'},
    {seriesId: '', name: 'Silver Crown Cup', src: '/iracing/2024s1/SilverCrownCup.png', licenseClass: 'B'},

    {seriesId: '', name: 'NASCAR Class A Fixed', src: '/iracing/2024s1/NascarAFixed.png', licenseClass: 'A'},
    {seriesId: '', name: 'NASCAR Class A', src: '/iracing/2024s1/NascarA.png', licenseClass: 'A'},
]

export const iRacing2024S1DirtOvalSeries: OfficialSeries[] = [
    {seriesId: '', name: 'Rookie DIRTcar Street Stock Series Fixed', licenseClass: 'Rookie', src: ''},
    {seriesId: '4635', name: 'Dirt Legends Cup', licenseClass: 'Rookie', src: ''},

    {seriesId: '', name: 'DIRTcar 305 Sprint Car Fanatec Series', licenseClass: 'D'},
    {seriesId: '', name: 'DIRTcar Limited Late Model Series', licenseClass: 'D'},
    {seriesId: '', name: 'DIRTcar 358 Modified Engine Ice Series', licenseClass: 'D'},

    {seriesId: '', name: 'DIRTcar Pro Late Model Series Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'DIRTcar Pro Late Model Series', licenseClass: 'C'},
    {seriesId: '', name: 'SUPER DIRTcar Big Block Modified Series Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'SUPER DIRTcar Big Block Modified Series', licenseClass: 'C'},
    {seriesId: '', name: 'DIRTcar 360 Sprint Car Carquest Series Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'DIRTcar 360 Sprint Car Carquest Series', licenseClass: 'C'},
    {seriesId: '', name: 'Dirt Midget Cup Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'Dirt Midget Cup', licenseClass: 'C'},
    {seriesId: '', name: 'DIRTcar Class C Street Stock Series Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'Dirt Super Late Model Tour Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'USAC 360 Sprint Car Series', licenseClass: 'C'},
    {seriesId: '', name: 'Dirt 410 Sprint Car Tour Fixed', licenseClass: 'C'},

    {seriesId: '', name: 'World of Outlaws Late Model Series Fixed', licenseClass: 'B'},
    {seriesId: '', name: 'World of Outlaws Late Model Series', licenseClass: 'B'},
    {seriesId: '', name: 'World of Outlaws Sprint Car Series Fixed', licenseClass: 'B'},
    {seriesId: '', name: 'World of Outlaws Sprint Car Series', licenseClass: 'B'},
    {seriesId: '', name: 'DIRTcar UMP Modified Series Fixed', licenseClass: 'B'},
    {seriesId: '', name: 'AMSOIL USAC Sprint Car Fixed', licenseClass: 'B'},
]

export const iRacing2024S1DirtRoadSeries: OfficialSeries[] = [
    {seriesId: '', name: 'Rookie Pro 2 Lite Off‑Road Racing Series Fixed', licenseClass: 'Rookie'},
    {seriesId: '', name: 'Rookie iRX Volkswagen Beetle Lite Fixed', licenseClass: 'Rookie'},
    {seriesId: '', name: 'iRX Volkswagen Beetle Lite', licenseClass: 'D'},
    {seriesId: '', name: 'Pro 4 Off‑Road Racing Series Fixed', licenseClass: 'D'},
    {seriesId: '', name: 'Rallycross Series Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'Pro 2 Off‑Road Racing Series Fixed', licenseClass: 'C'},
    {seriesId: '', name: 'Rallycross Series', licenseClass: 'B'},
    {seriesId: '', name: 'Pro 4 Off‑Road Racing Series', licenseClass: 'B'},
    {seriesId: '', name: 'Pro 2 Off‑Road Racing Series', licenseClass: 'B'},
]