import { faker } from '@faker-js/faker';
import { specificationCatalogue } from './catalogue';
import type { Dataset, Section, Specification } from './schemas';

const SEED = 424242;
const SPECIFICATION_COUNT = 8;

// Sur les SPECIFICATION_COUNT cahiers des charges générés : les premiers ne sont
// jamais publiés (toutes leurs sections sont en brouillon, `publishedContent` vide),
// les suivants sont publiés avec quelques brouillons en attente (montre le badge
// « brouillon »), le reste est publié « propre » (aucun brouillon en attente).
const NEVER_PUBLISHED_COUNT = 2;
const PUBLISHED_WITH_DRAFTS_COUNT = 2;

// Noms de projets logiciels plausibles plutôt que du texte Faker générique,
// pour que la liste des cahiers des charges ressemble à un vrai backlog.
const PROJECT_NAMES = [
    'Refonte du portail client',
    'Migration vers Kubernetes',
    'Application mobile de covoiturage',
    'Plateforme de gestion des stocks',
    'Portail RH self-service',
    'Outil de facturation automatisée',
    'Refonte du site vitrine',
    'API de paiement multi-devises',
    'Tableau de bord analytique interne',
    'Application de suivi logistique',
    'Espace client B2B',
    'Système de réservation en ligne',
];

function generateSectionContent(level: 'section' | 'subsection'): string {
    const paragraphCount = level === 'subsection' ? 1 : faker.number.int({ min: 1, max: 2 });
    return faker.lorem.paragraphs(paragraphCount, '\n\n');
}

function buildSections(
    specificationId: string,
    isPublished: boolean,
    hasPendingDrafts: boolean,
    createdAt: Date,
    now: Date,
): Section[] {
    const draftSlugs = hasPendingDrafts
        ? faker.helpers.arrayElements(
              specificationCatalogue.map((entry) => entry.slug),
              { min: 2, max: 3 },
          )
        : [];

    return specificationCatalogue.map((entry) => {
        // Jamais publié : tout est encore en brouillon (rien à afficher côté publié).
        const isDraft = !isPublished || draftSlugs.includes(entry.slug);

        return {
            id: faker.string.uuid(),
            specificationId,
            slug: entry.slug,
            publishedContent: isPublished ? generateSectionContent(entry.level) : '',
            draftContent: isDraft ? generateSectionContent(entry.level) : null,
            updatedAt: faker.date.between({ from: createdAt, to: now }).toISOString(),
        };
    });
}

export function generateDataset(now: Date = new Date()): Dataset {
    faker.seed(SEED);

    const names = faker.helpers.arrayElements(PROJECT_NAMES, SPECIFICATION_COUNT);

    const specifications: Specification[] = [];
    const sections: Section[] = [];

    names.forEach((name, index) => {
        const id = faker.string.uuid();
        const isNeverPublished = index < NEVER_PUBLISHED_COUNT;
        const isPublished = !isNeverPublished;
        const hasPendingDrafts =
            isPublished && index < NEVER_PUBLISHED_COUNT + PUBLISHED_WITH_DRAFTS_COUNT;

        const createdAt = faker.date.past({ years: 1, refDate: now });
        const publishedAt = isPublished ? faker.date.between({ from: createdAt, to: now }) : null;
        const version = isPublished ? faker.number.int({ min: 1, max: 3 }) : 0;

        specifications.push({
            id,
            name,
            version,
            createdAt: createdAt.toISOString(),
            publishedAt: publishedAt ? publishedAt.toISOString() : null,
        });

        sections.push(...buildSections(id, isPublished, hasPendingDrafts, createdAt, now));
    });

    return { specifications, sections };
}
