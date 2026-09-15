import NavItem from "./NavItem";
import type { NavItemProps } from "./NavItem";

interface NavigationProps {
    items: NavItemProps[],
}

export default function Navigation({
    items = []
}: NavigationProps) {
    return (
        <div className='flex flex-col gap-4'>
            {items.map((item, key) => (
                <NavItem
                    key={key}
                    label={item.label}
                />
            ))}
        </div>
    );
}
