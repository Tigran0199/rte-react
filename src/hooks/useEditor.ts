import { useEffect, useRef } from 'react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import type { JSONContent } from '@tiptap/core';
import { marked } from 'marked';
import TurndownService from 'turndown';
import FontSize from '../extensions/FontSize';
import FontFamily from '../extensions/FontFamily';
import type { ToolbarTool, OutputFormat } from '../types';

interface UseEditorOptions {
  value?: string | JSONContent[];
  onChange?: (value: string | JSONContent[]) => void;
  outputFormat?: OutputFormat;
  placeholder?: string;
  editable?: boolean;
  toolbar?: ToolbarTool[];
}

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

const serializeForComparison = (val: string | JSONContent[] | undefined): string => {
  if (val === undefined || val === null) return '';
  if (Array.isArray(val)) return JSON.stringify(val);
  return val;
};

const toInitialHtml = (value: string | JSONContent[] | undefined, outputFormat: OutputFormat | undefined): string | object => {
  if (outputFormat === 'json') {
    if (Array.isArray(value) && value.length > 0) {
      return { type: 'doc', content: value as JSONContent[] };
    }
    return '';
  }
  if (outputFormat === 'md') {
    const result = marked.parse((value as string) ?? '');
    return typeof result === 'string' ? result : '';
  }
  return (value as string) ?? '';
};

const formatOutput = (editor: ReturnType<typeof useTiptapEditor>, format: OutputFormat): string | JSONContent[] => {
  if (!editor) return '';
  if (format === 'json') return editor.getJSON().content ?? [];
  if (format === 'md') return turndown.turndown(editor.getHTML());
  return editor.getHTML();
};

export const useEditor = ({
  value = '',
  onChange,
  outputFormat = 'html',
  placeholder = 'Start typing...',
  editable = true,
}: UseEditorOptions) => {
  // Refs to keep callbacks and format current without re-initializing the editor
  const onChangeRef = useRef(onChange);
  const outputFormatRef = useRef(outputFormat);
  // Tracks the serialized form of the last value we sent out or received from outside,
  // so we don't call setContent when the parent echoes our own onChange output back.
  const externalValue = useRef(serializeForComparison(value));

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { outputFormatRef.current = outputFormat; }, [outputFormat]);

  const editor = useTiptapEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      FontFamily,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder }),
    ],
    content: toInitialHtml(value, outputFormat),
    editable,
    onUpdate({ editor }) {
      const output = formatOutput(editor, outputFormatRef.current ?? 'html');
      externalValue.current = serializeForComparison(output);
      onChangeRef.current?.(output);
    },
  });

  // Sync external value changes into the editor
  useEffect(() => {
    if (!editor) return;
    const serialized = serializeForComparison(value);
    if (serialized === externalValue.current) return;
    externalValue.current = serialized;

    if (outputFormat === 'json') {
      const content = Array.isArray(value) && value.length > 0
        ? { type: 'doc', content: value as JSONContent[] }
        : '';
      editor.commands.setContent(content as any, false);
    } else if (outputFormat === 'md') {
      const result = marked.parse((value as string) ?? '');
      const html = typeof result === 'string' ? result : '';
      if (html !== editor.getHTML()) {
        editor.commands.setContent(html, false);
      }
    } else {
      const html = (value as string) ?? '';
      if (html !== editor.getHTML()) {
        editor.commands.setContent(html, false);
      }
    }
  }, [value, editor, outputFormat]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable ?? true);
    }
  }, [editable, editor]);

  return editor;
};
