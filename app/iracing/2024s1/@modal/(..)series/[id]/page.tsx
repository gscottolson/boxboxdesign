'use client';

import { getRoadSeriesById } from "@/app/iracing/schedule-list";
import { Modal } from "./modal";
import { Document, Page as PDFPage, Thumbnail } from "react-pdf";
import { pdfjs } from 'react-pdf';
import React from "react";
import Balancer from 'react-wrap-balancer';
import {useBarcode} from 'next-barcode';

const ratio = 4/3;
const pdfWidth = 480;
const pdfHeight = pdfWidth * ratio;

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js',import.meta.url).toString();

export default function Page({params}: {params: {id: string}}) {
    const series = getRoadSeriesById(params.id);

    const { inputRef } = useBarcode<HTMLImageElement>({
        value: ` ${series.seriesId} ` || '',
        options: {
            background: '#EBEBEB',
            width: 2,
            height: 118,
            font: "inherit",
            fontSize: 16,
            lineColor: '#32545B',
            marginTop: 88,
            marginLeft: 27,
            marginRight: 27,
            marginBottom: 32,
        },
    });

    let downloadClass = "";
    switch(series.licenseClass) {
        case 'Rookie': downloadClass = "bg-[#92342E]"; break;
        case 'D': downloadClass = "bg-[#F98406]"; break;
        case 'C': downloadClass = "bg-[#D3A400]"; break;
        case 'B': downloadClass = "bg-[#3C6D56]"; break;
        case'A':
        default: downloadClass = "bg-[#315187]";
    }

    return (
         <Modal>
            <div className="w-full h-full flex">
                <div className="flex flex-col basis-[480px] place-content-center text-center shrink-0 bg-white100">                   
                     <Document
                        file={series.pdf}
                        // className="h-[640px] w-[480px]"
                        // onLoadError={handleError}
                        // onLoadSuccess={handleSuccess}
                            
                        >
                       <Thumbnail pageNumber={1} height={pdfHeight} className="block" />   
                    </Document>
                </div>

                <div className="flex flex-col justify-between basis-full px-8 antialiased text-teal800">
                    <header className="pt-16">
                        <h3 className="mb-2 text-3xl font-semilight tracking-tight teal800"> 
                            <Balancer>{series.name}</Balancer>
                        </h3>
                        <h4 className="text-l font-medium tracking-widest uppercase mb-4 leading-tight text-gray700">
                            <Balancer>iRacing Official Series</Balancer>
                        </h4>
                    </header>

                    <div className="flex flex-col gap-8">
                        <span className="inline-block drop-shadow-md" >
                            <a
                                href={series.pdf}
                                target="__blank"
                                rel="noopener"
                                className={`
                                    inline-block w-full py-4 px-12 ${downloadClass} uppercase text-center text-white100 font-medium rounded-full ring-2 ring-offset-4 ring-offset-[#D6DDDF] ring-black
                                `}
                                >Download PDF</a>
                        </span>
                        <div className="basis-[256px] bg-white200">
                            <svg ref={inputRef} className="block barcode" />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}