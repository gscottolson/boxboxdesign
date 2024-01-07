export default function Layout(props: {
    children: React.ReactNode
   }) {
    return (
      <div className="bg-white300 lg:p-12 relative">
        <div className="m-auto max-w-7xl flex-grow border-t-8 border-[#A7C3DD] bg-white300 teal800 drop-shadow-2xl ">
            detail view
  
          {props.children}
        </div>
      </div>
    );
  }
  