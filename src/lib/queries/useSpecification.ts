import { useQuery } from '@tanstack/react-query';
import { SpecificationDetailSchema, type SpecificationDetail } from '@/lib/mock-data/schemas';

async function fetchSpecification(id: string): Promise<SpecificationDetail> {
    const response = await fetch(`/api/specifications/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch specification: ${response.status}`);
    }

    return SpecificationDetailSchema.parse(await response.json());
}

export function useSpecification(id: string) {
    return useQuery({
        queryKey: ['specification', id],
        queryFn: () => fetchSpecification(id),
    });
}
