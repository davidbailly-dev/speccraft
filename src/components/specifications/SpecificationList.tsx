'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSpecifications } from '@/lib/queries/useSpecifications';
import { formatDate } from '@/lib/format/date';
import type { SpecificationSummary } from '@/lib/mock-data/schemas';

function SpecificationStatusBadge({ specification }: { specification: SpecificationSummary }) {
    if (specification.hasPendingDrafts) {
        return (
            <span className="rounded-full bg-warning-surface px-2.5 py-0.5 text-xs font-medium text-warning">
                Brouillon en attente
            </span>
        );
    }

    if (!specification.publishedAt) {
        return (
            <span className="rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-medium text-muted">
                Jamais publié
            </span>
        );
    }

    return (
        <span className="rounded-full bg-success-surface px-2.5 py-0.5 text-xs font-medium text-success">
            Publié
        </span>
    );
}

export function SpecificationList() {
    const [search, setSearch] = useState('');
    const { data: specifications, isLoading, isError } = useSpecifications(search);

    return (
        <div className="flex flex-col gap-6">
            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un cahier des charges…"
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-accent"
            />

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
                        <li key={specification.id}>
                            <Link
                                href={`/specifications/${specification.id}`}
                                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">{specification.name}</span>
                                    <span className="text-xs text-muted">
                                        v{specification.version} · créé le {formatDate(specification.createdAt)}
                                        {specification.publishedAt &&
                                            ` · publié le ${formatDate(specification.publishedAt)}`}
                                    </span>
                                </div>
                                <SpecificationStatusBadge specification={specification} />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
