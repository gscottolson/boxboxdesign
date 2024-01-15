export type Discipline = 'Road' | 'Oval' | 'Dirt Oval' | 'Dirt Road' | 'Unranked' | null;
export type License = 'A' | 'B' | 'C' | 'D' | 'Rookie' | null;
export type Season = '2024s1';

export interface OfficialSeries {
    seriesId?: string;
    discipline: Discipline;
    name: string;
    licenseClass: License;
    pdf?: string;
    src?: string;
    setup: 'open' | 'fixed' | null;
    isEmpty?: boolean;
}

export type SeriesIndex = {
    index: number;
    next?: SeriesResult;
    prev?: SeriesResult;
};

export type SeriesResult = [OfficialSeries, SeriesIndex];
