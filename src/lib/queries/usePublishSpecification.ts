import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SpecificationDetailSchema, type SpecificationDetail } from '@/lib/mock-data/schemas';

async function publishSpecification(id: string): Promise<SpecificationDetail> {
    const response = await fetch(`/api/specifications/${id}/publish`, { method: 'POST' });

    if (!response.ok) {
        throw new Error(`Failed to publish specification: ${response.status}`);
    }

    return SpecificationDetailSchema.parse(await response.json());
}

export function usePublishSpecification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishSpecification,
        onSuccess: (_specification, id) => {
            queryClient.invalidateQueries({ queryKey: ['specification', id] });
            queryClient.invalidateQueries({ queryKey: ['specifications'] });
        },
    });
}
