export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-white300 to-white400">{props.children}</div>
  );
}
