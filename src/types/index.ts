import type { JSONContent } from '@tiptap/core';

export type OutputFormat = 'html' | 'md' | 'json';

export type { JSONContent };

export interface FontFamilyOption {
  label: string;
  value: string;
}

export type ToolbarTool =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'link'
  | 'image'
  | 'table'
  | 'undo'
  | 'redo'
  | 'fontSize'
  | 'fontFamily'
  | 'divider';

export interface RichEditorProps {
  value?: string | JSONContent[];
  onChange?: (value: string | JSONContent[]) => void;
  outputFormat?: OutputFormat;
  toolbar?: ToolbarTool[];
  fontFamilies?: FontFamilyOption[];
  placeholder?: string;
  editable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  toolbarClassName?: string;
  contentClassName?: string;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

export interface ToolDefinition {
  name: ToolbarTool;
  title: string;
  icon: string;
}
