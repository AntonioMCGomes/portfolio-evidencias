/**
 * `new Date('YYYY-MM-DD')` interpreta a string como meia-noite em UTC.
 * Ao formatar de volta num fuso horário atrás de UTC (ex: Brasil, UTC-3),
 * isso pode exibir o dia ANTERIOR ao que foi realmente salvo. As funções
 * abaixo tratam a data sempre no fuso horário local, evitando esse
 * deslocamento de um dia.
 */

/** Converte 'YYYY-MM-DD' num Date à meia-noite no fuso horário local. */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Formata 'YYYY-MM-DD' para o padrão brasileiro completo (dd/mm/yyyy). */
export function formatDateBR(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR');
}

/** Formata 'YYYY-MM-DD' para dd/mm (usado nos eixos dos gráficos). */
export function formatDateShortBR(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

/**
 * Data de hoje no fuso horário local, no formato 'YYYY-MM-DD'.
 * Evita `new Date().toISOString().split('T')[0]`, que usa UTC e pode
 * retornar o dia seguinte (ou anterior) dependendo do fuso e da hora.
 */
export function getTodayLocalISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Compara duas datas 'YYYY-MM-DD' em ordem decrescente (mais recente
 * primeiro). Funciona por comparação de string porque o formato ISO
 * ordena lexicograficamente igual à ordem cronológica — não precisa
 * criar objetos Date (e portanto não sofre com fuso horário).
 */
export function compareDatesDesc(a: string, b: string): number {
  return b.localeCompare(a);
}
