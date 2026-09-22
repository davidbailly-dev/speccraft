'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useSpecifications } from '@/lib/queries/useSpecifications';
import { useDeleteSpecification } from '@/lib/queries/useDeleteSpecification';
import { formatDate } from '@/lib/format/date';
import { NewSpecificationForm } from './NewSpecificationForm';
import type { SpecificationSummary } from '@/lib/mock-data/schemas';

function SpecificationStatusBadge({ specification }: { specification: SpecificationSummary }) {
    if (specification.hasPendingDrafts) {
        return (
            <span className="shrink-0 rounded-full bg-warning-surface px-2.5 py-0.5 text-xs font-medium text-warning">
                Brouillon en attente
            </span>
        );
    }

    if (!specification.publishedAt) {
        return (
            <span className="shrink-0 rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-medium text-muted">
                Jamais publié
            </span>
        );
    }

    return (
        <span className="shrink-0 rounded-full bg-success-surface px-2.5 py-0.5 text-xs font-medium text-success">
            Publié
        </span>
    );
}

function DeleteSpecificationButton({ specification }: { specification: SpecificationSummary }) {
    const [isConfirming, setIsConfirming] = useState(false);
    const { mutate, isPending } = useDeleteSpecification();

    if (isConfirming) {
        return (
            <div className="flex items-center gap-2 text-xs">
                <span className="text-muted">Supprimer ?</span>
                <button
                    type="button"
                    onClick={() => mutate(specification.id)}
                    disabled={isPending}
                    className="font-medium text-warning hover:underline disabled:opacity-50"
                >
                    {isPending ? 'Suppression…' : 'Confirmer'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    className="text-muted hover:underline"
                >
                    Annuler
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsConfirming(true)}
            aria-label={`Supprimer ${specification.name}`}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-warning"
        >
            <Trash2 size={16} />
        </button>
    );
}

export function SpecificationList() {
    const [search, setSearch] = useState('');
    const { data: specifications, isLoading, isError } = useSpecifications(search);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un cahier des charges…"
                    className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-accent"
                />
                <NewSpecificationForm />
            </div>

            {isLoading && <p className="text-sm text-muted">Chargement…</p>}
            {isError && (
                <p className="text-sm text-warning">Impossible de charger les cahiers des charges.</p>
            )}

            {specifications && specifications.length === 0 && (
                <p className="text-sm text-muted">Aucun cahier des charges trouvé.</p>
            )}

            {specifications && specifications.length > 0 && (
                <ul className="flex flex-col gap-3">
                    {specifications.map((specification) => (
                        <li
                            key={specification.id}
                            className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2 transition-colors hover:bg-surface-hover"
                        >
                            <Link
                                href={`/specifications/${specification.id}`}
                                className="flex min-w-0 flex-1 items-center justify-between gap-4 p-2"
                            >
                                <div className="flex min-w-0 flex-col gap-1">
                                    <span className="truncate font-medium">{specification.name}</span>
                                    <span className="truncate text-xs text-muted">
                                        v{specification.version} · créé le {formatDate(specification.createdAt)}
                                        {specification.publishedAt &&
                                            ` · publié le ${formatDate(specification.publishedAt)}`}
                                    </span>
                                </div>
                                <SpecificationStatusBadge specification={specification} />
                            </Link>
                            <DeleteSpecificationButton specification={specification} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
