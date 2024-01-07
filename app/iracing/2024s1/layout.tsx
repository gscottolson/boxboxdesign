export default function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
 }) {
  return (
    <div className="lg:p-12 relative">
      <div className="m-auto max-w-7xl flex-grow border-t-8 border-[#A7C3DD] bg-white200 drop-shadow-2xl ">
        <header className="text-center tracking-tighter text-gray700">
          <h1 className="pt-12 text-4xl  font-light antialiased">Official Series Schedule Posters</h1>
          <h2 className="p-4 pt-0 text-xl font-medium tracking-wide">
            iRacing 2024 Season 1
          </h2>
        </header>

        {props.children}
      </div>

      {props.modal}
    </div>
  );
}


