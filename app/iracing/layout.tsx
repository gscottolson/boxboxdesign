export default function Layout(props: { children: React.ReactNode }) {
  const fromTo = 'from-white200 to-white400'; // maintaining order, which Prettier tried to destroy
  return (
    <div className={`min-h-dvh bg-gradient-to-b ${fromTo}`}>
      {props.children}
    </div>
  );
}
