import { NextRequest } from 'next/server';
import { getDataset } from '@/lib/mock-data/store';
import { SpecificationSummaryListSchema } from '@/lib/mock-data/schemas';

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
