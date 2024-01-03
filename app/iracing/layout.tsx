export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page-bg lg:p-12">
      <div className="flex-grow bg-page border-t-8 border-[#A7C3DD] max-w-7xl m-auto drop-shadow-2xl text-copy ">
        <header className="text-center text-title tracking-tighter subpixel-antialiased">
          <h1 className="font-bold text-4xl pt-12">iRacing Schedule Posters</h1>
          <h2 className="text-xl pt-0 p-4 text-copy tracking-wide">2024 Season 1</h2>
        </header>
        {children}
      </div>
    </div>
  );
}