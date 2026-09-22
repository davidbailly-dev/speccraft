import { z } from 'zod';

export const SpecificationSchema = z.object({
    id: z.string(),
    name: z.string(),
    version: z.number().int().nonnegative(),
    createdAt: z.string().datetime(),
    publishedAt: z.string().datetime().nullable(),
});
export type Specification = z.infer<typeof SpecificationSchema>;

export const SpecificationListSchema = z.array(SpecificationSchema);

// Vue liste : ajoute `hasPendingDrafts`, calculé côté serveur à partir des sections,
// pour afficher un badge « brouillon » sans que le client recompose lui-même l'agrégat.
export const SpecificationSummarySchema = SpecificationSchema.extend({
    hasPendingDrafts: z.boolean(),
});
export type SpecificationSummary = z.infer<typeof SpecificationSummarySchema>;

export const SpecificationSummaryListSchema = z.array(SpecificationSummarySchema);

export const SectionSchema = z.object({
    id: z.string(),
    specificationId: z.string(),
    slug: z.string(),
    // `draftContent` non nul = section modifiée depuis la dernière publication.
    publishedContent: z.string(),
    draftContent: z.string().nullable(),
    updatedAt: z.string().datetime(),
});
export type Section = z.infer<typeof SectionSchema>;

export const SectionListSchema = z.array(SectionSchema);

export const SpecificationDetailSchema = SpecificationSchema.extend({
    sections: SectionListSchema,
});
export type SpecificationDetail = z.infer<typeof SpecificationDetailSchema>;

export const CreateSpecificationInputSchema = z.object({
    name: z.string().trim().min(1),
});
export type CreateSpecificationInput = z.infer<typeof CreateSpecificationInputSchema>;

export const DatasetSchema = z.object({
    specifications: z.array(SpecificationSchema),
    sections: z.array(SectionSchema),
});
export type Dataset = z.infer<typeof DatasetSchema>;
