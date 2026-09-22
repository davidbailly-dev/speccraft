export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { getDataset } = await import('./lib/mock-data/store');
        const { specifications, sections } = getDataset();
        console.log(
            `[mock-data] jeu de données généré : ${specifications.length} cahiers des charges, ${sections.length} sections`,
        );
    }
}
