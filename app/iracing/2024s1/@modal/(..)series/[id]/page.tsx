
import { getRoadSeries } from "@/app/iracing/schedule-list";
import { Modal } from "./modal";

export default function Page({params}: {params: {id: string}}) {
    const series = getRoadSeries(params.id)
    return (
         <Modal>
            <div className="w-full h-full flex flex-col place-content-center text-center">
                <p>Id: {series !== null && series.seriesId}</p>
                <p>{series !== null && series.name}</p>
                <p>{series !== null && series.licenseClass}</p>
            </div>
        </Modal>
    )
}