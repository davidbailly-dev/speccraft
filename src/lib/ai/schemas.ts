import { z } from 'zod';

export const GenerateSectionDraftInputSchema = z.object({
    specificationName: z.string().trim().min(1),
    sectionTitle: z.string().trim().min(1),
    existingContent: z.string(),
    instructions: z.string(),
});
export type GenerateSectionDraftInput = z.infer<typeof GenerateSectionDraftInputSchema>;

export const GenerateSectionDraftOutputSchema = z.object({
    content: z.string(),
});
export type GenerateSectionDraftOutput = z.infer<typeof GenerateSectionDraftOutputSchema>;
