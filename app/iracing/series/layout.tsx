import { getSiteTitle, getSiteTitleTemplate } from '@/app/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: getSiteTitleTemplate(),
    default: getSiteTitle(), // a default is required when creating a template
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return <div className="h-dvh">{props.children}</div>;
}
