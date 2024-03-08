import { iRacing2024S1DirtOvalSeries } from './2024s1-dirtoval';
import { iRacing2024S1DirtRoadSeries } from './2024s1-dirtroad';
import { iRacing2024S1OvalSeries } from './2024s1-oval';
import { iRacing2024S1RoadSeries } from './2024s1-road';
import { iRacing2024S1UnrankedSeries } from './2024s1-unranked';
import { Discipline, OfficialSeries, Season, SeriesIndex, UpdatedDiscipline } from '../types';

import { iRacing2024S2DirtOvalSeries } from './2024s2-dirtoval';
import { iRacing2024S2DirtRoadSeries } from './2024s2-dirtroad';
import { iRacing2024S2FormulaSeries } from './2024s2-formula';
import { iRacing2024S2SportsCarSeries } from './2024s2-sportscar';
import { iRacing2024S2OvalSeries } from './2024s2-oval';
import { iRacing2024S2UnrankedSeries } from './2024s2-unranked';

const EMPTY: OfficialSeries = {
    seriesId: '',
    season: null,
    discipline: null,
    name: 'NOT FOUND',
    licenseClass: null,
    isEmpty: true,
    setup: null,
};

export function getSeriesURL(seriesId?: string) {
    return seriesId ? `/iracing/series/${seriesId}` : '/iracing/series/notfound';
}

export function getDisciplineURL(discipline: Discipline | UpdatedDiscipline, season?: Season) {
    const seasonSlug: Season = season || '2024s1';
    switch (discipline) {
        case 'Formula':
            return `/iracing/${seasonSlug}/formula/`;
        case 'Sports Car':
            return `/iracing/${seasonSlug}/sportscar/`;
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

export function getSeriesById(id: string, options?: { limitToDiscipline: boolean }): [OfficialSeries, SeriesIndex] {
    const series = SEASONS_BY_ID.find((value) => value.seriesId === id) || EMPTY;
    const { discipline: targetDiscipline, season: targetSeason } = series;

    const filterToDiscipline = series.discipline && options && options.limitToDiscipline;
    let seriesList = SEASONS_BY_ID.filter(({ discipline, season }) => {
        if (filterToDiscipline && targetDiscipline) {
            return discipline === targetDiscipline && season === targetSeason;
        } else {
            return season === targetSeason;
        }
    });

    const seriesIndex = seriesList.findIndex((value) => value.seriesId === series.seriesId);

    const prevIndex = (seriesList.length + ((seriesIndex - 1) % seriesList.length)) % seriesList.length;

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

export function get2024S2Formula() {
    return iRacing2024S2FormulaSeries;
}
export function get2024S2SportsCar() {
    return iRacing2024S2SportsCarSeries;
}
export function get2024S2Oval() {
    return iRacing2024S2OvalSeries;
}
export function get2024S2Dirtoval() {
    return iRacing2024S2DirtOvalSeries;
}
export function get2024S2Dirtroad() {
    return iRacing2024S2DirtRoadSeries;
}
export function get2024S2Unranked() {
    return iRacing2024S2UnrankedSeries;
}

const iRacing2024S2: OfficialSeries[] = [
    ...iRacing2024S2FormulaSeries,
    ...iRacing2024S2SportsCarSeries,
    ...iRacing2024S2OvalSeries,
    ...iRacing2024S2DirtOvalSeries,
    ...iRacing2024S2DirtRoadSeries,
    ...iRacing2024S2UnrankedSeries,
];

export function getAllForBuildPaths() {
    return [...iRacing2024S1, ...iRacing2024S2];
}

const SEASONS_BY_ID = getAllForBuildPaths();
