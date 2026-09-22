import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionSchema, type Section } from '@/lib/mock-data/schemas';

type SaveDraftSectionInput = {
    specificationId: string;
    slug: string;
    content: string;
};

async function saveDraftSection({ specificationId, slug, content }: SaveDraftSectionInput): Promise<Section> {
    const response = await fetch(`/api/specifications/${specificationId}/sections/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error(`Failed to save section draft: ${response.status}`);
    }

    return SectionSchema.parse(await response.json());
}

export function useSaveDraftSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveDraftSection,
        onSuccess: (_section, variables) => {
            queryClient.invalidateQueries({ queryKey: ['specification', variables.specificationId] });
            // La liste affiche un badge « brouillon en attente » par cahier des charges.
            queryClient.invalidateQueries({ queryKey: ['specifications'] });
        },
    });
}
