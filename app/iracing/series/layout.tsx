export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="h-dvh bg-white300">{props.children}</div>
  );
}
