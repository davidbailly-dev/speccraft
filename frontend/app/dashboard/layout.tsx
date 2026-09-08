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
        <main className="grid grid-cols-2 p-4">
            <nav>
                <Navigation
                    items={navItems}
                />
                <LogoutButton />
            </nav>
            <div>{children}</div>
        </main>
    );
}
