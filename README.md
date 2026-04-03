# rte-react

A lightweight, fully-typed React rich text editor with a configurable toolbar. Outputs clean HTML. Works with React 17 and higher.

## Install

```bash
npm install rte-react
```

## Usage

```tsx
import { RichEditor } from 'rte-react';
import 'rte-react/styles';

function App() {
  const [content, setContent] = useState('<p>Hello world</p>');

  return (
    <RichEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  );
}
```

## Custom Toolbar

Pass a `toolbar` prop to control which tools are shown:

```tsx
<RichEditor
  value={content}
  onChange={setContent}
  toolbar={['bold', 'italic', 'underline', 'divider', 'bulletList', 'orderedList', 'divider', 'link']}
/>
```

## Available Tools

| Tool | Description |
|------|-------------|
| `bold` | Bold text |
| `italic` | Italic text |
| `underline` | Underline text |
| `strikethrough` | Strikethrough text |
| `heading1` – `heading6` | Headings |
| `bulletList` | Bullet list |
| `orderedList` | Numbered list |
| `blockquote` | Blockquote |
| `codeBlock` | Code block |
| `link` | Insert/edit link |
| `image` | Insert image by URL |
| `table` | Insert 3x3 table |
| `undo` | Undo |
| `redo` | Redo |
| `divider` | Visual separator in toolbar |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | HTML content |
| `onChange` | `(html: string) => void` | — | Called on content change |
| `toolbar` | `ToolbarTool[]` | All tools | Tools to show in toolbar |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `editable` | `boolean` | `true` | Enable/disable editing |
| `className` | `string` | — | Class for outer wrapper |
| `toolbarClassName` | `string` | — | Class for toolbar |
| `contentClassName` | `string` | — | Class for content area |
| `style` | `CSSProperties` | — | Inline style for wrapper |

## License

MIT
