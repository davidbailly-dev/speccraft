import { generateDataset } from './generator';
import type { Dataset } from './schemas';

let dataset: Dataset | null = null;

/**
 * Génère le jeu de données mockées une seule fois par démarrage de serveur
 * (voir src/instrumentation.ts) puis le sert depuis la mémoire, pour que toutes
 * les requêtes mockées lisent le même état plutôt que des données régénérées
 * à chaque appel.
 */
export function getDataset(): Dataset {
    if (!dataset) {
        dataset = generateDataset();
    }
    return dataset;
}
