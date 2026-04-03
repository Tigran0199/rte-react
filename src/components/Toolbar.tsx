import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { ToolbarTool } from '../types';
import ToolbarButton from './toolbar/ToolbarButton';
import { getToolDefinition } from './toolbar/tools';

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

interface ToolbarProps {
  editor: Editor;
  toolbar: ToolbarTool[];
  className?: string;
}

type PopupType = 'link' | 'table' | null;

const Toolbar: React.FC<ToolbarProps> = ({ editor, toolbar, className }) => {
  const [popup, setPopup] = useState<PopupType>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [tableRows, setTableRows] = useState('3');
  const [tableCols, setTableCols] = useState('3');
  const popupRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const hasSelection = !editor.state.selection.empty;
  const currentFontSize = editor.getAttributes('textStyle').fontSize?.replace('px', '') || '16';

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    };
    if (popup) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popup]);

  const handleFontSize = (size: string) => {
    editor.chain().focus().setFontSize(`${size}px`).run();
  };

  const handleLinkOpen = () => {
    setLinkUrl(editor.getAttributes('link').href || '');
    setLinkText('');
    setPopup(popup === 'link' ? null : 'link');
  };

  const handleLinkSave = () => {
    if (!linkUrl) return;
    if (hasSelection) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      if (!linkText) return;
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText}</a>`)
        .run();
    }
    setLinkUrl('');
    setLinkText('');
    setPopup(null);
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLinkSave();
    if (e.key === 'Escape') setPopup(null);
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert('Image is too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be picked again
    e.target.value = '';
  };

  const handleTableOpen = () => {
    setPopup(popup === 'table' ? null : 'table');
  };

  const handleTableInsert = () => {
    const rows = Math.min(10, Math.max(1, parseInt(tableRows) || 3));
    const cols = Math.min(10, Math.max(1, parseInt(tableCols) || 3));
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setPopup(null);
  };

  const handleTableKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTableInsert();
    if (e.key === 'Escape') setPopup(null);
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

  const renderPopup = (tool: ToolbarTool) => {
    if (tool === 'link' && popup === 'link') {
      return (
        <div className="rre-popup" ref={popupRef}>
          <input
            className="rre-popup-input"
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            autoFocus
          />
          {!hasSelection && (
            <input
              className="rre-popup-input"
              type="text"
              placeholder="Display text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={handleLinkKeyDown}
            />
          )}
          <button
            className="rre-popup-btn"
            onMouseDown={(e) => { e.preventDefault(); handleLinkSave(); }}
          >
            Save
          </button>
        </div>
      );
    }

    if (tool === 'table' && popup === 'table') {
      return (
        <div className="rre-popup rre-popup--table" ref={popupRef}>
          <input
            className="rre-popup-input rre-popup-input--num"
            type="number"
            min="1"
            max="10"
            value={tableRows}
            onChange={(e) => setTableRows(e.target.value)}
            onKeyDown={handleTableKeyDown}
            autoFocus
          />
          <span className="rre-popup-x">×</span>
          <input
            className="rre-popup-input rre-popup-input--num"
            type="number"
            min="1"
            max="10"
            value={tableCols}
            onChange={(e) => setTableCols(e.target.value)}
            onKeyDown={handleTableKeyDown}
          />
          <button
            className="rre-popup-btn"
            onMouseDown={(e) => { e.preventDefault(); handleTableInsert(); }}
          >
            Insert
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={['rre-toolbar', className].filter(Boolean).join(' ')} role="toolbar">
      {/* Hidden file input for image */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

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

        if (tool === 'link') {
          const def = getToolDefinition(tool);
          if (!def) return null;
          return (
          <div  key="link" className="rre-toolbar-popup-wrapper" onMouseDown={(e) => e.stopPropagation()}> 
              <ToolbarButton
                onClick={handleLinkOpen}
                isActive={editor.isActive('link') || popup === 'link'}
                title={def.title}
              >
                <span className="rre-icon" dangerouslySetInnerHTML={{ __html: def.icon }} />
              </ToolbarButton>
              {renderPopup('link')}
            </div>
          );
        }

        if (tool === 'image') {
          const def = getToolDefinition(tool);
          if (!def) return null;
          return (
            <ToolbarButton
              key="image"
              onClick={handleImageClick}
              title={def.title}
            >
              <span className="rre-icon" dangerouslySetInnerHTML={{ __html: def.icon }} />
            </ToolbarButton>
          );
        }

        if (tool === 'table') {
          const def = getToolDefinition(tool);
          if (!def) return null;
          return (
<div key="table" className="rre-toolbar-popup-wrapper" onMouseDown={(e) => e.stopPropagation()}>
              <ToolbarButton
                onClick={handleTableOpen}
                isActive={popup === 'table'}
                title={def.title}
              >
                <span className="rre-icon" dangerouslySetInnerHTML={{ __html: def.icon }} />
              </ToolbarButton>
              {renderPopup('table')}
            </div>
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
            <span className="rre-icon" dangerouslySetInnerHTML={{ __html: def.icon }} />
          </ToolbarButton>
        );
      })}
    </div>
  );
};

export default Toolbar;