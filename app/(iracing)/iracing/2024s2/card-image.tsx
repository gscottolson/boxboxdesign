import { OfficialSeries } from '../types';
import Image from 'next/image';

export function CardImage({ series, priority }: { series: OfficialSeries; priority: boolean }): React.ReactNode {
    const size = 240;
    const { srcDark = '', srcLight = '' } = series;

    return (
        <>
            <Image
                className="hidden dark:block"
                alt={`stylized image of a schedule poster for ${series.name} on iRacing.com`}
                src={srcDark}
                width={size}
                height={size}
                // priority={priority}
            />
            <Image
                className="block dark:hidden"
                alt={`stylized image of a schedule poster for ${series.name} on iRacing.com`}
                src={srcLight}
                width={size}
                height={size}
                // priority={priority}
            />
        </>
    );
}
