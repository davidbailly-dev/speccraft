import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteSpecification(id: string): Promise<void> {
    const response = await fetch(`/api/specifications/${id}`, { method: 'DELETE' });

    if (!response.ok) {
        throw new Error(`Failed to delete specification: ${response.status}`);
    }
}

export function useDeleteSpecification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSpecification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specifications'] });
        },
    });
}
