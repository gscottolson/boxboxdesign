'use client';

import { useTheme } from 'next-themes';
import { OfficialSeries } from '../types';
import Image from 'next/image';

export function CardImage({ series, priority }: { series: OfficialSeries; priority: boolean }): React.ReactNode {
    const size = 240;
    const { srcDark = '', srcLight = '' } = series;
    const { theme } = useTheme();

    return (
        <div className="absolute left-0 top-0 w-full md:relative">
            <Image
                className="w-responsiveCard max-w-none md:w-card"
                alt={`stylized image of a schedule poster for ${series.name} on iRacing.com`}
                src={theme === 'dark' ? srcDark : srcLight}
                width={size}
                height={size}
                priority={priority}
            />
        </div>
    );
}
