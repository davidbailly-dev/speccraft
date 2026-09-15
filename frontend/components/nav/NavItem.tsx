export interface NavItemProps {
    label: string,
};

export default function NavItem({
    label = 'NonDéfini',
}: NavItemProps) {
    return (
        <a
            className='bg-blue-800 hover:bg-blue-600 text-white p-4 rounded-lg'
            href="#">
            {label}
        </a>
    );
}
