import Navigation from "@/components/nav/Navigation";
import LogoutButton from "@/components/ui/LogoutButton";

const navItems = [
    {
        label: 'Lien test 1'
    },
    {
        label: 'Lien test 2'
    },
    {
        label: 'Lien test 3'
    },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
    return (
        <main className="flex gap-4 h-full">
            <aside className="flex flex-col w-1/4 h-full bg-stone-800">
                <nav>
                    <Navigation
                        items={navItems}
                    />
                </nav>
                <LogoutButton className="mt-auto" />
            </aside>
            <div className="h-full grow p-4 bg-stone-500">{children}</div>
        </main>
    );
}
