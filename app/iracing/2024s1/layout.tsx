export default function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
 }) {
  return (
    <div className="bg-page-bg lg:p-12 relative">
      <div className="m-auto max-w-7xl flex-grow border-t-8 border-[#A7C3DD] bg-page text-copy drop-shadow-2xl ">
        <header className="text-title text-center tracking-tighter subpixel-antialiased">
          <h1 className="pt-12 text-4xl font-bold">Official Series Schedule Posters</h1>
          <h2 className="p-4 pt-0 text-xl tracking-wide text-copy">
            iRacing 2024 Season 1
          </h2>
        </header>

        {props.children}
      </div>

      {props.modal}
    </div>
  );
}
