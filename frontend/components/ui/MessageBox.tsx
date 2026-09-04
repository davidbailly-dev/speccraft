interface MessageBoxProps {
    className: string,
    message: string,
    type: 'neutral' | 'success' | 'warning' | 'error';
}

export default function MessageBox({
    className = '',
    message = '',
    type = 'success'
}: MessageBoxProps) {
    const neutralCN = 'bg-transparent';
    const successCN = 'bg-emerald-700';
    const warningCN = 'bg-orange-700';
    const errorCN = 'bg-red-700'

    let selectedCN = neutralCN;

    switch (type) {
        case 'neutral':
            selectedCN = neutralCN;
            break;
        case 'success':
            selectedCN = successCN;
            break;
        case 'warning':
            selectedCN = warningCN;
            break;
        case 'error':
            selectedCN = errorCN;
            break;
        default:
            selectedCN = neutralCN;
    }

    return (
        <div className={`rounded-lg p-4 ${className} ${selectedCN}`}>{message}</div>
    );
}