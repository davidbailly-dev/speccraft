'use client';

interface ButtonProps {
    className?: string,
    type: 'button' | 'submit' | 'reset' | undefined,
    disabled?: boolean,
    children: React.ReactNode,
    onClick?: () => void,
}

export default function Button({
    className = '',
    type = 'button',
    disabled = false,
    children,
    onClick
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`bg-blue-800 hover:bg-blue-600 rounded-lg p-2 cursor-pointer ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}