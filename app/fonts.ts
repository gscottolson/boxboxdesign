import localFont from 'next/font/local';
import { Nunito_Sans } from 'next/font/google';

export const openSans = localFont({ src: '../public/OpenSans_Condensed-SemiBold.ttf' });
export const outfit = localFont({ src: '../public/Outfit-VariableFont_wght.ttf' });

/** 2025/2026 schedule browser (`SeriesClient`): full UI vs body Outfit. */
export const nunitoSans = Nunito_Sans({
    subsets: ['latin'],
    display: 'swap',
});
