import { publishSpecification } from '@/lib/mock-data/store';
import { SpecificationDetailSchema } from '@/lib/mock-data/schemas';

export async function POST(request: Request, { params }: RouteContext<'/api/specifications/[id]/publish'>) {
    const { id } = await params;

    const specification = publishSpecification(id);
    if (!specification) {
        return Response.json({ error: 'Cahier des charges introuvable' }, { status: 404 });
    }

    return Response.json(SpecificationDetailSchema.parse(specification));
}
