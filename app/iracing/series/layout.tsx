import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | iRacing 2024S1 Schedule Posters',
    default: 'iRacing 2024S1 Schedule Posters', // a default is required when creating a template
  },
}

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="h-dvh">{props.children}</div>
  );
}
