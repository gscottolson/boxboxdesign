import fs from 'fs/promises';
import path from 'path';
import SeriesClient, { type SeriesClientProps } from './SeriesClient';

async function readJson<T>(filePath: string): Promise<T> {
    const text = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(text) as T;
}

export default async function Page() {
    const series = await readJson<SeriesClientProps['series']>(
        path.join(process.cwd(), 'public', 'data', '2026s2.json')
    );

    return <SeriesClient series={series} />;
}
