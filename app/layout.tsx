import '@/app/ui/global.css';
import localFont from 'next/font/local'

const outfit = localFont({ src: '../public/Outfit-VariableFont_wght.ttf' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-page`}>{children}</body>
    </html>
  );
}
