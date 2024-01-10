export default function Layout(props: { children: React.ReactNode }) {
  const fromTo = 'from-white200 to-white400'; // maintaining order, which Prettier tried to destroy
  //bg-gradient-to-b ${fromTo} bg-fixed
  return (
    <div className={`bg-siteGradient min-h-dvh bg-[#BDCDD2] bg-repeat-x`}>
      {props.children}
    </div>
  );
}
