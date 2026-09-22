import Link from 'next/link';
import { NotebookPen } from 'lucide-react';

export function Header() {
    return (
        <header className="border-b border-border">
            <div className="mx-auto flex w-full max-w-3xl items-center px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
                    <NotebookPen size={22} className="text-accent" />
                    SpecCraft
                </Link>
            </div>
        </header>
    );
}
