export type Discipline = 'Road' | 'Oval' | 'Dirt Oval' | 'Dirt Road' | 'Unranked' | null;
export type UpdatedDiscipline = 'Formula' | 'Sports Car' | 'Oval' | 'Dirt Oval' | 'Dirt Road' | 'Unranked' | null;
export type License = 'A' | 'B' | 'C' | 'D' | 'Rookie' | null;
export type Season = '2024s1' | '2024s2' | null;

export interface OfficialSeries {
    seriesId?: string;
    season: Season;
    discipline: Discipline | UpdatedDiscipline;
    name: string;
    licenseClass: License;
    pdfLight?: string;
    pdfDark?: string;
    srcLight?: string;
    srcDark?: string;
    setup: 'open' | 'fixed' | null;
    isEmpty?: boolean;
}

export type SeriesIndex = {
    index: number;
    next?: SeriesResult;
    prev?: SeriesResult;
};

export type SeriesResult = [OfficialSeries, SeriesIndex];
