'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { OfficialSeries } from '../types';
import Image from 'next/image';

export function CardImage({ series, priority }: { series: OfficialSeries; priority: boolean }): React.ReactNode {
    const size = 240;
    const { srcDark = '', srcLight = '' } = series;
    const { theme } = useTheme();

    const [imgSrc, setImgSrc] = React.useState(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/knWYoAAAAAASUVORK5CYII=',
    );

    React.useLayoutEffect(() => {
        switch (theme) {
            case 'dark':
                setImgSrc(srcDark);
                break;
            case 'light':
                setImgSrc(srcLight);
                break;
        }
    }, [theme, srcDark, srcLight]);

    return (
        <div className="absolute left-0 top-0 w-full md:relative">
            <Image
                className="w-responsiveCard max-w-none bg-[#BAB8B6] md:h-[120px] md:w-card dark:bg-[#474440]"
                alt={`stylized image of a schedule poster for ${series.name} on iRacing.com`}
                src={imgSrc}
                width={size}
                height={size / 2}
                priority={priority}
            />
        </div>
    );
}
