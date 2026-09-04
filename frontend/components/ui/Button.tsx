interface ButtonProps {
    label: string,
    type: 'button' | 'submit' | 'reset' | undefined,
}

export default function Button({
    label = 'non défini',
    type = 'button'
}: ButtonProps) {
    return (
        <button
            type={type}
            className="bg-blue-700 hover:bg-blue-500 rounded-lg p-2 cursor-pointer"
        >
            {label}
        </button>
    )
}