import type { GenerateSectionDraftInput } from './schemas';

// `gemini-3.1-flash-lite` : variante « lite » au quota gratuit journalier nettement plus
// généreux (500 req/j contre 20 pour les modèles flash standard, testés en premier et
// vite épuisés) — plus adaptée à une démo où un refus de quota serait gênant.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.1-flash-lite';
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
        if (response.status === 503) {
            // Fréquent sur le tier gratuit : le modèle flash est sollicité par tous ses utilisateurs gratuits.
            throw new GeminiRequestError('Modèle IA très sollicité (tier gratuit), réessaie dans quelques secondes.', 503);
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
