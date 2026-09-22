export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40 sm:p-5">
            {children}
        </div>
    );
}
