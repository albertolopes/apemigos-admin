import React from 'react';

interface NewsContentProps {
  html: string;
}

export default function NewsContent({ html }: NewsContentProps) {
  return (
    <>
      <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto" />
      <div
        // w-full: Ocupa a largura disponível
        // max-w-3xl: Limita a largura máxima para leitura confortável
        // mx-auto: Centraliza
        // whitespace-normal: FORÇA a quebra de linha (crucial para corrigir o erro da linha infinita)
        // break-words: Quebra palavras longas se necessário
        // hyphens-auto: Hifenização (divisão silábica)
        // text-justify: Justifica o texto
        className="text-slate-600 py-6 w-full max-w-3xl mx-auto text-sm whitespace-normal break-words hyphens-auto text-justify prose dark:prose-invert"
        lang="pt-BR"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
