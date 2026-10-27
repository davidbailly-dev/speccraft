import {
    BoxSelect,
    CalendarClock,
    Gauge,
    Link2,
    ListChecks,
    Network,
    PackageCheck,
    Paperclip,
    Route,
    Target,
    type LucideIcon,
} from 'lucide-react';

// Icônes purement décoratives, propres à l'affichage : volontairement hors du catalogue
// (src/lib/mock-data/catalogue.ts), qui alimente aussi l'export Markdown et les prompts IA.
// Indexées par slug (clé stable) ; une section sans entrée s'affiche simplement sans icône.
const sectionIconsBySlug: Record<string, LucideIcon> = {
    'contexte-objectifs': Target,
    perimetre: BoxSelect,
    'besoins-fonctionnels': ListChecks,
    'besoins-non-fonctionnels': Gauge,
    'contraintes-dependances': Link2,
    'parcours-utilisateur': Route,
    'architecture-technique': Network,
    'livrables-validation': PackageCheck,
    'planning-suivi': CalendarClock,
    annexes: Paperclip,
};

export function SectionIcon({ slug }: { slug: string }) {
    const Icon = sectionIconsBySlug[slug];
    if (!Icon) return null;

    return <Icon size={20} className="shrink-0 text-accent" aria-hidden="true" />;
}
