export type SectionLevel = 'section' | 'subsection';

// Format de rédaction attendu pour le contenu généré par IA (cf. src/lib/ai/gemini.ts) :
// un choix explicite par section plutôt que laissé à l'appréciation du modèle à chaque appel,
// pour un résultat cohérent d'une génération à l'autre.
export type SectionContentFormat = 'paragraph' | 'list';

export type SectionCatalogueEntry = {
    slug: string;
    title: string;
    level: SectionLevel;
    parentSlug: string | null;
    order: number;
    contentFormat: SectionContentFormat;
};

/**
 * Structure fixe d'un cahier des charges, reprise de speccraft-old
 * (docs/project/template.md) : le slug est la clé stable, l'ordre d'affichage
 * est piloté par `order` (position dans ce catalogue), pas par l'ordre
 * d'insertion en base. Une section absente d'un cahier des charges existant
 * s'affiche vide, sans erreur.
 */
export const specificationCatalogue: SectionCatalogueEntry[] = [
    { slug: 'contexte-objectifs', title: 'Contexte & objectifs', level: 'section', parentSlug: null, order: 1, contentFormat: 'paragraph' },
    { slug: 'contexte', title: 'Contexte', level: 'subsection', parentSlug: 'contexte-objectifs', order: 2, contentFormat: 'paragraph' },
    { slug: 'objectif', title: 'Objectif', level: 'subsection', parentSlug: 'contexte-objectifs', order: 3, contentFormat: 'paragraph' },
    { slug: 'perimetre', title: 'Périmètre', level: 'section', parentSlug: null, order: 4, contentFormat: 'paragraph' },
    { slug: 'hypotheses', title: 'Hypothèses', level: 'subsection', parentSlug: 'perimetre', order: 5, contentFormat: 'list' },
    { slug: 'inclus', title: 'Inclus', level: 'subsection', parentSlug: 'perimetre', order: 6, contentFormat: 'list' },
    { slug: 'exclu', title: 'Exclu', level: 'subsection', parentSlug: 'perimetre', order: 7, contentFormat: 'list' },
    { slug: 'besoins-fonctionnels', title: 'Besoins fonctionnels', level: 'section', parentSlug: null, order: 8, contentFormat: 'paragraph' },
    { slug: 'priorite-haute', title: 'Priorité haute', level: 'subsection', parentSlug: 'besoins-fonctionnels', order: 9, contentFormat: 'list' },
    { slug: 'priorite-moyenne', title: 'Priorité moyenne', level: 'subsection', parentSlug: 'besoins-fonctionnels', order: 10, contentFormat: 'list' },
    { slug: 'priorite-basse', title: 'Priorité basse', level: 'subsection', parentSlug: 'besoins-fonctionnels', order: 11, contentFormat: 'list' },
    { slug: 'besoins-non-fonctionnels', title: 'Besoins non fonctionnels', level: 'section', parentSlug: null, order: 12, contentFormat: 'list' },
    { slug: 'contraintes-dependances', title: 'Contraintes & dépendances', level: 'section', parentSlug: null, order: 13, contentFormat: 'list' },
    { slug: 'parcours-utilisateur', title: 'Parcours utilisateur', level: 'section', parentSlug: null, order: 14, contentFormat: 'paragraph' },
    { slug: 'architecture-technique', title: 'Architecture & aspects techniques', level: 'section', parentSlug: null, order: 15, contentFormat: 'list' },
    { slug: 'livrables-validation', title: 'Livrables & validation', level: 'section', parentSlug: null, order: 16, contentFormat: 'list' },
    { slug: 'planning-suivi', title: 'Planning & suivi', level: 'section', parentSlug: null, order: 17, contentFormat: 'list' },
    { slug: 'annexes', title: 'Annexes', level: 'section', parentSlug: null, order: 18, contentFormat: 'list' },
];
