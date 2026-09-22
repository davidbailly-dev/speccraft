'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSpecification } from '@/lib/queries/useSpecification';
import { specificationCatalogue, type SectionCatalogueEntry } from '@/lib/mock-data/catalogue';
import { formatDate } from '@/lib/format/date';
import type { Section } from '@/lib/mock-data/schemas';

function SectionBlock({ entry, section }: { entry: SectionCatalogueEntry; section: Section | undefined }) {
    // Section absente du cahier des charges (catalogue étendu après sa création) : s'affiche vide, sans erreur.
    const content = section ? (section.draftContent ?? section.publishedContent) : '';
    const hasPendingDraft = section?.draftContent != null;
    const HeadingTag = entry.level === 'section' ? 'h2' : 'h3';

    return (
        <div className={entry.level === 'subsection' ? 'pl-5' : ''}>
            <div className="flex items-center gap-2">
                <HeadingTag className={entry.level === 'section' ? 'text-lg font-semibold' : 'text-base font-medium'}>
                    {entry.title}
                </HeadingTag>
                {hasPendingDraft && (
                    <span className="rounded-full bg-warning-surface px-2 py-0.5 text-xs font-medium text-warning">
                        Brouillon
                    </span>
                )}
            </div>
            <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">
                {content || <span className="italic text-muted">Section vide.</span>}
            </p>
        </div>
    );
}

export function SpecificationDetail({ id }: { id: string }) {
    const { data: specification, isLoading, isError } = useSpecification(id);

    return (
        <div className="flex flex-col gap-8">
            <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
                <ArrowLeft size={16} />
                Retour à la liste
            </Link>

            {isLoading && <p className="text-sm text-muted">Chargement…</p>}
            {isError && <p className="text-sm text-warning">Cahier des charges introuvable.</p>}

            {specification && (
                <>
                    <header className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">{specification.name}</h1>
                        <p className="text-sm text-muted">
                            v{specification.version} · créé le {formatDate(specification.createdAt)}
                            {specification.publishedAt &&
                                ` · publié le ${formatDate(specification.publishedAt)}`}
                        </p>
                    </header>

                    <div className="flex flex-col gap-6">
                        {specificationCatalogue.map((entry) => {
                            const section = specification.sections.find((item) => item.slug === entry.slug);
                            return <SectionBlock key={entry.slug} entry={entry} section={section} />;
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
