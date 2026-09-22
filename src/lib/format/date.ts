const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });

export function formatDate(iso: string): string {
    return dateFormatter.format(new Date(iso));
}
