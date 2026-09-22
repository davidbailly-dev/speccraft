import { SpecificationList } from '@/components/specifications/SpecificationList';
import { PageTitle } from '@/components/ui/PageTitle';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <PageTitle>Cahiers des charges</PageTitle>
      <SpecificationList />
    </main>
  );
}
