interface InputProps {
    name: string,
    placeholder: string,
    type: string,
}

export default function Input({
    name = '',
    placeholder = '',
    type = 'submit',
}: InputProps) {
    return (
        <input
            className="border border-blue-700 focus:outline-none focus:border-blue-400 p-2 rounded-lg"
            type={type}
            name={name}
            placeholder={placeholder}
        />
    );
}