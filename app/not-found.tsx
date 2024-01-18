import Link from 'next/link';
import Balancer from 'react-wrap-balancer';

export default function NotFound() {
    return (
        <div className="bgWhite400 flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-white400 text-blue800">
            <Logo404 />
            <p className="mt-16 px-8 text-center text-3xl font-light">
                <Balancer>The thing you were looking for isn’t here. Apologies.</Balancer>
            </p>
            <Link href="/" className="text-xl text-gray700">
                Head back to <span className="underline">BoxBoxDesign</span>
            </Link>
        </div>
    );
}

function Logo404() {
    return (
        <svg width="406" height="232" viewBox="0 0 406 232" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M199.557 175.902L105 121.309M183.044 185.579L105 140.521M166.404 195.183L105 159.732M149.769 204.79L105 178.943M133.136 214.398L105 198.154M116.5 224.005L105 217.365"
                stroke="#ADBABD"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M397.557 175.592L303 121M381.044 185.27L303 140.211M364.404 194.874L303 159.422M347.769 204.481L303 178.633M331.136 214.089L303 197.845M314.5 223.695L303 217.056"
                stroke="#ADBABD"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M102.812 220.94V120.392C102.812 118.01 104.083 115.809 106.146 114.618L189.245 66.6409"
                stroke="#809499"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.1 15"
            />
            <path
                d="M302.812 220.94V120.225C302.812 117.843 304.083 115.642 306.146 114.451L389.245 66.4742"
                stroke="#809499"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.1 15"
            />
            <path
                d="M16.3125 66.4742L92.8125 110.474"
                stroke="#809499"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.1 15"
            />
            <path
                d="M216.312 66.4742L292.812 110.474"
                stroke="#809499"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.1 15"
            />
            <path
                d="M202.812 68.2989V164.724M307.812 229.027L397.812 177.066C400.906 175.28 402.812 171.978 402.812 168.406V64.4827C402.812 60.9101 400.906 57.6088 397.812 55.8225L307.812 3.86099C304.718 2.07466 300.906 2.07467 297.812 3.86099L207.812 55.8225C204.718 57.6088 200.906 57.6088 197.812 55.8225L107.812 3.86099C104.718 2.07466 100.906 2.07467 97.8124 3.86099L7.8125 55.8225C4.71849 57.6088 2.8125 60.9101 2.8125 64.4827V168.406C2.8125 171.978 4.71849 175.28 7.8125 177.066L97.8124 229.027C100.906 230.814 104.718 230.814 107.812 229.027L197.812 177.066C200.906 175.28 204.718 175.28 207.812 177.066L297.812 229.027C300.906 230.814 304.718 230.814 307.812 229.027Z"
                stroke="#809499"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.1 15"
            />
        </svg>
    );
}
