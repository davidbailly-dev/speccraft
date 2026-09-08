import Navigation from "@/components/nav/Navigation";

const navItems = [
    {
        key: 1,
        label: 'Créer un nouveau cahier des charges'
    },
    {
        key: 2,
        label: 'Se déconnecter'
    },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
    return (
        <div className="grid grid-cols-2 p-4">
            <Navigation
                items={navItems}
            />
            <span>{children}</span>
        </div>
    );
}