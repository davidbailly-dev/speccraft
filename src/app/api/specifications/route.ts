import { NextRequest } from 'next/server';
import { createSpecification, getDataset } from '@/lib/mock-data/store';
import {
    CreateSpecificationInputSchema,
    SpecificationDetailSchema,
    SpecificationSummaryListSchema,
} from '@/lib/mock-data/schemas';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase() ?? '';

    const { specifications, sections } = getDataset();

    const filtered = query
        ? specifications.filter((specification) => specification.name.toLowerCase().includes(query))
        : specifications;

    const summaries = filtered
        .map((specification) => ({
            ...specification,
            hasPendingDrafts: sections.some(
                (section) => section.specificationId === specification.id && section.draftContent !== null,
            ),
        }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return Response.json(SpecificationSummaryListSchema.parse(summaries));
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = CreateSpecificationInputSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: 'Nom de cahier des charges invalide' }, { status: 400 });
    }

    const specification = createSpecification(parsed.data.name);
    return Response.json(SpecificationDetailSchema.parse(specification), { status: 201 });
}
