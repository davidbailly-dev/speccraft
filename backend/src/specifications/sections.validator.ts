import { specTemplate } from './sections.catalogue';

export function isValidSlug(slug: string): boolean {
    return specTemplate.includes(slug);
}