import { saveDraftSection } from '@/lib/mock-data/store';
import { SaveDraftSectionInputSchema, SectionSchema } from '@/lib/mock-data/schemas';

export async function PUT(
    request: Request,
    { params }: RouteContext<'/api/specifications/[id]/sections/[slug]'>,
) {
    const { id, slug } = await params;
    const body = await request.json().catch(() => null);
    const parsed = SaveDraftSectionInputSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: 'Contenu de section invalide' }, { status: 400 });
    }

    const section = saveDraftSection(id, slug, parsed.data.content);
    if (!section) {
        return Response.json({ error: 'Section introuvable' }, { status: 404 });
    }

    return Response.json(SectionSchema.parse(section));
}
