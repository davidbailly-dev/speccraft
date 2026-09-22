'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSpecification } from '@/lib/queries/useSpecification';
import { useSaveDraftSection } from '@/lib/queries/useSaveDraftSection';
import { usePublishSpecification } from '@/lib/queries/usePublishSpecification';
import { ExportMarkdownButton } from './ExportMarkdownButton';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { specificationCatalogue, type SectionCatalogueEntry } from '@/lib/mock-data/catalogue';
import { formatDate } from '@/lib/format/date';
import type { Section } from '@/lib/mock-data/schemas';

// Contenu affiché : le brouillon s'il existe, sinon le contenu publié.
function baselineContent(section: Section | undefined): string {
    if (!section) return '';
    return section.draftContent ?? section.publishedContent;
}

type SectionStatus = 'unsaved' | 'draft' | null;

function SectionStatusBadge({ status }: { status: SectionStatus }) {
    if (status === 'unsaved') {
        return (
            <span className="rounded-full bg-warning-surface px-2 py-0.5 text-xs font-medium text-warning">
                Non enregistré
            </span>
        );
    }

    if (status === 'draft') {
        return (
            <span className="rounded-full bg-warning-surface px-2 py-0.5 text-xs font-medium text-warning">
                Brouillon
            </span>
        );
    }

    return null;
}

function SectionEditor({
    entry,
    status,
    value,
    onChange,
}: {
    entry: SectionCatalogueEntry;
    status: SectionStatus;
    value: string;
    onChange: (value: string) => void;
}) {
    const HeadingTag = entry.level === 'section' ? 'h2' : 'h3';

    return (
        <div className={entry.level === 'subsection' ? 'pl-5' : ''}>
            <Card>
                <div className="flex items-center gap-2">
                    <HeadingTag className={entry.level === 'section' ? 'text-lg font-semibold' : 'text-base font-medium'}>
                        {entry.title}
                    </HeadingTag>
                    <SectionStatusBadge status={status} />
                </div>
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows={entry.level === 'section' ? 4 : 3}
                    placeholder="Section vide."
                    className="w-full resize-y rounded-lg border border-border bg-transparent p-3 text-sm outline-none focus:border-accent"
                />
            </Card>
        </div>
    );
}

export function SpecificationDetail({ id }: { id: string }) {
    const { data: specification, isLoading, isError } = useSpecification(id);
    const [edits, setEdits] = useState<Record<string, string>>({});
    const { mutateAsync: saveDraftSection, isPending: isSaving } = useSaveDraftSection();
    const { mutateAsync: publishSpecification, isPending: isPublishing } = usePublishSpecification();

    const sectionsBySlug = new Map(specification?.sections.map((section) => [section.slug, section]));

    const dirtySlugs = specification
        ? specificationCatalogue
              .map((entry) => entry.slug)
              .filter((slug) => edits[slug] !== undefined && edits[slug] !== baselineContent(sectionsBySlug.get(slug)))
        : [];

    const hasPendingDraftsOnServer =
        specification?.sections.some((section) => section.draftContent !== null) ?? false;
    const canPublish = hasPendingDraftsOnServer || dirtySlugs.length > 0;

    async function handleSave() {
        if (!specification || dirtySlugs.length === 0) return;
        await Promise.all(
            dirtySlugs.map((slug) =>
                saveDraftSection({ specificationId: specification.id, slug, content: edits[slug] }),
            ),
        );
    }

    async function handlePublish() {
        if (!specification || !canPublish) return;
        // Publier valide les brouillons déjà enregistrés : toute modification locale
        // pas encore enregistrée doit d'abord passer par Enregistrer.
        if (dirtySlugs.length > 0) await handleSave();
        await publishSpecification(specification.id);
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground"
                >
                    <ArrowLeft size={16} />
                    Retour à la liste
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                    {specification && <ExportMarkdownButton specification={specification} />}
                    {dirtySlugs.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || isPublishing}
                            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-surface-hover disabled:cursor-default disabled:opacity-50"
                        >
                            {isSaving ? 'Enregistrement…' : `Enregistrer (${dirtySlugs.length})`}
                        </button>
                    )}
                    {canPublish && (
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={isSaving || isPublishing}
                            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-default disabled:opacity-50"
                        >
                            {isPublishing ? 'Publication…' : 'Publier'}
                        </button>
                    )}
                </div>
            </div>

            {isLoading && <p className="text-sm text-muted">Chargement…</p>}
            {isError && <p className="text-sm text-warning">Cahier des charges introuvable.</p>}

            {specification && (
                <>
                    <header className="flex flex-col gap-1">
                        <PageTitle>{specification.name}</PageTitle>
                        <p className="text-sm text-muted">
                            v{specification.version} · créé le {formatDate(specification.createdAt)}
                            {specification.publishedAt &&
                                ` · publié le ${formatDate(specification.publishedAt)}`}
                        </p>
                    </header>

                    <div className="flex flex-col gap-6">
                        {specificationCatalogue.map((entry) => {
                            const section = sectionsBySlug.get(entry.slug);
                            const value = edits[entry.slug] ?? baselineContent(section);
                            const isDirty = dirtySlugs.includes(entry.slug);
                            const status: SectionStatus = isDirty
                                ? 'unsaved'
                                : section?.draftContent != null
                                  ? 'draft'
                                  : null;

                            return (
                                <SectionEditor
                                    key={entry.slug}
                                    entry={entry}
                                    status={status}
                                    value={value}
                                    onChange={(newValue) =>
                                        setEdits((previous) => ({ ...previous, [entry.slug]: newValue }))
                                    }
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
