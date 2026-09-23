'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useSpecification } from '@/lib/queries/useSpecification';
import { useSaveDraftSection } from '@/lib/queries/useSaveDraftSection';
import { usePublishSpecification } from '@/lib/queries/usePublishSpecification';
import { useGenerateSectionDraft } from '@/lib/queries/useGenerateSectionDraft';
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

// Marge sous les 15 req/min du modèle Gemini par défaut (gemini-3.1-flash-lite, cf. src/lib/ai/gemini.ts).
const MIN_DELAY_BETWEEN_AI_CALLS_MS = 4_500;

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    specificationName,
}: {
    entry: SectionCatalogueEntry;
    status: SectionStatus;
    value: string;
    onChange: (value: string) => void;
    specificationName: string;
}) {
    const HeadingTag = entry.level === 'section' ? 'h2' : 'h3';
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [isAiGenerated, setIsAiGenerated] = useState(false);
    const { mutateAsync: generateDraft, isPending: isGenerating, error: generationError } = useGenerateSectionDraft();

    async function handleGenerate() {
        try {
            const content = await generateDraft({
                specificationName,
                sectionTitle: entry.title,
                existingContent: value,
                instructions,
            });
            onChange(content);
            setIsAiGenerated(true);
            setIsAiPanelOpen(false);
        } catch {
            // Erreur déjà exposée via `generationError` pour l'affichage dans le panneau.
        }
    }

    function handleManualChange(newValue: string) {
        setIsAiGenerated(false);
        onChange(newValue);
    }

    return (
        <div className={entry.level === 'subsection' ? 'pl-5' : ''}>
            <Card>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <HeadingTag className={entry.level === 'section' ? 'text-lg font-semibold' : 'text-base font-medium'}>
                            {entry.title}
                        </HeadingTag>
                        <SectionStatusBadge status={status} />
                        {isAiGenerated && status === 'unsaved' && (
                            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                                Généré par IA
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAiPanelOpen((open) => !open)}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                    >
                        <Sparkles size={14} />
                        IA
                    </button>
                </div>

                {isAiPanelOpen && (
                    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-hover p-3">
                        <input
                            type="text"
                            value={instructions}
                            onChange={(event) => setInstructions(event.target.value)}
                            placeholder="Consigne optionnelle (ex : ton, points à couvrir…)"
                            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-default disabled:opacity-50"
                            >
                                {isGenerating ? 'Génération…' : value.trim() ? 'Régénérer' : 'Générer'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAiPanelOpen(false)}
                                className="cursor-pointer text-xs text-muted hover:text-foreground"
                            >
                                Annuler
                            </button>
                        </div>
                        {generationError && <p className="text-xs text-warning">{generationError.message}</p>}
                    </div>
                )}

                <textarea
                    value={value}
                    onChange={(event) => handleManualChange(event.target.value)}
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
    const { mutateAsync: generateSectionDraft } = useGenerateSectionDraft();

    const [isGlobalAiPanelOpen, setIsGlobalAiPanelOpen] = useState(false);
    const [globalBrief, setGlobalBrief] = useState('');
    const [globalProgress, setGlobalProgress] = useState<{ current: number; total: number } | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);

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

    async function handleGenerateAll() {
        if (!specification) return;
        setGlobalError(null);
        setGlobalProgress({ current: 0, total: specificationCatalogue.length });
        const failedTitles: string[] = [];

        // Séquentiel et espacé (pas en parallèle) : le modèle par défaut est plafonné à
        // 15 requêtes/minute sur le tier gratuit, en dessous du nombre de sections du catalogue.
        for (const [index, entry] of specificationCatalogue.entries()) {
            if (index > 0) await wait(MIN_DELAY_BETWEEN_AI_CALLS_MS);

            try {
                const baseline = edits[entry.slug] ?? baselineContent(sectionsBySlug.get(entry.slug));
                const content = await generateSectionDraft({
                    specificationName: specification.name,
                    sectionTitle: entry.title,
                    existingContent: baseline,
                    instructions: globalBrief,
                });
                setEdits((previous) => ({ ...previous, [entry.slug]: content }));
            } catch {
                // Un échec ponctuel (quota, surcharge) ne doit pas bloquer les sections suivantes ;
                // la section reste relançable individuellement via son propre bouton IA.
                failedTitles.push(entry.title);
            }

            setGlobalProgress({ current: index + 1, total: specificationCatalogue.length });
        }

        setGlobalProgress(null);
        if (failedTitles.length > 0) {
            setGlobalError(`Échec pour : ${failedTitles.join(', ')}. Relance-les individuellement via le bouton IA de la section.`);
        } else {
            setIsGlobalAiPanelOpen(false);
        }
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
                    {specification && (
                        <button
                            type="button"
                            onClick={() => setIsGlobalAiPanelOpen((open) => !open)}
                            disabled={globalProgress !== null}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-surface-hover disabled:cursor-default disabled:opacity-50"
                        >
                            <Sparkles size={16} />
                            Pré-remplir avec l&apos;IA
                        </button>
                    )}
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

                    {isGlobalAiPanelOpen && (
                        <Card>
                            <p className="text-sm font-medium">Pré-remplir toutes les sections avec l&apos;IA</p>
                            <textarea
                                value={globalBrief}
                                onChange={(event) => setGlobalBrief(event.target.value)}
                                rows={2}
                                placeholder="Brief du projet (2-3 phrases) — contexte, objectif, périmètre…"
                                disabled={globalProgress !== null}
                                className="w-full resize-y rounded-lg border border-border bg-transparent p-3 text-sm outline-none focus:border-accent disabled:opacity-50"
                            />
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleGenerateAll}
                                    disabled={globalProgress !== null}
                                    className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-default disabled:opacity-50"
                                >
                                    {globalProgress
                                        ? `Génération… (${globalProgress.current}/${globalProgress.total})`
                                        : 'Générer toutes les sections'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGlobalAiPanelOpen(false)}
                                    disabled={globalProgress !== null}
                                    className="cursor-pointer text-sm text-muted hover:text-foreground disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                            </div>
                            {globalError && <p className="text-sm text-warning">{globalError}</p>}
                        </Card>
                    )}

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
                                    specificationName={specification.name}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
