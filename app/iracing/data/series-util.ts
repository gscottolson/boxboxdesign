import { iRacing2024S1DirtOvalSeries } from './2024s1-dirtoval';
import { iRacing2024S1DirtRoadSeries } from './2024s1-dirtroad';
import { iRacing2024S1OvalSeries } from './2024s1-oval';
import { iRacing2024S1RoadSeries } from './2024s1-road';
import { iRacing2024S1UnrankedSeries } from './2024s1-unranked';
import { Discipline, OfficialSeries, Season, SeriesIndex } from '../types';

const EMPTY: OfficialSeries = {
  seriesId: '',
  discipline: null,
  name: 'NOT FOUND',
  licenseClass: null,
  isEmpty: true,
};

export function getSeriesURL(seriesId?: string) {
  return seriesId ? `/iracing/series/${seriesId}` : '/iracing/series/notfound';
}

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
    case 'Unranked':
      return `/iracing/${seasonSlug}/unranked/`;
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
  let seriesList = iRacing2024S1;

  if (filterToDiscipline) {
    switch (series.discipline) {
      case 'Road':
        seriesList = getAllRoad();
        break;
      case 'Oval':
        seriesList = getAllOval();
        break;
      case 'Dirt Oval':
        seriesList = getAllDirtoval();
        break;
      case 'Dirt Road':
        seriesList = getAllDirtroad();
        break;
      case 'Unranked':
        seriesList = getAllUnranked();
        break;
    }
  }

  const seriesIndex = seriesList.findIndex(
    (value) => value.seriesId === series.seriesId,
  );

  const prevIndex =
    (seriesList.length + ((seriesIndex - 1) % seriesList.length)) %
    seriesList.length;

  const nextIndex = (seriesIndex + 1) % seriesList.length;

  return [
    seriesList[seriesIndex],
    {
      index: seriesIndex,
      prev: [seriesList[prevIndex], { index: prevIndex }],
      next: [seriesList[nextIndex], { index: nextIndex }],
    },
  ];
}

export function getAll() {
  return iRacing2024S1;
}

export function getAllRoad() {
  return iRacing2024S1RoadSeries;
}
export function getAllOval() {
  return iRacing2024S1OvalSeries;
}
export function getAllDirtoval() {
  return iRacing2024S1DirtOvalSeries;
}
export function getAllDirtroad() {
  return iRacing2024S1DirtRoadSeries;
}
export function getAllUnranked() {
  return iRacing2024S1UnrankedSeries;
}

const iRacing2024S1: OfficialSeries[] = [
  ...iRacing2024S1RoadSeries,
  ...iRacing2024S1OvalSeries,
  ...iRacing2024S1DirtOvalSeries,
  ...iRacing2024S1DirtRoadSeries,
  ...iRacing2024S1UnrankedSeries,
];
