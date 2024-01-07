import styles from '@/app/ui/home.module.css';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './ui/logo';

export default function Page() {
  return (
    <main className="flex h-vh w-vw flex-col p-6 bg-white200">
        <Logo width={200} height="auto" />
        <Link href="/iracing/2024s1/road/">Road</Link>
    </main>
  );
}
