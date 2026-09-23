import { GenerateSectionDraftInputSchema } from '@/lib/ai/schemas';
import { generateSectionDraft, GeminiConfigError, GeminiRequestError } from '@/lib/ai/gemini';

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = GenerateSectionDraftInputSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: 'Requête de génération invalide' }, { status: 400 });
    }

    try {
        const content = await generateSectionDraft(parsed.data);
        return Response.json({ content });
    } catch (error) {
        if (error instanceof GeminiConfigError) {
            console.error('[ai/generate-section] configuration manquante :', error.message);
            return Response.json({ error: error.message }, { status: 500 });
        }
        if (error instanceof GeminiRequestError) {
            return Response.json({ error: error.message }, { status: error.status });
        }
        console.error('[ai/generate-section] erreur inattendue :', error);
        return Response.json({ error: 'Erreur inattendue lors de la génération IA' }, { status: 500 });
    }
}
