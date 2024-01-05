export default function Grid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
          {children}
        </div>
    );
  }