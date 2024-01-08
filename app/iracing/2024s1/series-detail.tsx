'use client';

import { getRoadSeriesById } from '@/app/iracing/schedule-list';
import { Document, Page as PDFPage, Thumbnail } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import React, { useCallback, useState } from 'react';
import Balancer from 'react-wrap-balancer';
import { useBarcode } from 'next-barcode';
import { Download } from './icons';

type DocumentState = 'loading' | 'success' | 'error'

const ratio = 4 / 3;
const pdfWidth = 480;
const pdfHeight = pdfWidth * ratio;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export function SeriesDetail(props: { seriesId: string }) {
  const series = getRoadSeriesById(props.seriesId);
  const [documentState, setDocumentState] = useState<DocumentState>('loading');

  const { inputRef } = useBarcode<HTMLImageElement>({value: ` ${series.seriesId} ` || '',options: barCodeOptions});

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

  const handleError = useCallback(() => setDocumentState('error'), []);
  const handleSuccess = useCallback(() => setDocumentState('success'), []);

  const isError = documentState === 'error';

  return (
      <div className="flex h-full w-full">
        <div className="flex shrink-0 basis-[480px] flex-col place-content-center bg-white100 text-center">
          {!isError && (
            <div style={{ opacity: documentState === 'loading' ? 0.01 : 1 }}>
              <Document
                file={series.pdf}
                // className="h-[640px] w-[480px]"
                onLoadError={handleError}
                onLoadSuccess={handleSuccess}
              >
                <Thumbnail
                  pageNumber={1}
                  height={pdfHeight}
                  className="block"
                />
              </Document>
            </div>
          )}

          {isError && (
            <div>
              <p className="text-2xl mb-4 font-semibold antialiased">“Box this lap!”</p>
              <p className="text-sm uppercase tracking-widest">PDF failed to load</p>
            </div>
          )}
        </div>

        <div className="flex basis-full flex-col justify-between px-6 text-teal800 antialiased">
          <header className="pt-16">
            <h3 className="font-semilight teal800 mb-2 text-3xl tracking-tight">
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
              className="mb-8 inline-block drop-shadow-md"
              style={isError ? disabledDownload : enabledDownload}
            >
              <a
                href={series.pdf}
                target="__blank"
                rel="noopener"
                className={`inline-flex place-content-center px-6 py-3 ${downloadClass} rounded-lg text-center focus:ring-2  focus:ring-black  focus:ring-offset-4  focus:ring-offset-[#D6DDDF]`}
              >
                <span className="font-medium uppercase text-white100 pr-4">Download PDF</span> <Download />
              </a>
            </span>
            <div className="basis-full bg-white200 self-stretch">
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
  transition: 'opacity 200ms ease-out, filter 200ms ease-out',
};

const enabledDownload: React.CSSProperties = {
  pointerEvents: 'auto',
  filter: 'none',
  opacity: 1,
  transition: 'opacity 200ms ease-out, filter 200ms ease-out',
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
}