import { deleteSpecification, getDataset } from '@/lib/mock-data/store';
import { SpecificationDetailSchema } from '@/lib/mock-data/schemas';

export async function GET(request: Request, { params }: RouteContext<'/api/specifications/[id]'>) {
    const { id } = await params;
    const { specifications, sections } = getDataset();

    const specification = specifications.find((item) => item.id === id);
    if (!specification) {
        return Response.json({ error: 'Cahier des charges introuvable' }, { status: 404 });
    }

    const specificationSections = sections.filter((section) => section.specificationId === id);

    return Response.json(
        SpecificationDetailSchema.parse({ ...specification, sections: specificationSections }),
    );
}

export async function DELETE(request: Request, { params }: RouteContext<'/api/specifications/[id]'>) {
    const { id } = await params;

    if (!deleteSpecification(id)) {
        return Response.json({ error: 'Cahier des charges introuvable' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
}
