import styles from '@/app/ui/home.module.css';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../ui/logo';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-page">
      <div className="roundedLg flex h-full shrink-0 grow content-center justify-center p-4">
        <Logo width={200} height="auto" />
      </div>
    </main>
  );
}
