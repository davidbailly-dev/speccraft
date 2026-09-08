export interface NavItemProps {
    key: number,
    label: string,
};

export default function NavItem({
    label = 'NonDéfini'
}: NavItemProps) {
    return (
        <a
            className='bg-blue-700 text-white p-4 rounded-lg'
            href="#">
            {label}
        </a>
    );
}