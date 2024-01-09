type Discipline = 'Road' | 'Oval' | 'Dirt Oval' | 'Dirt Road' | null;
type License = 'A' | 'B' | 'C' | 'D' | 'Rookie' | null;
type Season = '2024s1';

export interface OfficialSeries {
  seriesId?: string;
  discipline: Discipline;
  name: string;
  licenseClass: License;
  pdf?: string;
  src?: string;
  isEmpty?: boolean;
}

const EMPTY: OfficialSeries = {
  seriesId: '',
  discipline: null,
  name: 'NOT FOUND',
  licenseClass: null,
  isEmpty: true,
};

export type SeriesIndex = {
  index: number;
  next?: SeriesResult;
  prev?: SeriesResult;
};

export type SeriesResult = [OfficialSeries, SeriesIndex];

export function getDisciplineURL(discipline: Discipline, season?: Season) {
  const seasonSlug: Season = season || '2024s1';
  switch (discipline) {
    case 'Road':
      return `/iracing/${seasonSlug}/road/`;
    case 'Oval':
      return `/iracing/${seasonSlug}/oval/`;
    case 'Dirt Road':
      return `/iracing/${seasonSlug}/dirtroad/`;
    case 'Dirt Oval':
      return `/iracing/${seasonSlug}/dirtoval/`;
    default:
      return '/';
  }
}

export function getSeriesById(
  id: string,
  options?: { limitToDiscipline: boolean },
): [OfficialSeries, SeriesIndex] {
  const series = iRacing2024S1.find((value) => value.seriesId === id) || EMPTY;

  const filterToDiscipline = series && options && options.limitToDiscipline;
  const seriestList = filterToDiscipline
    ? getAllByDiscipline(series.discipline)
    : iRacing2024S1;

  const seriesIndex = seriestList.findIndex(
    (value) => value.seriesId === series.seriesId,
  );

  const prevIndex =
    (seriestList.length + ((seriesIndex - 1) % seriestList.length)) %
    seriestList.length;

  const nextIndex = (seriesIndex + 1) % seriestList.length;

  return [
    seriestList[seriesIndex],
    {
      index: seriesIndex,
      prev: [seriestList[prevIndex], { index: prevIndex }],
      next: [seriestList[nextIndex], { index: nextIndex }],
    },
  ];
}

export function getAllByDiscipline(discipline: Discipline): OfficialSeries[] {
  return iRacing2024S1.filter((series) => series.discipline === discipline);
}

export function getAllRoad() {
  return getAllByDiscipline('Road');
}
export function getAllOval() {
  return getAllByDiscipline('Oval');
}

export const iRacing2024S1RoadSeries: OfficialSeries[] = [
  {
    seriesId: '4555',
    discipline: 'Road',
    name: 'Global Mazda MX‑5 Fanatec Cup',
    src: '/iracing/png/2024s1/GlobalMazda.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-road/GlobalMazda.pdf',
  },
  {
    seriesId: '4556',
    discipline: 'Road',
    name: 'Formula Vee SIMAGIC Series',
    src: '/iracing/png/2024s1/Vee.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-road/FormulaVee.pdf',
  },
  {
    seriesId: '4557',
    discipline: 'Road',
    name: 'Formula 1600 Rookie Sim‑Motion Series Fixed',
    src: '/iracing/png/2024s1/Formula1600.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-road/FF1600Rookie.pdf',
  },
  {
    seriesId: '4568',
    discipline: 'Road',
    name: 'Ferrari GT3 Challenge Fixed',
    src: '/iracing/png/2024s1/FerrariGT3.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/FerrariGT3Fixed.pdf',
  },
  {
    seriesId: '4560',
    discipline: 'Road',
    name: 'GR Buttkicker Cup Fixed',
    src: '/iracing/png/2024s1/GRCup.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/GRCup.pdf',
  },
  {
    seriesId: '4563',
    discipline: 'Road',
    name: 'Production Car Sim‑Lab Challenge',
    src: '/iracing/png/2024s1/PCC.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/PCC.pdf',
  },
  {
    seriesId: '4561',
    discipline: 'Road',
    name: 'Formula 1600 Thrustmaster Trophy',
    src: '/iracing/png/2024s1/FF1600D.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/FF1600.pdf',
  },
  {
    seriesId: '4570',
    discipline: 'Road',
    name: 'FIA Formula 4 Challenge',
    src: '/iracing/png/2024s1/Formula4.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/Formula4.pdf',
  },
  {
    seriesId: '4569',
    discipline: 'Road',
    name: 'FIA Formula 4 Challenge Fixed',
    src: '/iracing/png/2024s1/Formula4Fixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/Formula4.pdf',
  },
  {
    seriesId: '4564',
    discipline: 'Road',
    name: 'GT4 Falken Tyre Challenge Fixed',
    src: '/iracing/png/2024s1/GT4Fixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/GT4Falken.pdf',
  },
  {
    seriesId: '4670',
    discipline: 'Road',
    name: 'Weekly Race Challenge',
    src: '/iracing/png/2024s1/WeeklyRace.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/WeeklyChallenge.pdf',
  },
  {
    seriesId: '4575',
    discipline: 'Road',
    name: 'Global Fanatec Challenge Fixed',
    src: '/iracing/png/2024s1/GlobalFanatec.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/FanatecFixed.pdf',
  },
  {
    seriesId: '4571',
    discipline: 'Road',
    name: 'Skip Barber Race Series',
    src: '/iracing/png/2024s1/SkipBarber.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/SkipBarber.pdf',
  },
  {
    seriesId: '4562',
    discipline: 'Road',
    name: 'Clio Cup Fixed',
    src: '/iracing/png/2024s1/ClioCupFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/ClioCupFixed.pdf',
  },
  {
    seriesId: '4567',
    discipline: 'Road',
    name: 'Touring Car Challenge',
    src: '/iracing/png/2024s1/TCC.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/TCC.pdf',
  },
  {
    seriesId: '4566',
    discipline: 'Road',
    name: 'Touring Car Challenge Fixed',
    src: '/iracing/png/2024s1/TCCFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/TCCFixed.pdf',
  },
  {
    seriesId: '4574',
    discipline: 'Road',
    name: 'Spec Racer Ford Challenge',
    src: '/iracing/png/2024s1/SpecRacer.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/SpecRacer.pdf',
  },
  {
    seriesId: '4559',
    discipline: 'Road',
    name: 'US Open Wheel D USF 2000 Series Fixed',
    src: '/iracing/png/2024s1/OpenWheelD.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/OpenWheelDFixed.pdf',
  },
  {
    seriesId: '4578',
    discipline: 'Road',
    name: 'FIA F4 Esports Regional Tour Europe North',
    src: '/iracing/png/2024s1/F4RegionalEurNo.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalEuropeNorth.pdf',
  },
  {
    seriesId: '4577',
    discipline: 'Road',
    name: 'FIA F4 Esports Regional Tour Americas',
    src: '/iracing/png/2024s1/F4RegionalAmericas.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalAmericas.pdf',
  },
  {
    seriesId: '4579',
    discipline: 'Road',
    name: 'FIA F4 Esports Regional Tour Europe South',
    src: '/iracing/png/2024s1/F4RegionalEurSo.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalEuropeSouth.pdf',
  },
  {
    seriesId: '4576',
    discipline: 'Road',
    name: 'FIA F4 Esports Regional Tour Asia Pacific',
    src: '/iracing/png/2024s1/F4RegionalAsiaPac.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/F4RegionalAsiaPacific.pdf',
  },
  {
    seriesId: '4572',
    discipline: 'Road',
    name: 'Mustang Skip Barber Challenge Fixed',
    src: '/iracing/png/2024s1/MustangBarber.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/SkipBarberFixed.pdf',
  },
  {
    seriesId: '4573',
    discipline: 'Road',
    name: 'Mission R Challenge Fixed',
    src: '/iracing/png/2024s1/MissionR.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-road/MissionRFixed.pdf',
  },
  {
    seriesId: '4565',
    discipline: 'Road',
    name: 'Falken Tyre Sports Car Challenge',
    src: '/iracing/png/2024s1/SCC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/SCC.pdf',
  },
  {
    seriesId: '4609',
    discipline: 'Road',
    name: 'Proto‑GT Thrustmaster Challenge',
    src: '/iracing/png/2024s1/ProtoGT.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/ProtoGT.pdf',
  },
  {
    seriesId: '4666',
    discipline: 'Road',
    name: 'Ring Meister Ricmotech Series Fixed',
    src: '/iracing/png/2024s1/RingMeister.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/RingMeisterFixed.pdf',
  },
  {
    seriesId: '4608',
    discipline: 'Road',
    name: 'iRacing Porsche Cup by Coach Dave Delta Fixed',
    src: '/iracing/png/2024s1/PorscheCupFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/iRacingPorscheCupFixed.pdf',
  },
  {
    seriesId: '4607',
    discipline: 'Road',
    name: 'iRacing Porsche Cup by Coach Dave Delta',
    src: '/iracing/png/2024s1/PorscheCup.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/iRacingPorscheCup.pdf',
  },
  {
    seriesId: '4602',
    discipline: 'Road',
    name: 'Formula C DOF Reality Dallara F3 Series',
    src: '/iracing/png/2024s1/FormulaC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/FormulaC.pdf',
  },
  {
    seriesId: '4603',
    discipline: 'Road',
    name: 'Formula C Thrustmaster Dallara F3 Series Fixed',
    src: '/iracing/png/2024s1/FormulaCFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/FormulaCFixed.pdf',
  },
  {
    seriesId: '4620',
    discipline: 'Road',
    name: 'GT Endurance VRS Series',
    src: '/iracing/png/2024s1/GTEndurance.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/GTEndurance.pdf',
  },
  {
    seriesId: '4589',
    discipline: 'Road',
    name: 'IMSA Michelin Pilot Challenge',
    src: '/iracing/png/2024s1/IMSAPilot.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/IMSAPilot.pdf',
  },
  {
    seriesId: '4601',
    discipline: 'Road',
    name: 'Advanced Mazda MX‑5 Cup Series',
    src: '/iracing/png/2024s1/AdvancedMazda.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/AdvancedMazda.pdf',
  },
  {
    seriesId: '4585',
    discipline: 'Road',
    name: 'LMP3 Turn Racing Trophy Fixed',
    src: '/iracing/png/2024s1/LMP3Trophy.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/LMP3Fixed.pdf',
  },
  {
    seriesId: '4586',
    discipline: 'Road',
    name: 'Radical Esports Cup Fixed',
    src: '/iracing/png/2024s1/RadicalCup.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/RadicalFixed.pdf',
  },
  {
    seriesId: '4617',
    discipline: 'Road',
    name: 'Classic Lotus Grand Prix',
    src: '/iracing/png/2024s1/LotusGP.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/LotusGP.pdf',
  },
  {
    seriesId: '4590',
    discipline: 'Road',
    name: 'Dallara Formula iR Fixed',
    src: '/iracing/png/2024s1/FormulaiRFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/FormulaiRFixed.pdf',
  },
  {
    seriesId: '4587',
    discipline: 'Road',
    name: 'IMSA Vintage Series',
    src: '/iracing/png/2024s1/IMSAVintage.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/IMSAVintage.pdf',
  },
  {
    seriesId: '4605',
    discipline: 'Road',
    name: 'Supercars Series',
    src: '/iracing/png/2024s1/SupercarsSeries.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/SupercarsSeries.pdf',
  },
  {
    seriesId: '4606',
    discipline: 'Road',
    name: 'Supercars Series Australian Servers',
    src: '/iracing/png/2024s1/SupercarsSeriesAus.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/SupercarsAus.pdf',
  },
  {
    seriesId: '4604',
    discipline: 'Road',
    name: 'US Open Wheel C Indy Pro 2000 Series',
    src: '/iracing/png/2024s1/OpenWheelC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/OpenWheelC.pdf',
  },
  {
    seriesId: '4610',
    discipline: 'Road',
    name: 'Grand Prix Legends',
    src: '/iracing/png/2024s1/GrandPrixLegends.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/GPLegends.pdf',
  },
  {
    seriesId: '4588',
    discipline: 'Road',
    name: 'Stock Car Brasil Fixed',
    src: '/iracing/png/2024s1/StockCarBrasil.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-road/StockCarBrasilFixed.pdf',
  },
  {
    seriesId: '4618',
    discipline: 'Road',
    name: 'GT3 Fanatec Challenge Fixed',
    src: '/iracing/png/2024s1/GT3Fixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GT3Fixed.pdf',
  },
  {
    seriesId: '4619',
    discipline: 'Road',
    name: 'GT Sprint VRS Series',
    src: '/iracing/png/2024s1/GTSprint.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GTSprint.pdf',
  },
  {
    seriesId: '4626',
    discipline: 'Road',
    name: 'Formula B Super Formula IMSIM Series Fixed',
    src: '/iracing/png/2024s1/SuperFormulaFixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/FormulaBFixed.pdf',
  },
  {
    seriesId: '4625',
    discipline: 'Road',
    name: 'Formula B Super Formula IMSIM Series',
    src: '/iracing/png/2024s1/SuperFormula.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/FormulaB.pdf',
  },
  {
    seriesId: '4622',
    discipline: 'Road',
    name: 'Global Endurance Pure Driving School Tour',
    src: '/iracing/png/2024s1/GlobalEndurance.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GlobalEndurance.pdf',
  },
  {
    seriesId: '4614',
    discipline: 'Road',
    name: 'LMP2 Prototype Challenge Fixed',
    src: '/iracing/png/2024s1/LMP2Proto.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/LMP2Fixed.pdf',
  },
  {
    seriesId: '4621',
    discipline: 'Road',
    name: 'GTE Sprint Pure Driving School Series',
    src: '/iracing/png/2024s1/GTESprint.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/GTESprint.pdf',
  },
  {
    seriesId: '4623',
    discipline: 'Road',
    name: 'IMSA Endurance Series',
    src: '/iracing/png/2024s1/IMSAEndurance.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/IMSAEndurance.pdf',
  },
  {
    seriesId: '4600',
    discipline: 'Road',
    name: 'US Open Wheel B Dallara IR‑18',
    src: '/iracing/png/2024s1/OpenWheelB.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/OpenWheelB.pdf',
  },
  {
    seriesId: '4624',
    discipline: 'Road',
    name: 'Formula B Formula Renault 3.5 Series',
    src: '/iracing/png/2024s1/FormulaB.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-road/Formula3.5.pdf',
  },
  {
    seriesId: '4615',
    discipline: 'Road',
    name: 'IMSA iRacing Series',
    src: '/iracing/png/2024s1/IMSA.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/IMSA.pdf',
  },
  {
    seriesId: '4616',
    discipline: 'Road',
    name: 'IMSA iRacing Series Fixed',
    src: '/iracing/png/2024s1/IMSAFixed.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/IMSAFixed.pdf',
  },
  {
    seriesId: '4629',
    discipline: 'Road',
    name: 'Formula A Grand Prix Series',
    src: '/iracing/png/2024s1/FormulaA.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/FormulaA.pdf',
  },
  {
    seriesId: '4630',
    discipline: 'Road',
    name: 'Formula A Grand Prix Series Fixed',
    src: '/iracing/png/2024s1/FormulaAFixed.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-road/FormulaAFixed.pdf',
  },
];

export const iRacing2024S1OvalSeries: OfficialSeries[] = [
  {
    seriesId: '4554',
    discipline: 'Oval',
    name: 'Street Stock Fanatec Series R',
    src: '/iracing/png/2024s1/StreetStock.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-oval/StreetStock.pdf',
  },
  {
    seriesId: '4553',
    discipline: 'Oval',
    name: 'Rookie Legends VRS Cup',
    src: '/iracing/png/2024s1/RookieLegends.png',
    licenseClass: 'Rookie',
    pdf: '/iracing/pdf/2024s1-oval/RookieLegends.pdf',
  },

  {
    seriesId: '4582',
    discipline: 'Oval',
    name: 'ARCA Menards Series Fixed',
    src: '/iracing/png/2024s1/ARCASeriesFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/ARCASeriesFixed.pdf',
  },
  {
    seriesId: '4667',
    discipline: 'Oval',
    name: 'Draft Master Fixed',
    src: '/iracing/png/2024s1/DraftMaster.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/DraftMaster.pdf',
  },
  {
    seriesId: '4581',
    discipline: 'Oval',
    name: 'CARS Late Model Stock Tour Fixed',
    src: '/iracing/png/2024s1/LateModelStockFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/LateModelStockFixed.pdf',
  },
  {
    seriesId: '4584',
    discipline: 'Oval',
    name: 'SK Modified Weekly Series Fixed',
    src: '/iracing/png/2024s1/SKModifiedFixed.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/SKModifiedFixed.pdf',
  },
  {
    seriesId: '4583',
    discipline: 'Oval',
    name: 'SK Modified Weekly Series',
    src: '/iracing/png/2024s1/SKModifiedWeekly.png',
    licenseClass: 'D',
    pdf: '/iracing/pdf/2024s1-oval/SKModifiedWeekly.pdf',
  },

  {
    seriesId: '4596',
    discipline: 'Oval',
    name: 'NASCAR Class C Maconi Setup Shop Fixed',
    src: '/iracing/png/2024s1/NascarCFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARCFixed.pdf',
  },
  {
    seriesId: '4671',
    discipline: 'Oval',
    name: 'NASCAR iRacing Class C',
    src: '/iracing/png/2024s1/NascarC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARC.pdf',
  },
  {
    seriesId: '4599',
    discipline: 'Oval',
    name: 'US Open Wheel C Dallara IR‑18 Fixed',
    src: '/iracing/png/2024s1/OpenWheelC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/OpenWheelC.pdf',
  },
  {
    seriesId: '4598',
    discipline: 'Oval',
    name: 'Gen 4 Cup Fixed',
    src: '/iracing/png/2024s1/Gen4CupFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/Gen4CupFixed.pdf',
  },
  {
    seriesId: '4558',
    discipline: 'Oval',
    name: 'Advanced Legends Cup',
    src: '/iracing/png/2024s1/AdvancedLegends.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/AdvancedLegends.pdf',
  },
  {
    seriesId: '4580',
    discipline: 'Oval',
    name: 'CARS Late Model Stock Tour',
    src: '/iracing/png/2024s1/LateModelStock.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/LateModelStock.pdf',
  },
  {
    seriesId: '4591',
    discipline: 'Oval',
    name: 'Street Stock Next Level Racing Series C',
    src: '/iracing/png/2024s1/StreetStockC.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/StreetStockC.pdf',
  },
  {
    seriesId: '4595',
    discipline: 'Oval',
    name: 'Super Late Model Series Fixed',
    src: '/iracing/png/2024s1/SuperLateModelFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/SuperLateModelFixed.pdf',
  },
  {
    seriesId: '4594',
    discipline: 'Oval',
    name: 'Super Late Model Series',
    src: '/iracing/png/2024s1/SuperLateModel.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/SuperLateModel.pdf',
  },
  {
    seriesId: '4593',
    discipline: 'Oval',
    name: 'NASCAR Tour Modified Series Fixed',
    src: '/iracing/png/2024s1/NascarTourModifiedFixed.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARTourModifiedFixed.pdf',
  },
  {
    seriesId: '4592',
    discipline: 'Oval',
    name: 'NASCAR Tour Modified Series ',
    src: '/iracing/png/2024s1/NascarTourModified.png',
    licenseClass: 'C',
    pdf: '/iracing/pdf/2024s1-oval/NASCARTourModified.pdf',
  },

  {
    seriesId: '4611',
    discipline: 'Oval',
    name: 'NASCAR Class B Series Fixed',
    src: '/iracing/png/2024s1/NascarBFixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/NASCARBFixed.pdf',
  },
  {
    seriesId: '4672',
    discipline: 'Oval',
    name: 'NASCAR iRacing Class B Series',
    src: '/iracing/png/2024s1/NascarB.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/NASCARB.pdf',
  },
  {
    seriesId: '4597',
    discipline: 'Oval',
    name: 'NASCAR Legends Series',
    src: '/iracing/png/2024s1/NascarLegendsFixed.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/NASCARLegendsFixed.pdf',
  },
  {
    seriesId: '4613',
    discipline: 'Oval',
    name: 'Sprint Car Cup',
    src: '/iracing/png/2024s1/SprintCarCup.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/SprintCarCup.pdf',
  },
  {
    seriesId: '4612',
    discipline: 'Oval',
    name: 'Silver Crown Cup',
    src: '/iracing/png/2024s1/SilverCrownCup.png',
    licenseClass: 'B',
    pdf: '/iracing/pdf/2024s1-oval/SilverCrownCup.pdf',
  },

  {
    seriesId: '4628',
    discipline: 'Oval',
    name: 'NASCAR Class A Series Fixed',
    src: '/iracing/png/2024s1/NascarAFixed.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-oval/NASCARAFixed.pdf',
  },
  {
    seriesId: '4627',
    discipline: 'Oval',
    name: 'NASCAR Class A Series',
    src: '/iracing/png/2024s1/NascarA.png',
    licenseClass: 'A',
    pdf: '/iracing/pdf/2024s1-oval/NASCARA.pdf',
  },
];

export const iRacing2024S1DirtOvalSeries: OfficialSeries[] = [
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'Rookie DIRTcar Street Stock Series Fixed',
    licenseClass: 'Rookie',
    src: '',
  },
  {
    seriesId: '4635',
    discipline: 'Dirt Oval',
    name: 'Dirt Legends Cup',
    licenseClass: 'Rookie',
    src: '',
  },

  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar 305 Sprint Car Fanatec Series',
    licenseClass: 'D',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar Limited Late Model Series',
    licenseClass: 'D',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar 358 Modified Engine Ice Series',
    licenseClass: 'D',
  },

  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar Pro Late Model Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar Pro Late Model Series',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'SUPER DIRTcar Big Block Modified Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'SUPER DIRTcar Big Block Modified Series',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar 360 Sprint Car Carquest Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar 360 Sprint Car Carquest Series',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'Dirt Midget Cup Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'Dirt Midget Cup',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar Class C Street Stock Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'Dirt Super Late Model Tour Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'USAC 360 Sprint Car Series',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'Dirt 410 Sprint Car Tour Fixed',
    licenseClass: 'C',
  },

  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'World of Outlaws Late Model Series Fixed',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'World of Outlaws Late Model Series',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'World of Outlaws Sprint Car Series Fixed',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'World of Outlaws Sprint Car Series',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'DIRTcar UMP Modified Series Fixed',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Oval',
    name: 'AMSOIL USAC Sprint Car Fixed',
    licenseClass: 'B',
  },
];

export const iRacing2024S1DirtRoadSeries: OfficialSeries[] = [
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Rookie Pro 2 Lite Off‑Road Racing Series Fixed',
    licenseClass: 'Rookie',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Rookie iRX Volkswagen Beetle Lite Fixed',
    licenseClass: 'Rookie',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'iRX Volkswagen Beetle Lite',
    licenseClass: 'D',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Pro 4 Off‑Road Racing Series Fixed',
    licenseClass: 'D',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Rallycross Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Pro 2 Off‑Road Racing Series Fixed',
    licenseClass: 'C',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Rallycross Series',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Pro 4 Off‑Road Racing Series',
    licenseClass: 'B',
  },
  {
    seriesId: '',
    discipline: 'Dirt Road',
    name: 'Pro 2 Off‑Road Racing Series',
    licenseClass: 'B',
  },
];

export const iRacing2024S1: OfficialSeries[] = [
  ...iRacing2024S1RoadSeries,
  ...iRacing2024S1OvalSeries,
  ...iRacing2024S1DirtOvalSeries,
  ...iRacing2024S1DirtRoadSeries,
];
