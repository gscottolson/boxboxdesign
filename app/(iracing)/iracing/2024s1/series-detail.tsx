'use client';

import { Document, Page as PDFPage, Thumbnail } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import React from 'react';
import Balancer from 'react-wrap-balancer';
import { useBarcode } from 'next-barcode';
import { Download } from './icons';
import { OfficialSeries } from '../types';

const pdfHeight = 640;

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

export function SeriesDetail({ series }: { series: OfficialSeries }) {
    const { inputRef } = useBarcode<HTMLImageElement>({
        value: ` ${series.seriesId} ` || '',
        options: barCodeOptions,
    });

    let downloadClass = '';
    switch (series.licenseClass) {
        case 'Rookie':
            downloadClass = 'bg-[#92342E]';
            break;
        case 'D':
            downloadClass = 'bg-[#F98406]';
            break;
        case 'C':
            downloadClass = 'bg-[#D3A400]';
            break;
        case 'B':
            downloadClass = 'bg-[#3C6D56]';
            break;
        case 'A':
        default:
            downloadClass = 'bg-[#315187]';
    }

    return (
        <div className="box-content flex w-full flex-col md:flex-row md:border-[.5px] md:border-[rgba(90,90,90,0.15)]">
            <div className="relative mx-auto flex h-[400px] w-[300px] grow place-content-center overflow-hidden text-center md:mx-0 md:h-full md:w-full md:bg-white100">
                <Document
                    file={series.pdf}
                    className="absolute -left-[30%] -top-[30%] z-0 h-pdf w-pdf scale-[0.625] md:relative md:left-auto md:top-auto md:scale-100"
                    loading={<PDFLoading />}
                    noData={<PDFError />}
                    error={<PDFError />}
                >
                    <Thumbnail pageNumber={1} height={pdfHeight} className="pointer-events-none cursor-default" />
                </Document>
            </div>

            <div className="flex w-full shrink-0 flex-col justify-between px-6 text-teal800 antialiased md:w-[320px]">
                <header className="pt-4 text-center md:text-left">
                    <h3 className="font-semilight mb-2 pr-2 text-3xl leading-9 tracking-tight">
                        <Balancer>{series.name}</Balancer>
                    </h3>
                    <h4 className="font-semilight text-xl leading-tight tracking-wide text-gray700">
                        Official Series Schedule
                    </h4>
                    <h4 className="font-semilight text-xl  leading-tight tracking-wide text-gray700">
                        iRacing 2024 Season 1
                    </h4>
                </header>

                <div className="flex flex-col items-center pt-4 md:items-start md:pt-0">
                    <span className="mb-8 inline-block overflow-hidden rounded-sm shadow-lg active:scale-95">
                        <a
                            href={series.pdf}
                            target="__blank"
                            rel="noopener"
                            className={`inline-flex place-content-center px-6 py-3 ${downloadClass} text-center focus:ring-2  focus:ring-black  focus:ring-offset-4  focus:ring-offset-[#D6DDDF]`}
                        >
                            <span className="pr-4 font-medium uppercase text-white100">Download PDF</span> <Download />
                        </a>
                    </span>
                    <div className="hidden w-[256px] basis-[272px] self-stretch overflow-hidden rounded-tl-sm rounded-tr-sm bg-white200 md:block">
                        <svg ref={inputRef} className="barcode block" />
                    </div>
                </div>
            </div>
        </div>
    );
}

const disabledDownload: React.CSSProperties = {
    pointerEvents: 'none',
    filter: 'grayscale(90%)',
    opacity: 0.3,
};

const enabledDownload: React.CSSProperties = {
    pointerEvents: 'auto',
    filter: 'none',
    opacity: 1,
};

const barCodeOptions = {
    background: '#EBEBEB',
    width: 2,
    height: 118,
    font: 'inherit',
    fontSize: 16,
    lineColor: '#32545B',
    marginTop: 88,
    marginLeft: 27,
    marginRight: 27,
    marginBottom: 32,
};

function PDFError(): React.ReactNode {
    return (
        <div className="flex h-pdf w-pdf flex-col justify-center bg-[url('/iracing/poster-loading.png')] bg-cover text-gray700">
            <p className="mb-4 text-2xl font-semibold antialiased">“Box this lap!”</p>
            <p className="text-sm uppercase tracking-widest">Site error: PDF failed to load</p>
        </div>
    );
}

function PDFLoading(): React.ReactNode {
    return (
        <div className="flex h-pdf w-pdf flex-col justify-center bg-[url('/iracing/poster-loading.png')] bg-cover text-gray700">
            <p className="text-sm uppercase tracking-widest">PDF loading...</p>
        </div>
    );
}
