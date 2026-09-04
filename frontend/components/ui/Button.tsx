interface ButtonProps {
    type: 'button' | 'submit' | 'reset' | undefined,
    disabled?: boolean,
    children: React.ReactNode,
}

export default function Button({
    type = 'button',
    disabled = false,
    children
}: ButtonProps) {
    return (
        <button
            type={type}
            className="bg-blue-700 hover:bg-blue-500 rounded-lg p-2 cursor-pointer"
            disabled={disabled}
        >
            {children}
        </button>
    )
}