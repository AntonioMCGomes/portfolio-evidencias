// O alias `figma:asset/...` é resolvido pelo Vite (ver vite.config.ts),
// mas o TypeScript não conhece esse esquema de módulo por padrão.
// Esta declaração diz ao tsc para tratá-lo como um import de imagem comum.
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}
