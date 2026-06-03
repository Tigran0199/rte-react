import React from 'react';
import { EditorContent } from '@tiptap/react';
import { RichEditorProps, ToolbarTool, FontFamilyOption } from '../types';
import { useEditor } from '../hooks/useEditor';
import Toolbar from './Toolbar';
import '../styles/editor.css';

const DEFAULT_TOOLBAR: ToolbarTool[] = [
  'bold', 'italic', 'underline', 'strikethrough', 'divider',
  'heading1', 'heading2', 'heading3', 'divider',
  'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'divider',
  'link', 'image', 'table', 'divider',
  'undo', 'redo',
];

const RichEditor: React.FC<RichEditorProps> = ({
  value = '',
  onChange,
  outputFormat = 'html',
  toolbar = DEFAULT_TOOLBAR,
  fontFamilies,
  placeholder = 'Start typing...',
  editable = true,
  className,
  style,
  toolbarClassName,
  contentClassName,
}) => {
  const editor = useEditor({ value, onChange, outputFormat, placeholder, editable, toolbar });

  if (!editor) return null;

  return (
    <div
      className={['rre-editor', className].filter(Boolean).join(' ')}
      style={style}
    >
      {editable && (
        <Toolbar editor={editor} toolbar={toolbar} fontFamilies={fontFamilies} className={toolbarClassName} />
      )}
      <EditorContent
        editor={editor}
        className={['rre-content', contentClassName].filter(Boolean).join(' ')}
      />
    </div>
  );
};

export default RichEditor;
