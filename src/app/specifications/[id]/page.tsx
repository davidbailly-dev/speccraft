import { SpecificationDetail } from '@/components/specifications/SpecificationDetail';

export default async function SpecificationPage({ params }: PageProps<'/specifications/[id]'>) {
    const { id } = await params;
    return (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
            <SpecificationDetail id={id} />
        </main>
    );
}
