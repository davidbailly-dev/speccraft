import NavItem from "./NavItem";
import type { NavItemProps } from "./NavItem";

interface NavigationProps {
    items: NavItemProps[],
}

export default function Navigation({
    items = []
}: NavigationProps) {
    return (
        <nav className='flex flex-col gap-4'>
            {items.map((item) => (
                <NavItem
                    key={item.key}
                    label={item.label}
                />
            ))}
        </nav>
    );
}