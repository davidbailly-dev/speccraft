import { SpecificationList } from '@/components/specifications/SpecificationList';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">SpecCraft</h1>
        <p className="text-sm text-muted">Cahiers des charges</p>
      </div>
      <SpecificationList />
    </main>
  );
}
