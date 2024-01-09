import styles from '@/app/ui/home.module.css';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './ui/logo';
import { getDisciplineURL } from './iracing/schedule-list';

export default function Page() {
  return (
    <main className="h-vh w-vw flex flex-col bg-white200 p-6">
      <Logo width={200} height="auto" />
      <Link href={getDisciplineURL('Road')}>Road</Link>
    </main>
  );
}
