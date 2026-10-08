# Requisitos: Pagina Alto Custo / CEAF

## Contexto

A feature deve ser criada no projeto publico:

`/home/beto/Documentos/aaa-pessoal/apemigos`

Nao deve ser implementada no projeto admin:

`/home/beto/Documentos/aaa-pessoal/apemigos-admin`

O objetivo e criar uma pagina publica que funcione como um fluxograma facilitado para ajudar pessoas com doencas raras a entenderem como solicitar medicamentos do Componente Especializado da Assistencia Farmaceutica (CEAF), conhecido como "Alto Custo", no Distrito Federal.

## Fontes oficiais

Usar como base as paginas da Secretaria de Saude do DF:

- `https://www.saude.df.gov.br/componente-especializado`
- `https://www.saude.df.gov.br/protocolos-clinicos-ter-resumos-e-formularios`

## Informacoes importantes ja levantadas

A pagina de formularios lista:

- Documentos gerais para solicitacao.
- Condicoes clinicas atendidas no CEAF.
- Links para paginas individuais de cada condicao.
- Em cada pagina individual da condicao, ha links para PDFs e documentos especificos.

A pagina de formularios informa que foi atualizada em `08/05/2026 as 14h43`.

Aviso relevante da pagina oficial:

- Os relatorios padronizados estao disponiveis para facilitar a apresentacao das informacoes necessarias.
- Esses relatorios nao sao obrigatorios.
- E permitido apresentar outros modelos de relatorio, desde que contenham as informacoes necessarias para avaliacao conforme PCDT.

## Exemplo de fluxo dos dados oficiais

Na pagina principal de formularios, as doencas aparecem como links simples:

```html
<a href="/dislipidemia-para-prevencao-de-eventos-cardiovasculares-e-pancreatite">
  Dislipidemia Para Prevencao De Eventos Cardiovasculares E Pancreatite
</a>
```

Ao abrir a pagina da condicao, aparecem os documentos especificos:

```html
<h2 class="portlet-title-text">
  Dislipidemia Para Prevencao De Eventos Cardiovasculares E Pancreatite
</h2>

<a href="/documents/37101/0/Dislipidemia_SES_DF.pdf/...">
  Dislipidemia - SES - DF
</a>
<a href="/documents/37101/0/Criterios_Diagnosticos.pdf/...">
  Criterios Diagnosticos (Anexo I)
</a>
<a href="/documents/37101/0/Relatorio_Padronizado_Dislipidemias.pdf/...">
  Relatorio Padronizado - Dislipidemias (Anexo II)
</a>
```

## Documentos gerais que devem aparecer no fluxo

Criar atalhos para:

- Laudo para Solicitacao, Avaliacao e Autorizacao de Medicamentos do Componente Especializado da Assistencia Farmaceutica (LME).
- Declaracao Autorizadora.
- Declaracao de Residencia.
- Declaracao de Nao Gravidez.

Os links devem apontar para os documentos oficiais da Secretaria de Saude do DF quando possivel.

## Condicoes clinicas

A pagina oficial lista varias condicoes. A feature nao precisa necessariamente cadastrar todas manualmente na primeira versao, mas deve nascer preparada para isso.

Condicoes relevantes citadas na pagina oficial incluem, entre outras:

- Acne Grave
- Acromegalia
- Anemia Hemolitica Autoimune
- Angioedema Associado a Deficiencia de C1 Esterase
- Artrite Psoriaca
- Artrite Reumatoide
- Asma
- Atrofia Muscular Espinhal 5q Tipo I e II
- Colangite Biliar Primaria
- Dermatite Atopica
- Diabetes Mellitus Tipo I
- Diabetes Mellitus Tipo 2
- Doenca de Alzheimer
- Doenca de Crohn
- Doenca de Fabry
- Doenca de Gaucher
- Doenca de Pompe
- Doenca de Wilson
- Doenca Falciforme
- Dor Cronica
- Endometriose
- Epilepsia
- Esclerose Lateral Amiotrofica
- Esclerose Multipla
- Esclerose Sistemica
- Espondilite Ancilosante
- Fenilcetonuria
- Fibrose Cistica
- Fibrose Pulmonar Idiopatica
- Hemoglobinuria Paroxistica Noturna
- Hidradenite Supurativa
- Hipertensao Arterial Pulmonar
- Imunodeficiencia Primaria
- Insuficiencia Adrenal
- Lupus Eritematoso Sistemico
- Miastenia Gravis
- Mucopolissacaridoses
- Osteoporose
- Psoriase
- Puberdade Precoce Central
- Sindrome de Guillain-Barre
- Sindrome de Turner
- Sindrome Nefrotica Primaria
- Transplantes
- Transtorno Afetivo Bipolar Tipo I
- Urticaria Cronica Espontanea
- Uveites Nao-Infecciosas

## Requisitos funcionais

1. Criar uma pagina publica no portal Apemigos, sugerida como `/alto-custo`.
2. Adicionar item no menu principal, sugerido como `Alto Custo`.
3. Explicar em linguagem simples o que e o CEAF/Alto Custo.
4. Apresentar um fluxo visual em etapas para o usuario:
   - identificar medicamento/condicao;
   - conferir se a condicao esta listada no CEAF;
   - abrir a pagina oficial da condicao;
   - baixar formularios/documentos;
   - reunir documentos pessoais e medicos;
   - protocolar conforme orientacao oficial da SES-DF.
5. Ter busca por nome da condicao.
6. Mostrar cards/lista de condicoes com link para a pagina oficial da SES-DF.
7. Ao selecionar uma condicao, mostrar:
   - nome da condicao;
   - link oficial da pagina da condicao;
   - orientacao para verificar documentos e anexos;
   - aviso de que a Apemigos nao substitui a avaliacao da SES-DF.
8. Mostrar atalhos para documentos gerais.
9. Mostrar um checklist pratico para o paciente/cuidador.
10. Incluir aviso de atualizacao/fonte: "Fonte: Secretaria de Saude do DF. Conferir sempre a pagina oficial antes de protocolar."

## Requisitos nao funcionais

- A pagina deve funcionar bem em desktop e mobile.
- Deve seguir o padrao visual publico atual do portal Apemigos:
  - fonte `font-site` para titulos;
  - destaque em `orange-500`;
  - textos em `slate-500`;
  - layout com `max-w-7xl mx-auto`;
  - cards brancos com borda superior/elementos em laranja.
- Evitar dependencia de backend para a primeira versao.
- Os dados podem ser estaticos em um array TypeScript dentro da propria pagina ou em um arquivo separado.
- Usar links absolutos para a SES-DF quando o `href` original for relativo:
  - exemplo: `/esclerose-multipla/` vira `https://www.saude.df.gov.br/esclerose-multipla/`.
- Nao baixar nem hospedar PDFs oficiais localmente sem necessidade; preferir linkar para a fonte oficial.

## Sugestao tecnica para o projeto correto

Arquivos provaveis:

- Criar: `app/alto-custo/page.tsx`
- Opcional: criar componente client `app/alto-custo/AltoCustoFlow.tsx`
- Alterar: `app/components/Layout/NavBar/NavBar.tsx`
- Opcional: atualizar `app/sitemap.ts` incluindo `/alto-custo`

Se a pagina tiver busca/interacao, usar componente client:

```tsx
'use client';

import { useMemo, useState } from 'react';
```

Se quiser manter metadata server-side, usar `page.tsx` como server component e importar um componente client para o fluxo.

## Estrutura recomendada da pagina

1. Hero:
   - titulo: `Alto Custo sem labirinto`
   - subtitulo: explicar que e um guia facilitado para encontrar formularios e documentos oficiais do CEAF/SES-DF.
2. Bloco "Antes de comecar":
   - documento medico;
   - CID/condicao;
   - medicamento prescrito;
   - documentos pessoais.
3. Fluxograma de etapas:
   - `1. Encontre sua condicao`
   - `2. Abra a pagina oficial`
   - `3. Baixe formularios e anexos`
   - `4. Reuna documentos`
   - `5. Protocole na SES-DF`
4. Busca/lista de condicoes.
5. Documentos gerais.
6. Aviso final e links oficiais.

## Observacoes de responsabilidade

Incluir texto claro:

- A pagina e informativa e nao substitui orientacao medica, juridica ou avaliacao da Secretaria de Saude.
- As regras, formularios e links podem mudar.
- O usuario deve conferir a pagina oficial da SES-DF antes de protocolar.

## Links oficiais principais

- CEAF / Componente Especializado: `https://www.saude.df.gov.br/componente-especializado`
- Protocolos, resumos e formularios: `https://www.saude.df.gov.br/protocolos-clinicos-ter-resumos-e-formularios`

