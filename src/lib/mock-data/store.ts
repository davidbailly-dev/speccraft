import { generateDataset } from './generator';
import { specificationCatalogue } from './catalogue';
import type { Dataset, Section, Specification, SpecificationDetail } from './schemas';

let dataset: Dataset | null = null;

/**
 * Génère le jeu de données mockées une seule fois par démarrage de serveur
 * (voir src/instrumentation.ts) puis le sert depuis la mémoire, pour que toutes
 * les requêtes mockées lisent le même état plutôt que des données régénérées
 * à chaque appel.
 */
export function getDataset(): Dataset {
    if (!dataset) {
        dataset = generateDataset();
    }
    return dataset;
}

/**
 * Crée un cahier des charges vierge : une section par slug du catalogue,
 * sans contenu publié ni brouillon (rien n'a encore été modifié).
 */
export function createSpecification(name: string): SpecificationDetail {
    const data = getDataset();
    const now = new Date().toISOString();

    const specification: Specification = {
        id: crypto.randomUUID(),
        name,
        version: 0,
        createdAt: now,
        publishedAt: null,
    };

    const sections: Section[] = specificationCatalogue.map((entry) => ({
        id: crypto.randomUUID(),
        specificationId: specification.id,
        slug: entry.slug,
        publishedContent: '',
        draftContent: null,
        updatedAt: now,
    }));

    data.specifications.push(specification);
    data.sections.push(...sections);

    return { ...specification, sections };
}

/**
 * Supprime un cahier des charges et ses sections. Retourne `false` si l'id est inconnu.
 */
export function deleteSpecification(id: string): boolean {
    const data = getDataset();
    const index = data.specifications.findIndex((specification) => specification.id === id);
    if (index === -1) return false;

    data.specifications.splice(index, 1);
    data.sections = data.sections.filter((section) => section.specificationId !== id);
    return true;
}

/**
 * Enregistre le contenu édité d'une section comme brouillon (`draftContent`),
 * sans toucher au contenu publié : reste un brouillon jusqu'à publication.
 * Retourne `null` si le cahier des charges ou le slug est inconnu.
 */
export function saveDraftSection(specificationId: string, slug: string, content: string): Section | null {
    const data = getDataset();
    const section = data.sections.find(
        (item) => item.specificationId === specificationId && item.slug === slug,
    );
    if (!section) return null;

    section.draftContent = content;
    section.updatedAt = new Date().toISOString();
    return section;
}
