import { useQuery } from '@tanstack/react-query';
import { SpecificationSummaryListSchema, type SpecificationSummary } from '@/lib/mock-data/schemas';

async function fetchSpecifications(search?: string): Promise<SpecificationSummary[]> {
    const params = new URLSearchParams();
    if (search) params.set('q', search);

    const query = params.toString();
    const response = await fetch(`/api/specifications${query ? `?${query}` : ''}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch specifications: ${response.status}`);
    }

    return SpecificationSummaryListSchema.parse(await response.json());
}

export function useSpecifications(search?: string) {
    return useQuery({
        queryKey: ['specifications', search],
        queryFn: () => fetchSpecifications(search),
    });
}
