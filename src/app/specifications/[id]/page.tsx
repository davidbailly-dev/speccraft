import { SpecificationDetail } from '@/components/specifications/SpecificationDetail';

export default async function SpecificationPage({ params }: PageProps<'/specifications/[id]'>) {
    const { id } = await params;
    return (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
            {/* key={id} force un remount complet en cas de navigation directe entre deux
                cahiers des charges, pour ne jamais garder l'état d'édition (brouillons
                locaux non enregistrés) de l'un affiché sur l'autre. */}
            <SpecificationDetail key={id} id={id} />
        </main>
    );
}
