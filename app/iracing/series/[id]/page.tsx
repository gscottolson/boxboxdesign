
import {OfficialSeries, getRoadSeries} from '../../schedule-list'

export default function Page({params}: {params: {id: string}}) {
    const series: OfficialSeries | null = getRoadSeries(params.id)
    console.log(series)
    return (
         <div className="h-dvh w-full">
            {series !== null && series.seriesId}
            {series !== null  && series.name}
            {series !== null  && series.licenseClass}
        </div>
    )
}