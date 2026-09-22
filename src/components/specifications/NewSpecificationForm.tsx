'use client';

import { useState } from 'react';
import { useCreateSpecification } from '@/lib/queries/useCreateSpecification';

export function NewSpecificationForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const { mutate, isPending } = useCreateSpecification();

    function close() {
        setIsOpen(false);
        setName('');
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        mutate(trimmedName, { onSuccess: close });
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
                Nouveau cahier des charges
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
            <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nom du cahier des charges"
                autoFocus
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-accent"
            />
            <button
                type="submit"
                disabled={isPending || !name.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
                {isPending ? 'Création…' : 'Créer'}
            </button>
            <button
                type="button"
                onClick={close}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-surface-hover"
            >
                Annuler
            </button>
        </form>
    );
}
