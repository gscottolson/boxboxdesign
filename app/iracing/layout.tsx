export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="to-white400 min-h-dvh bg-gradient-to-b from-white300">
      {props.children}
    </div>
  );
}
