import Link from 'next/link';

export default function Nav({active}: {active: string}) {
  return (
        <ul className="flex w-full justify-center align-middle pt-4 pb-12 gap-8">
            <li key="road" className="text-copy" style={{textDecoration: active === 'road' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/road">Road</Link>
            </li>
            <li key="oval" className="text-copy" style={{textDecoration: active === 'oval' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/oval">Oval</Link>
            </li>
            <li key="dirtoval" className="text-copy" style={{textDecoration: active === 'dirtoval' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/dirtoval" className="">Dirt Oval</Link>
            </li>
            <li key="dirtroad" className="text-copy" style={{textDecoration: active === 'dirtroad' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/dirtroad">Dirt Road</Link>
            </li>
        </ul>
  );
}
{/* <div style={{backgroundColor: 'red', width}} className="h-1 absolute bottom-0 left-0" /> */}
