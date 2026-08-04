'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Node } from '@tiptap/core';

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Video as VideoIcon,
  Minus,
  Eraser,
} from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const getFencedCode = (text: string) => {
  const match = text.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)\n?```$/);
  if (!match) return null;

  return {
    language: match[1] || null,
    code: match[2],
  };
};

const isLikelyCode = (text: string) => {
  const normalized = text.replace(/\r\n?/g, '\n');
  const lines = normalized.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (!normalized.trim()) return false;
  if (getFencedCode(normalized.trim())) return true;
  if (nonEmptyLines.some((line) => /^\s{2,}|\t/.test(line))) return true;

  const codeKeywordPattern = /^\s*(import|export|const|let|var|function|class|interface|type|public|private|protected|return|if|else|for|while|switch|case|try|catch|finally|throw|async|await|package|SELECT|UPDATE|INSERT|DELETE|CREATE|ALTER)\b/m;
  const hasCodeKeyword = codeKeywordPattern.test(normalized);
  const syntaxTokens = normalized.match(/[{}()[\];=<>]/g)?.length || 0;

  return hasCodeKeyword && syntaxTokens >= Math.max(2, Math.floor(nonEmptyLines.length / 2));
};

// Custom Video Extension para manter o HTML limpo e organizado
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      class: { default: 'aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 my-4' }
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', HTMLAttributes];
  },
});

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt('URL do vídeo do YouTube:');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const addVideo = () => {
    const url = window.prompt('URL do vídeo (MP4, WebM, Ogg):');
    if (url) {
      editor.chain().focus().insertContent({
        type: 'video',
        attrs: { src: url }
      }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Negrito"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Itálico"
      >
        <Italic size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="H1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="H2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="H3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Lista"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Lista Numerada"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Citação"
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        type="button" title="Divisória"
      >
        <Minus size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Bloco de Código"
      >
        <Code2 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button
        onClick={setLink}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        type="button" title="Link"
      >
        <LinkIcon size={18} />
      </button>
      <button
        onClick={addImage}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        type="button" title="Imagem"
      >
        <ImageIcon size={18} />
      </button>
      <button
        onClick={addYoutube}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        type="button" title="YouTube"
      >
        <YoutubeIcon size={18} />
      </button>
      <button
        onClick={addVideo}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        type="button" title="Vídeo MP4"
      >
        <VideoIcon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        type="button" title="Limpar Formatação"
      >
        <Eraser size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
        type="button" title="Desfazer"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
        type="button" title="Refazer"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const isMounted = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        horizontalRule: {},
        codeBlock: {
          enableTabIndentation: true,
          HTMLAttributes: {
            class: 'rounded-lg bg-gray-950 text-gray-100 p-4 my-4 overflow-x-auto text-sm text-left whitespace-pre font-mono',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100',
          },
        },
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Youtube.configure({
        controls: false,
        HTMLAttributes: { class: 'aspect-video w-full my-4' },
      }),
      Video,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-content max-w-none focus:outline-none p-4 text-gray-900 dark:text-white break-words text-justify min-h-[400px]',
        lang: 'pt-BR',
      },
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;
        if (!clipboardData || view.state.selection.$from.parent.type.name === 'codeBlock') {
          return false;
        }

        const html = clipboardData.getData('text/html');
        const vscodeData = clipboardData.getData('vscode-editor-data');
        const plainText = clipboardData.getData('text/plain');

        if (!plainText || (html && /<pre[\s>]|<code[\s>]/i.test(html))) {
          return false;
        }

        const fencedCode = getFencedCode(plainText.trim());
        const shouldInsertCodeBlock = Boolean(vscodeData) || Boolean(fencedCode) || isLikelyCode(plainText);

        if (!shouldInsertCodeBlock) {
          return false;
        }

        const code = (fencedCode?.code || plainText).replace(/\r\n?/g, '\n');
        const language = fencedCode?.language || null;
        const codeBlock = view.state.schema.nodes.codeBlock;

        if (!codeBlock) {
          return false;
        }

        event.preventDefault();
        view.dispatch(
          view.state.tr
            .replaceSelectionWith(codeBlock.create({ language }, view.state.schema.text(code)))
            .scrollIntoView()
        );

        return true;
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Se for o primeiro carregamento com conteúdo ou o editor estiver realmente vazio
      if (!isMounted.current || (editor.isEmpty && content !== '')) {
        editor.commands.setContent(content, { emitUpdate: false });
        isMounted.current = true;
      }
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex flex-col min-h-[500px]">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900/50">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};

export default TiptapEditor;
