import fs from 'node:fs';
import path from 'node:path';
import { specTemplate } from './sections.catalogue';
import { isValidSlug } from './sections.validator';

describe('Vérifie si les sections du catalogue correspondent à template.md qui est la source de vérité', () => {
    const slugLines = templateSlugSections();

    it('Les sections correspondent', () => {
        expect(slugLines).toEqual(specTemplate);
    });
});

describe('Vérifie les slugs inexistants dans le catalogue', () => {
    const invalidSlugs = ['fake-slug'];

    it.each(invalidSlugs)('slug inexistant %s', (slug) => {
        expect(isValidSlug(slug)).toBe(false);
    });
});

// Lit le fichier template.md et retourne un tableau des slugs de section trouvés
function templateSlugSections() {
    const fileContent = fs.readFileSync(path.join(__dirname, '../../../', 'docs/project/template.md'), 'utf8');
    const splitContent = fileContent.split('\n');
    const indexCondition = (element: string) => element === '|---|---|---|---|';
    const startFromIndex = splitContent.findIndex(indexCondition);
    const slicedContent = splitContent.slice(startFromIndex);

    const slugLines: string[] = [];

    slicedContent.forEach((line) => {
        if (line.includes('`')) {
            const slugLine: string[] = line.split('`'); 
            slugLines.push(slugLine[1]);
        }
    })

    return slugLines;
}