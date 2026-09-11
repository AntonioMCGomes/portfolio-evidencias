import { StorageAdapter } from './types';
import { LocalStorageAdapter } from './localStorageAdapter';

/**
 * Instância única usada por toda a aplicação.
 *
 * Quando precisar de um backend de verdade, basta:
 *   1. Criar uma nova classe implementando StorageAdapter
 *      (ex: `ApiStorageAdapter`, `SupabaseStorageAdapter`), fazendo as
 *      chamadas HTTP/SDK necessárias dentro dos 4 métodos da interface.
 *   2. Trocar a linha abaixo para instanciar essa nova classe.
 *
 * Nenhum componente ou página precisa ser alterado — todos dependem
 * apenas do tipo StorageAdapter, não desta implementação.
 */
export const storage: StorageAdapter = new LocalStorageAdapter();

export type { StorageAdapter } from './types';
