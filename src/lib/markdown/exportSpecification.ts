import { specificationCatalogue } from '@/lib/mock-data/catalogue';
import { formatDate } from '@/lib/format/date';
import type { SpecificationDetail } from '@/lib/mock-data/schemas';

/**
 * Reprend le contenu affiché sur la page détail (brouillon s'il existe, sinon
 * contenu publié) : l'export reflète l'état de travail courant, pas seulement
 * la dernière version publiée.
 */
export function buildSpecificationMarkdown(specification: SpecificationDetail): string {
    const lines: string[] = [`# ${specification.name}`, ''];

    const publishedLine = specification.publishedAt
        ? ` · publié le ${formatDate(specification.publishedAt)}`
        : '';
    lines.push(
        `_Version ${specification.version} · créé le ${formatDate(specification.createdAt)}${publishedLine}_`,
        '',
    );

    for (const entry of specificationCatalogue) {
        const section = specification.sections.find((item) => item.slug === entry.slug);
        const content = section ? (section.draftContent ?? section.publishedContent) : '';
        const heading = entry.level === 'section' ? '##' : '###';

        lines.push(`${heading} ${entry.title}`, '', content, '');
    }

    return `${lines.join('\n').trimEnd()}\n`;
}

export function buildExportFileName(specification: SpecificationDetail): string {
    const slug = specification.name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${slug || 'cahier-des-charges'}.md`;
}
