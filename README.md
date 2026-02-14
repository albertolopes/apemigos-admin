# Apemigos Admin - Painel Administrativo

Este é o painel administrativo da plataforma **Apemigos**, desenvolvido para gerenciar o conteúdo do site, incluindo notícias, projetos e usuários.

O projeto foi construído utilizando **Next.js 16**, **React 19**, **TypeScript** e **Tailwind CSS v4**, baseando-se no template [TailAdmin](https://tailadmin.com).

## Funcionalidades Principais

### 🔐 Autenticação e Segurança
*   **Login Seguro**: Sistema de autenticação integrado com a API backend.
*   **Proteção de Rotas**: Acesso restrito às páginas administrativas apenas para usuários autenticados.
*   **Gestão de Sessão**: Controle de token JWT via Context API (`AuthContext`).

### 📰 Gerenciamento de Notícias
*   **CRUD Completo**: Criar, listar, editar e excluir notícias.
*   **Editor de Texto Rico (WYSIWYG)**: Integração com **TipTap** para edição de conteúdo complexo (imagens, vídeos, formatação).
*   **Geração Automática de Slug**: O slug da URL é gerado automaticamente a partir do título.
*   **Pré-visualização**: Modal para visualizar como a notícia ficará no site final, com formatação correta (hifenização, justificação).
*   **Criação em Duas Etapas**: Fluxo otimizado para criar a notícia e seu conteúdo associado.

### 🏗️ Estrutura e Tecnologia
*   **Next.js App Router**: Utiliza a estrutura de rotas moderna do Next.js.
*   **Componentes Reutilizáveis**: Baseado em componentes modulares (Botões, Modais, Tabelas, Inputs).
*   **Tema Claro/Escuro**: Suporte nativo a dark mode.
*   **Responsividade**: Layout totalmente adaptável a dispositivos móveis.

## Instalação e Execução

### Pré-requisitos
*   Node.js 18.x ou superior (recomendado 20.x).

### Passos

1.  **Instale as dependências:**

    ```bash
    npm install --legacy-peer-deps
    # A flag --legacy-peer-deps é necessária devido a algumas dependências (como react-quill/tiptap) ainda estarem se adaptando ao React 19.
    ```

2.  **Configure a API:**
    Certifique-se de que o backend da Apemigos esteja rodando localmente em `http://localhost:8080` ou ajuste a `baseURL` em `src/lib/services/api.ts`.

3.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

4.  Acesse `http://localhost:3000` no seu navegador.

## Estrutura do Projeto

*   `src/app`: Rotas e páginas da aplicação (App Router).
    *   `(admin)`: Rotas protegidas do painel (Dashboard, Notícias, etc.).
    *   `login`: Página pública de login.
*   `src/components`: Componentes de UI reutilizáveis.
    *   `news`: Componentes específicos para o módulo de notícias (Formulário, Tabela, Visualização).
    *   `ui`: Componentes genéricos (Botões, Modais, Inputs).
    *   `layout`: Componentes estruturais (Sidebar, Header).
*   `src/lib`: Lógica de negócios e utilitários.
    *   `services`: Comunicação com a API (Axios).
    *   `contexts`: Gerenciamento de estado global (Auth, Theme, Sidebar).
    *   `types`: Definições de tipos TypeScript.

## Créditos

Este projeto utiliza como base o template open-source [TailAdmin Next.js](https://github.com/TailAdmin/free-nextjs-admin-dashboard).
