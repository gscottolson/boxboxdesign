'use client';

import { OfficialSeries } from '@/app/iracing/schedule-list';
import { Document, Page as PDFPage, Thumbnail } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import React, { useCallback, useState } from 'react';
import Balancer from 'react-wrap-balancer';
import { useBarcode } from 'next-barcode';
import { Download } from './icons';

const ratio = 4 / 3;
const pdfWidth = 480;
const pdfHeight = pdfWidth * ratio;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

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
    <div className="box-content flex h-full w-full border-[.5px] border-[rgba(90,90,90,0.15)]">
      <div className="h-pdf w-pdf flex shrink-0 grow-0 place-content-center bg-white100 text-center">
        <Document
          file={series.pdf}
          className="h-pdf w-pdf"
          loading={<PDFLoading />}
          noData={<PDFError />}
          error={<PDFError />}
        >
          <Thumbnail
            pageNumber={1}
            height={pdfHeight}
            width={pdfWidth}
            className="pointer-events-none cursor-default"
          />
        </Document>
      </div>

      <div className="flex basis-full flex-col justify-between px-6 text-teal800 antialiased">
        <header className="pt-16">
          <h3 className="font-semilight teal800 mb-2 pr-2 text-3xl tracking-tight">
            <Balancer>{series.name}</Balancer>
          </h3>
          <h4 className="text-l mb-1 font-medium uppercase leading-tight tracking-widest text-gray700">
            <Balancer>iRacing Official Series</Balancer>
          </h4>
          <h4 className="text-l font-medium uppercase leading-tight tracking-widest text-gray700">
            <Balancer>2024 Season 1</Balancer>
          </h4>
        </header>

        <div className="flex flex-col items-start">
          <span
            className="mb-8 inline-block overflow-hidden rounded-lg shadow-lg active:scale-95"
            // style={isError ? disabledDownload : enabledDownload}
          >
            <a
              href={series.pdf}
              target="__blank"
              rel="noopener"
              className={`inline-flex place-content-center px-6 py-3 ${downloadClass} text-center focus:ring-2  focus:ring-black  focus:ring-offset-4  focus:ring-offset-[#D6DDDF]`}
            >
              <span className="pr-4 font-medium uppercase text-white100">
                Download PDF
              </span>{' '}
              <Download />
            </a>
          </span>
          <div className="w-[256px] basis-[272px] self-stretch bg-white200">
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
    <div className="h-pdf w-pdf flex flex-col justify-center bg-[url('/iracing/poster-loading.png')] bg-cover text-gray700">
      <p className="mb-4 text-2xl font-semibold antialiased">“Box this lap!”</p>
      <p className="text-sm uppercase tracking-widest">
        Site error: PDF failed to load
      </p>
    </div>
  );
}

function PDFLoading(): React.ReactNode {
  return (
    <div className="h-pdf w-pdf flex flex-col justify-center bg-[url('/iracing/poster-loading.png')] bg-cover text-gray700">
      <p className="text-sm uppercase tracking-widest">PDF loading...</p>
    </div>
  );
}
