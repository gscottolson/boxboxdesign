'use client';

import { Document, Page as PDFPage, Thumbnail } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import React, { useState } from 'react';
import Balancer from 'react-wrap-balancer';
import { useBarcode } from 'next-barcode';
import { Download } from './icons';
import { OfficialSeries } from '../types';
import { useTheme } from 'next-themes';

const pdfHeight = 640;

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

type LoadingState = 'initial' | 'loading' | 'success';

export function SeriesDetail({ series }: { series: OfficialSeries }) {
    const { theme } = useTheme();
    const [mode, setMode] = useState<LoadingState>('initial');
    const { inputRef } = useBarcode<HTMLImageElement>({
        value: ` ${series.seriesId?.substring(0, 4)} ` || '',
        options: barCodeOptions,
    });

    let downloadClass = '';
    switch (series.licenseClass) {
        case 'Rookie':
            downloadClass = 'text-[#DA0229] dark:text-[#FF7373]';
            break;
        case 'D':
            downloadClass = 'text-[#F77600] dark:text-[#FA9352]';
            break;
        case 'C':
            downloadClass = 'text-[#F3AF00] dark:text-[#FFE14D]';
            break;
        case 'B':
            downloadClass = 'text-[#019751] dark:text-[#80FF85]';
            break;
        case 'A':
        default:
            downloadClass = 'text-[#064ABD] dark:text-[#66B6FF]';
    }

    const handleLoadSuccess = () => setMode('success');

    return (
        <div className="font-semilight box-content flex w-full flex-col overflow-hidden md:flex-row md:border-[.5px] md:border-[rgba(90,90,90,0.15)] md:pt-0">
            <header className="text-lg mx-auto max-w-[320px] pb-4 pt-8 text-center leading-none tracking-wide text-teal800 antialiased md:hidden dark:text-gray-100">
                <h3 className="mb-1 pr-2 text-xl tracking-tight">
                    <Balancer>{series.name}</Balancer>
                </h3>
                <h4 className="text-gray700 dark:text-gray-300">---Official Series Schedule</h4>
                <h4 className="text-gray700 dark:text-gray-300">iRacing 2024 Season 3</h4>
            </header>

            <div className="dark:shadow-pdfFrameDark relative mx-auto flex h-[426.66px] w-[320px] grow place-content-center overflow-hidden rounded-sm text-center shadow-pdfFrame md:mx-0 md:h-full md:w-full md:bg-white100 dark:md:bg-[#222222]">
                <div style={{ opacity: mode === 'success' ? 1 : 0, transition: 'opacity 150ms ease-in' }}>
                    <Document
                        file={theme === 'dark' ? series.pdfDark : series.pdfLight}
                        className="absolute -left-[25%] -top-[25%] z-0 h-pdf w-pdf scale-[0.668] bg-gray-100 md:relative md:left-auto md:top-auto md:scale-100 dark:bg-gray-800"
                        loading={<PDFLoading />}
                        noData={<PDFError />}
                        error={<PDFError />}
                    >
                        <Thumbnail
                            pageNumber={1}
                            height={pdfHeight}
                            className="pointer-events-none cursor-default"
                            onRenderSuccess={handleLoadSuccess}
                        />
                    </Document>
                </div>
            </div>

            <div className="flex w-full shrink-0 flex-col justify-between px-6 text-teal800 antialiased md:w-[320px] dark:text-gray-100">
                <header className="hidden pt-8 text-xl leading-tight tracking-wide md:block">
                    <h3 className="mb-2 pr-2 text-3xl leading-9 tracking-tight">
                        <Balancer>{series.name}</Balancer>
                    </h3>
                    <h4 className="text-gray700 dark:text-gray-300">Official Series Schedule</h4>
                    <h4 className="text-gray700 dark:text-gray-300">iRacing 2024 Season 3</h4>
                </header>

                <div>
                    <div className="fixed bottom-0 left-0 mx-auto mb-8 flex w-full items-center justify-center gap-1 px-2 pt-4 text-sm md:static md:items-start md:justify-start md:p-0">
                        <span className="inline-block max-w-48 basis-1/2 overflow-hidden rounded-sm shadow-lg active:scale-95 md:max-w-max">
                            <a
                                href={series.pdfDark}
                                target="__blank"
                                rel="noopener"
                                //focus:ring-2 focus:ring-black focus:ring-offset-4 focus:ring-offset-[#D6DDDF]
                                className={`inline-flex w-full place-content-center items-center px-4 py-2 md:w-auto ${downloadClass} bg-white200 text-center dark:bg-neutral-600`}
                            >
                                <span className="pr-2 font-medium uppercase">PDF Dark</span> <Download />
                            </a>
                        </span>
                        <span className="inline-block max-w-48 basis-1/2 overflow-hidden rounded-sm shadow-lg active:scale-95 md:max-w-max">
                            <a
                                href={series.pdfLight}
                                target="__blank"
                                rel="noopener"
                                className={`inline-flex w-full place-content-center items-center px-4 py-2 ${downloadClass} bg-white100 text-center dark:bg-neutral-500`}
                            >
                                <span className="pr-2 font-medium uppercase">PDF Light</span> <Download />
                            </a>
                        </span>
                    </div>
                    <div className="hidden min-h-[256px] w-[256px] basis-[272px] self-stretch overflow-hidden rounded-tl-sm rounded-tr-sm bg-white200 md:block dark:bg-[#222222] dark:text-gray-400">
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
    background: 'transparent',
    width: 2,
    height: 118,
    font: 'inherit',
    fontSize: 16,
    lineColor: 'currentColor',
    marginTop: 88,
    marginLeft: 27,
    marginRight: 27,
    marginBottom: 32,
};

function PDFError(): React.ReactNode {
    return (
        // <div className="dar:bg-gray-900 flex h-pdf w-pdf flex-col justify-center bg-[url('/iracing/poster-loading.png')] bg-cover text-gray700">
        <div className="flex h-pdf w-pdf flex-col justify-center text-gray700 dark:bg-purple-500">
            <p className="mb-4 text-2xl font-semibold antialiased">“Box this lap!”</p>
            <p className="text-sm uppercase tracking-widest">Site error: PDF failed to load</p>
        </div>
    );
}

function PDFLoading(): React.ReactNode {
    return (
        // <div className="flex h-pdf w-pdf flex-col justify-center bg-[url('/iracing/poster-loading.png')] bg-cover text-gray700 dark:bg-gray-900">
        <div className="flex h-pdf w-pdf flex-col justify-center text-gray700">
            <p className="text-sm uppercase tracking-widest">PDF loading...</p>
        </div>
    );
}
