import React from 'react';
import { Editor } from '@tiptap/react';
import { ToolbarTool } from '../types';
import ToolbarButton from './toolbar/ToolbarButton';
import { getToolDefinition } from './toolbar/tools';

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

interface ToolbarProps {
  editor: Editor;
  toolbar: ToolbarTool[];
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, toolbar, className }) => {
  const currentFontSize = editor.getAttributes('textStyle').fontSize?.replace('px', '') || '16';

  const handleFontSize = (size: string) => {
    editor.chain().focus().setFontSize(`${size}px`).run();
  };

  const handleTool = (tool: ToolbarTool) => {
    switch (tool) {
      case 'bold': editor.chain().focus().toggleBold().run(); break;
      case 'italic': editor.chain().focus().toggleItalic().run(); break;
      case 'underline': editor.chain().focus().toggleUnderline().run(); break;
      case 'strikethrough': editor.chain().focus().toggleStrike().run(); break;
      case 'heading1': editor.chain().focus().toggleHeading({ level: 1 }).run(); break;
      case 'heading2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
      case 'heading3': editor.chain().focus().toggleHeading({ level: 3 }).run(); break;
      case 'heading4': editor.chain().focus().toggleHeading({ level: 4 }).run(); break;
      case 'heading5': editor.chain().focus().toggleHeading({ level: 5 }).run(); break;
      case 'heading6': editor.chain().focus().toggleHeading({ level: 6 }).run(); break;
      case 'bulletList': editor.chain().focus().toggleBulletList().run(); break;
      case 'orderedList': editor.chain().focus().toggleOrderedList().run(); break;
      case 'blockquote': editor.chain().focus().toggleBlockquote().run(); break;
      case 'codeBlock': editor.chain().focus().toggleCodeBlock().run(); break;
      case 'link': {
        const url = window.prompt('Enter URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
        break;
      }
      case 'image': {
        const url = window.prompt('Enter image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
        break;
      }
      case 'table':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
      case 'undo': editor.chain().focus().undo().run(); break;
      case 'redo': editor.chain().focus().redo().run(); break;
    }
  };

  const isActive = (tool: ToolbarTool): boolean => {
    switch (tool) {
      case 'bold': return editor.isActive('bold');
      case 'italic': return editor.isActive('italic');
      case 'underline': return editor.isActive('underline');
      case 'strikethrough': return editor.isActive('strike');
      case 'heading1': return editor.isActive('heading', { level: 1 });
      case 'heading2': return editor.isActive('heading', { level: 2 });
      case 'heading3': return editor.isActive('heading', { level: 3 });
      case 'heading4': return editor.isActive('heading', { level: 4 });
      case 'heading5': return editor.isActive('heading', { level: 5 });
      case 'heading6': return editor.isActive('heading', { level: 6 });
      case 'bulletList': return editor.isActive('bulletList');
      case 'orderedList': return editor.isActive('orderedList');
      case 'blockquote': return editor.isActive('blockquote');
      case 'codeBlock': return editor.isActive('codeBlock');
      case 'link': return editor.isActive('link');
      default: return false;
    }
  };

  const isDisabled = (tool: ToolbarTool): boolean => {
    if (tool === 'undo') return !editor.can().undo();
    if (tool === 'redo') return !editor.can().redo();
    return false;
  };

  return (
    <div className={['rre-toolbar', className].filter(Boolean).join(' ')} role="toolbar">
      {toolbar.map((tool, i) => {
        if (tool === 'divider') {
          return <div key={`divider-${i}`} className="rre-toolbar-divider" aria-hidden="true" />;
        }
        if (tool === 'fontSize') {
          return (
            <select
              key="fontSize"
              className="rre-fontsize-select"
              value={currentFontSize}
              onChange={(e) => handleFontSize(e.target.value)}
              title="Font size"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          );
        }
        const def = getToolDefinition(tool);
        if (!def) return null;
        return (
          <ToolbarButton
            key={tool}
            onClick={() => handleTool(tool)}
            isActive={isActive(tool)}
            disabled={isDisabled(tool)}
            title={def.title}
          >
            <span
              className="rre-icon"
              dangerouslySetInnerHTML={{ __html: def.icon }}
            />
          </ToolbarButton>
        );
      })}
    </div>
  );
};

export default Toolbar;