import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SpecificationDetailSchema, type SpecificationDetail } from '@/lib/mock-data/schemas';

async function createSpecification(name: string): Promise<SpecificationDetail> {
    const response = await fetch('/api/specifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create specification: ${response.status}`);
    }

    return SpecificationDetailSchema.parse(await response.json());
}

export function useCreateSpecification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSpecification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specifications'] });
        },
    });
}
