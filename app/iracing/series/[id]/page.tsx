
import {OfficialSeries, getRoadSeriesById} from '@/app/iracing/schedule-list'

export default function Page({params}: {params: {id: string}}) {
    const series: OfficialSeries | null = getRoadSeriesById(params.id)
    return (
         <div className="h-dvh w-full">
            {series !== null && series.seriesId}
            {series !== null  && series.name}
            {series !== null  && series.licenseClass}
        </div>
    )
}