import type { GenerateSectionDraftInput } from './schemas';

// Alias de modèle géré par Google : pointe vers la version flash courante,
// évite de coder en dur un nom de version qui sera déprécié.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class GeminiConfigError extends Error {}

export class GeminiRequestError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

function buildPrompt({ specificationName, sectionTitle, existingContent, instructions }: GenerateSectionDraftInput): string {
    const parts = [
        `Tu rédiges le contenu de la section "${sectionTitle}" d'un cahier des charges structuré nommé "${specificationName}".`,
        "Réponds uniquement avec le texte de la section, en français, de façon claire et professionnelle, sans titre ni formatage Markdown.",
    ];

    if (existingContent.trim()) {
        parts.push(`Contenu actuel à améliorer ou compléter :\n${existingContent.trim()}`);
    }

    if (instructions.trim()) {
        parts.push(`Consigne de l'utilisateur : ${instructions.trim()}`);
    }

    return parts.join('\n\n');
}

export async function generateSectionDraft(input: GenerateSectionDraftInput): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new GeminiConfigError("Clé API Gemini non configurée côté serveur (variable GEMINI_API_KEY).");
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(input) }] }],
        }),
    });

    if (!response.ok) {
        // Le corps d'erreur Gemini n'est pas renvoyé tel quel au client (détails internes).
        if (response.status === 429) {
            throw new GeminiRequestError('Quota IA gratuit dépassé, réessaie plus tard.', 429);
        }
        throw new GeminiRequestError('Le service IA est momentanément indisponible.', 502);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof content !== 'string' || !content.trim()) {
        throw new GeminiRequestError('Réponse IA vide ou inattendue.', 502);
    }

    return content.trim();
}
