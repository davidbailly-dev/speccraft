import { useMutation } from '@tanstack/react-query';
import { GenerateSectionDraftOutputSchema } from '@/lib/ai/schemas';

type GenerateSectionDraftInput = {
    specificationName: string;
    sectionTitle: string;
    existingContent: string;
    instructions: string;
};

async function generateSectionDraft(input: GenerateSectionDraftInput): Promise<string> {
    const response = await fetch('/api/ai/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(body?.error ?? `Échec de la génération IA : ${response.status}`);
    }

    return GenerateSectionDraftOutputSchema.parse(body).content;
}

export function useGenerateSectionDraft() {
    return useMutation({ mutationFn: generateSectionDraft });
}
