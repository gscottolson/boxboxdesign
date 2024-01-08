export interface OfficialSeries {
  seriesId?: string;
  name: string;
  licenseClass: 'Rookie' | 'D' | 'C' | 'B' | 'A';
  pdf?: string;
  src?: string;
  isEmpty?: boolean;
}

const EMPTY: OfficialSeries = {
  seriesId: '',
  name: 'NOT FOUND',
  licenseClass: 'Rookie',
  isEmpty: true,
};

export type SeriesIndex = {
  index: number;
  next?: SeriesResult;
  prev?: SeriesResult;
};

export type SeriesResult = [OfficialSeries, SeriesIndex];

export function getSeriesById(id: string): [OfficialSeries, SeriesIndex] {
  const start = Date.now();
  const seriesIndex = iRacing2024S1.findIndex(
    (seriesObj) => seriesObj.seriesId == id,
  );

  const nextIndex = (seriesIndex + 1) % iRacing2024S1.length;
  const prevIndex =
    (iRacing2024S1.length + ((seriesIndex - 1) % iRacing2024S1.length)) %
    iRacing2024S1.length;

  console.log('next', nextIndex, 'prev', prevIndex);

  return [
    iRacing2024S1[seriesIndex],
    {
      index: seriesIndex,
      next: [iRacing2024S1[nextIndex], { index: nextIndex }],
      prev: [iRacing2024S1[prevIndex], { index: prevIndex }],
    },
  ];
}

export const iRacing2024S1RoadSeries: OfficialSeries[] = [
  {
    seriesId: '4555',
    name: 'Global Mazda MX‑5 Fanatec Cup',
    src: '/iracing/png/2024s1/GlobalMazda.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-road/GlobalMazda.pdf',
  },
  {
    seriesId: '4556',
    name: 'Formula Vee SIMAGIC Series',
    src: '/iracing/png/2024s1/Vee.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-road/FormulaVee.pdf',
  },
  {
    seriesId: '4557',
    name: 'Formula 1600 Rookie Sim‑Motion Series Fixed',
    src: '/iracing/png/2024s1/Formula1600.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-road/FF1600Rookie.pdf',
  },
  {
    seriesId: '4568',
    name: 'Ferrari GT3 Challenge Fixed',
    src: '/iracing/png/2024s1/FerrariGT3.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/FerrariGT3Fixed.pdf',
  },
  {
    seriesId: '4560',
    name: 'GR Buttkicker Cup Fixed',
    src: '/iracing/png/2024s1/GRCup.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/GRCup.pdf',
  },
  {
    seriesId: '4563',
    name: 'Production Car Sim‑Lab Challenge',
    src: '/iracing/png/2024s1/PCC.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/PCC.pdf',
  },
  {
    seriesId: '4561',
    name: 'Formula 1600 Thrustmaster Trophy',
    src: '/iracing/png/2024s1/FF1600D.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/FF1600.pdf',
  },
  {
    seriesId: '4570',
    name: 'FIA Formula 4 Challenge',
    src: '/iracing/png/2024s1/Formula4.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/Formula4.pdf',
  },
  {
    seriesId: '4569',
    name: 'FIA Formula 4 Challenge Fixed',
    src: '/iracing/png/2024s1/Formula4Fixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/Formula4.pdf',
  },
  {
    seriesId: '4564',
    name: 'GT4 Falken Tyre Challenge Fixed',
    src: '/iracing/png/2024s1/GT4Fixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/GT4Falken.pdf',
  },
  {
    seriesId: '4670',
    name: 'Weekly Race Challenge',
    src: '/iracing/png/2024s1/WeeklyRace.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/WeeklyChallenge.pdf',
  },
  {
    seriesId: '4575',
    name: 'Global Fanatec Challenge',
    src: '/iracing/png/2024s1/GlobalFanatec.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/FanatecFixed.pdf',
  },
  {
    seriesId: '4571',
    name: 'Skip Barber Race Series',
    src: '/iracing/png/2024s1/SkipBarber.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/SkipBarber.pdf',
  },
  {
    seriesId: '4562',
    name: 'Clio Cup Fixed',
    src: '/iracing/png/2024s1/ClioCup.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/ClioCup.pdf',
  },
  {
    seriesId: '4567',
    name: 'Touring Car Challenge',
    src: '/iracing/png/2024s1/TCC.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/TCC.pdf',
  },
  {
    seriesId: '4566',
    name: 'Touring Car Challenge Fixed',
    src: '/iracing/png/2024s1/TCCFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/TCCFixed.pdf',
  },
  {
    seriesId: '4574',
    name: 'Spec Racer Ford Challenge',
    src: '/iracing/png/2024s1/SpecRacer.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/SpecRacer.pdf',
  },
  {
    seriesId: '4559',
    name: 'US Open Wheel D USF 2000 Series Fixed',
    src: '/iracing/png/2024s1/OpenWheelD.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/OpenWheelDFixed.pdf',
  },
  {
    seriesId: '4578',
    name: 'FIA F4 Esports Regional Tour Europe North',
    src: '/iracing/png/2024s1/F4RegionalEurNo.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalEuropeNorth.pdf',
  },
  {
    seriesId: '4577',
    name: 'FIA F4 Esports Regional Tour Americas',
    src: '/iracing/png/2024s1/F4RegionalAmericas.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalAmericas.pdf',
  },
  {
    seriesId: '4579',
    name: 'FIA F4 Esports Regional Tour Europe South',
    src: '/iracing/png/2024s1/F4RegionalEurSo.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalEuropeSouth.pdf',
  },
  {
    seriesId: '4576',
    name: 'FIA F4 Esports Regional Tour Asia Pacific',
    src: '/iracing/png/2024s1/F4RegionalAsiaPac.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalAsiaPacific.pdf',
  },
  {
    seriesId: '4572',
    name: 'Mustang Skip Barber Challenge Fixed',
    src: '/iracing/png/2024s1/MustangBarber.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/SkipBarberFixed.pdf',
  },
  {
    seriesId: '4573',
    name: 'Mission R Challenge Fixed',
    src: '/iracing/png/2024s1/MissionR.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/MissionRFixed.pdf',
  },
  {
    seriesId: '4565',
    name: 'Falken Tyre Sports Car Challenge',
    src: '/iracing/png/2024s1/SCC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/SCC.pdf',
  },
  {
    seriesId: '4609',
    name: 'Proto‑GT Thrustmaster Challenge',
    src: '/iracing/png/2024s1/ProtoGT.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/ProtoGT.pdf',
  },
  {
    seriesId: '4666',
    name: 'Ring Meister Ricmotech Series Fixed',
    src: '/iracing/png/2024s1/RingMeister.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/RingMeisterFixed.pdf',
  },
  {
    seriesId: '4608',
    name: 'iRacing Porsche Cup Fixed',
    src: '/iracing/png/2024s1/PorscheCupFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/iRacingPorscheCupFixed.pdf',
  },
  {
    seriesId: '4607',
    name: 'iRacing Porsche Cup',
    src: '/iracing/png/2024s1/PorscheCup.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/iRacingPorscheCup.pdf',
  },
  {
    seriesId: '4602',
    name: 'Formula C DOF Reality Dallara F3 Series',
    src: '/iracing/png/2024s1/FormulaC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/FormulaC.pdf',
  },
  {
    seriesId: '4603',
    name: 'Formula C Thrustmaster Dallara F3 Series Fixed',
    src: '/iracing/png/2024s1/FormulaCFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/FormulaCFixed.pdf',
  },
  {
    seriesId: '4620',
    name: 'GT Endurance VRS Series',
    src: '/iracing/png/2024s1/GTEndurance.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/GTEndurance.pdf',
  },
  {
    seriesId: '4589',
    name: 'IMSA Michelin Pilot Challenge Series',
    src: '/iracing/png/2024s1/IMSAPilot.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/IMSAPilot.pdf',
  },
  {
    seriesId: '4601',
    name: 'Advanced Mazda MX‑5 Cup Series',
    src: '/iracing/png/2024s1/AdvancedMazda.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/AdvancedMazda.pdf',
  },
  {
    seriesId: '4585',
    name: 'LMP3 Turn Racing Trophy Fixed',
    src: '/iracing/png/2024s1/LMP3Trophy.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/LMP3Fixed.pdf',
  },
  {
    seriesId: '4586',
    name: 'Radical Esports Cup Fixed',
    src: '/iracing/png/2024s1/RadicalCup.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/RadicalFixed.pdf',
  },
  {
    seriesId: '4617',
    name: 'Classic Lotus Grand Prix',
    src: '/iracing/png/2024s1/ClassicLotus.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/LotusGP.pdf',
  },
  {
    seriesId: '4590',
    name: 'Dallara Formula iR Fixed',
    src: '/iracing/png/2024s1/FormulaiRFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/FormulaiRFixed.pdf',
  },
  {
    seriesId: '4587',
    name: 'IMSA Vintage Series',
    src: '/iracing/png/2024s1/IMSAVintage.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/IMSAVintage.pdf',
  },
  {
    seriesId: '4605',
    name: 'Supercars Series',
    src: '/iracing/png/2024s1/SupercarsSeries.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/SupercarsSeries.pdf',
  },
  {
    seriesId: '4606',
    name: 'Supercars Series Australian Servers',
    src: '/iracing/png/2024s1/SupercarsSeriesAus.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/SupercarsAus.pdf',
  },
  {
    seriesId: '4604',
    name: 'US Open Wheel C Indy Pro 2000 Series',
    src: '/iracing/png/2024s1/OpenWheelC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/OpenWheelC.pdf',
  },
  {
    seriesId: '4610',
    name: 'Grand Prix Legends',
    src: '/iracing/png/2024s1/GrandPrixLegends.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/GPLegends.pdf',
  },
  {
    seriesId: '4588',
    name: 'Stock Car Brasil Fixed',
    src: '/iracing/png/2024s1/StockCarBrasil.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/StockCarBrasilFixed.pdf',
  },
  {
    seriesId: '4618',
    name: 'GT3 Fanatec Challenge Fixed',
    src: '/iracing/png/2024s1/GT3Fixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GT3Fixed.pdf',
  },
  {
    seriesId: '4619',
    name: 'GT Sprint VRS Series',
    src: '/iracing/png/2024s1/GTSprint.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GTSprint.pdf',
  },
  {
    seriesId: '4626',
    name: 'Formula B Super Formula IMSIM Series Fixed',
    src: '/iracing/png/2024s1/SuperFormulaFixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/FormulaBFixed.pdf',
  },
  {
    seriesId: '4625',
    name: 'Formula B Super Formula IMSIM Series',
    src: '/iracing/png/2024s1/SuperFormula.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/FormulaB.pdf',
  },
  {
    seriesId: '4622',
    name: 'Global Endurance Pure Driving School Tour',
    src: '/iracing/png/2024s1/GlobalEndurance.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GlobalEndurance.pdf',
  },
  {
    seriesId: '4614',
    name: 'LMP2 Prototype Challenge Fixed',
    src: '/iracing/png/2024s1/LMP2Proto.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/LMP2Fixed.pdf',
  },
  {
    seriesId: '4621',
    name: 'GTE Sprint Pure Driving School Series',
    src: '/iracing/png/2024s1/GTESprint.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GTESprint.pdf',
  },
  {
    seriesId: '4623',
    name: 'IMSA Endurance Series',
    src: '/iracing/png/2024s1/IMSAEndurance.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/IMSAEndurance.pdf',
  },
  {
    seriesId: '4600',
    name: 'US Open Wheel B Dallara IR‑18',
    src: '/iracing/png/2024s1/OpenWheelB.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/OpenWheelB.pdf',
  },
  {
    seriesId: '4624',
    name: 'Formula B Formula Renault 3.5 Series',
    src: '/iracing/png/2024s1/FormulaB.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/Formula3.5.pdf',
  },
  {
    seriesId: '4615',
    name: 'IMSA iRacing Series',
    src: '/iracing/png/2024s1/IMSA.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/IMSA.pdf',
  },
  {
    seriesId: '4616',
    name: 'IMSA iRacing Series Fixed',
    src: '/iracing/png/2024s1/IMSAFixed.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/IMSAFixed.pdf',
  },
  {
    seriesId: '4629',
    name: 'Formula A Grand Prix Series',
    src: '/iracing/png/2024s1/FormulaA.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/FormulaA.pdf',
  },
  {
    seriesId: '4630',
    name: 'Formula A Grand Prix Series Fixed',
    src: '/iracing/png/2024s1/FormulaAFixed.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/FormulaAFixed.pdf',
  },
];

export const iRacing2024S1OvalSeries: OfficialSeries[] = [
  {
    seriesId: '4554',
    name: 'Street Stock Fanatec Series R',
    src: '/iracing/png/2024s1/StreetStock.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-oval/StreetStock.pdf',
  },
  {
    seriesId: '4553',
    name: 'Rookie Legends VRS Cup',
    src: '/iracing/png/2024s1/RookieLegends.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-oval/RookieLegends.pdf',
  },

  {
    seriesId: '4582',
    name: 'ARCA Menards Series Fixed',
    src: '/iracing/png/2024s1/ARCASeriesFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/ARCASeriesFixed.pdf',
  },
  {
    seriesId: '4667',
    name: 'Draft Master Fixed',
    src: '/iracing/png/2024s1/DraftMaster.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/DraftMaster.pdf',
  },
  {
    seriesId: '4581',
    name: 'CARS Late Model Stock Tour Fixed',
    src: '/iracing/png/2024s1/LateModelStockFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/LateModelStockFixed.pdf',
  },
  {
    seriesId: '4584',
    name: 'SK Modified Weekly Series Fixed',
    src: '/iracing/png/2024s1/SKModifiedFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/SKModifiedFixed.pdf',
  },
  {
    seriesId: '4583',
    name: 'SK Modified Weekly Series',
    src: '/iracing/png/2024s1/SKModifiedWeekly.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/SKModifiedWeekly.pdf',
  },

  {
    seriesId: '4596',
    name: 'NASCAR Class C Maconi Setup Shop Fixed',
    src: '/iracing/png/2024s1/NascarCFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARCFixed.pdf',
  },
  {
    seriesId: '4671',
    name: 'NASCAR iRacing Class C',
    src: '/iracing/png/2024s1/NascarC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARC.pdf',
  },
  {
    seriesId: '4599',
    name: 'US Open Wheel C Dallara IR‑18 Fixed',
    src: '/iracing/png/2024s1/OpenWheelC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/OpenWheelC.pdf',
  },
  {
    seriesId: '4598',
    name: 'Gen 4 Cup Fixed',
    src: '/iracing/png/2024s1/Gen4CupFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/Gen4CupFixed.pdf',
  },
  {
    seriesId: '4558',
    name: 'Advanced Legends Cup',
    src: '/iracing/png/2024s1/AdvancedLegends.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/AdvancedLegends.pdf',
  },
  {
    seriesId: '4580',
    name: 'CARS Late Model Stock Tour',
    src: '/iracing/png/2024s1/LateModelStock.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/LateModelStock.pdf',
  },
  {
    seriesId: '4591',
    name: 'Street Stock Next Level Racing Series C',
    src: '/iracing/png/2024s1/StreetStockC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/StreetStockC.pdf',
  },
  {
    seriesId: '4595',
    name: 'Super Late Model Series Fixed',
    src: '/iracing/png/2024s1/SuperLateModelFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/SuperLateModelFixed.pdf',
  },
  {
    seriesId: '4594',
    name: 'Super Late Model Series',
    src: '/iracing/png/2024s1/SuperLateModel.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/SuperLateModel.pdf',
  },
  {
    seriesId: '4593',
    name: 'NASCAR Tour Modified Series Fixed',
    src: '/iracing/png/2024s1/NascarTourModifiedFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARTourModifiedFixed.pdf',
  },
  {
    seriesId: '4592',
    name: 'NASCAR Tour Modified Series ',
    src: '/iracing/png/2024s1/NascarTourModified.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARTourModified.pdf',
  },

  {
    seriesId: '4611',
    name: 'NASCAR Class B Fixed',
    src: '/iracing/png/2024s1/NascarBFixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/NASCARBFixed.pdf',
  },
  {
    seriesId: '4672',
    name: 'NASCAR iRacing Class B',
    src: '/iracing/png/2024s1/NascarB.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/NASCARB.pdf',
  },
  {
    seriesId: '4597',
    name: 'NASCAR Legends Series',
    src: '/iracing/png/2024s1/NascarLegends.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/NASCARLegendsFixed.pdf',
  },
  {
    seriesId: '4613',
    name: 'Sprint Car Cup',
    src: '/iracing/png/2024s1/SprintCarCup.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/SprintCarCup.pdf',
  },
  {
    seriesId: '4612',
    name: 'Silver Crown Cup',
    src: '/iracing/png/2024s1/SilverCrownCup.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/SilverCrownCup.pdf',
  },

  {
    seriesId: '4628',
    name: 'NASCAR Class A Fixed',
    src: '/iracing/png/2024s1/NascarAFixed.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-oval/NASCARAFixed.pdf',
  },
  {
    seriesId: '4627',
    name: 'NASCAR Class A',
    src: '/iracing/png/2024s1/NascarA.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-oval/NASCARA.pdf',
  },
];

export const iRacing2024S1DirtOvalSeries: OfficialSeries[] = [
  {
    seriesId: '',
    name: 'Rookie DIRTcar Street Stock Series Fixed',
    licenseClass: 'Rookie',
    src: '',
  },
  {
    seriesId: '4635',
    name: 'Dirt Legends Cup',
    licenseClass: 'Rookie',
    src: '',
  },

  {
    seriesId: '',
    name: 'DIRTcar 305 Sprint Car Fanatec Series',
    licenseClass: 'D',
  },
  {
    seriesId: '',
    name: 'DIRTcar Limited Late Model Series',
    licenseClass: 'D',
  },
  {
    seriesId: '',
    name: 'DIRTcar 358 Modified Engine Ice Series',
    licenseClass: 'D',
  },

  {
    seriesId: '',
    name: 'DIRTcar Pro Late Model Series Fixed',
    licenseClass: 'C',
  },
  { seriesId: '', name: 'DIRTcar Pro Late Model Series', licenseClass: 'C' },
  {
    seriesId: '',
    name: 'SUPER DIRTcar Big Block Modified Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    name: 'SUPER DIRTcar Big Block Modified Series',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    name: 'DIRTcar 360 Sprint Car Carquest Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    name: 'DIRTcar 360 Sprint Car Carquest Series',
    licenseClass: 'C',
  },
  { seriesId: '', name: 'Dirt Midget Cup Fixed', licenseClass: 'C' },
  { seriesId: '', name: 'Dirt Midget Cup', licenseClass: 'C' },
  {
    seriesId: '',
    name: 'DIRTcar Class C Street Stock Series Fixed',
    licenseClass: 'C',
  },
  { seriesId: '', name: 'Dirt Super Late Model Tour Fixed', licenseClass: 'C' },
  { seriesId: '', name: 'USAC 360 Sprint Car Series', licenseClass: 'C' },
  { seriesId: '', name: 'Dirt 410 Sprint Car Tour Fixed', licenseClass: 'C' },

  {
    seriesId: '',
    name: 'World of Outlaws Late Model Series Fixed',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    name: 'World of Outlaws Late Model Series',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    name: 'World of Outlaws Sprint Car Series Fixed',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    name: 'World of Outlaws Sprint Car Series',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    name: 'DIRTcar UMP Modified Series Fixed',
    licenseClass: 'B',
  },
  { seriesId: '', name: 'AMSOIL USAC Sprint Car Fixed', licenseClass: 'B' },
];

export const iRacing2024S1DirtRoadSeries: OfficialSeries[] = [
  {
    seriesId: '',
    name: 'Rookie Pro 2 Lite Off‑Road Racing Series Fixed',
    licenseClass: 'Rookie',
  },
  {
    seriesId: '',
    name: 'Rookie iRX Volkswagen Beetle Lite Fixed',
    licenseClass: 'Rookie',
  },
  { seriesId: '', name: 'iRX Volkswagen Beetle Lite', licenseClass: 'D' },
  {
    seriesId: '',
    name: 'Pro 4 Off‑Road Racing Series Fixed',
    licenseClass: 'D',
  },
  { seriesId: '', name: 'Rallycross Series Fixed', licenseClass: 'C' },
  {
    seriesId: '',
    name: 'Pro 2 Off‑Road Racing Series Fixed',
    licenseClass: 'C',
  },
  { seriesId: '', name: 'Rallycross Series', licenseClass: 'B' },
  { seriesId: '', name: 'Pro 4 Off‑Road Racing Series', licenseClass: 'B' },
  { seriesId: '', name: 'Pro 2 Off‑Road Racing Series', licenseClass: 'B' },
];

export const iRacing2024S1: OfficialSeries[] = [
  ...iRacing2024S1RoadSeries,
  ...iRacing2024S1OvalSeries,
  ...iRacing2024S1DirtOvalSeries,
  ...iRacing2024S1DirtRoadSeries,
];
