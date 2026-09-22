export type SectionLevel = 'section' | 'subsection';

export type SectionCatalogueEntry = {
    slug: string;
    title: string;
    level: SectionLevel;
    parentSlug: string | null;
    order: number;
};

/**
 * Structure fixe d'un cahier des charges, reprise de speccraft-old
 * (docs/project/template.md) : le slug est la clé stable, l'ordre d'affichage
 * est piloté par `order` (position dans ce catalogue), pas par l'ordre
 * d'insertion en base. Une section absente d'un cahier des charges existant
 * s'affiche vide, sans erreur.
 */
export const specificationCatalogue: SectionCatalogueEntry[] = [
    { slug: 'contexte-objectifs', title: 'Contexte & objectifs', level: 'section', parentSlug: null, order: 1 },
    { slug: 'contexte', title: 'Contexte', level: 'subsection', parentSlug: 'contexte-objectifs', order: 2 },
    { slug: 'objectif', title: 'Objectif', level: 'subsection', parentSlug: 'contexte-objectifs', order: 3 },
    { slug: 'perimetre', title: 'Périmètre', level: 'section', parentSlug: null, order: 4 },
    { slug: 'hypotheses', title: 'Hypothèses', level: 'subsection', parentSlug: 'perimetre', order: 5 },
    { slug: 'inclus', title: 'Inclus', level: 'subsection', parentSlug: 'perimetre', order: 6 },
    { slug: 'exclu', title: 'Exclu', level: 'subsection', parentSlug: 'perimetre', order: 7 },
    { slug: 'besoins-fonctionnels', title: 'Besoins fonctionnels', level: 'section', parentSlug: null, order: 8 },
    { slug: 'priorite-haute', title: 'Priorité haute', level: 'subsection', parentSlug: 'besoins-fonctionnels', order: 9 },
    { slug: 'priorite-moyenne', title: 'Priorité moyenne', level: 'subsection', parentSlug: 'besoins-fonctionnels', order: 10 },
    { slug: 'priorite-basse', title: 'Priorité basse', level: 'subsection', parentSlug: 'besoins-fonctionnels', order: 11 },
    { slug: 'besoins-non-fonctionnels', title: 'Besoins non fonctionnels', level: 'section', parentSlug: null, order: 12 },
    { slug: 'contraintes-dependances', title: 'Contraintes & dépendances', level: 'section', parentSlug: null, order: 13 },
    { slug: 'parcours-utilisateur', title: 'Parcours utilisateur', level: 'section', parentSlug: null, order: 14 },
    { slug: 'architecture-technique', title: 'Architecture & aspects techniques', level: 'section', parentSlug: null, order: 15 },
    { slug: 'livrables-validation', title: 'Livrables & validation', level: 'section', parentSlug: null, order: 16 },
    { slug: 'planning-suivi', title: 'Planning & suivi', level: 'section', parentSlug: null, order: 17 },
    { slug: 'annexes', title: 'Annexes', level: 'section', parentSlug: null, order: 18 },
];
