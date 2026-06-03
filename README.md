# rte-react

A lightweight, fully-typed React rich text editor with a configurable toolbar. Supports HTML, Markdown, and JSON output formats. Works with React 17 and higher.

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

## Output Formats

The `outputFormat` prop controls the format of the `value` prop and the value passed to `onChange`. Defaults to `'html'`.

### HTML (default)

```tsx
const [html, setHtml] = useState('<p>Hello world</p>');

<RichEditor
  outputFormat="html"
  value={html}
  onChange={(v) => setHtml(v as string)}
/>
```

`onChange` receives a string like `<p>Hello <strong>world</strong></p>`.

### Markdown

```tsx
const [md, setMd] = useState('Hello **world**');

<RichEditor
  outputFormat="md"
  value={md}
  onChange={(v) => setMd(v as string)}
/>
```

`onChange` receives a Markdown string like `Hello **world**`. The `value` prop is parsed from Markdown before being loaded into the editor.

### JSON

```tsx
import type { JSONContent } from 'rte-react';

const [nodes, setNodes] = useState<JSONContent[]>([]);

<RichEditor
  outputFormat="json"
  value={nodes}
  onChange={(v) => setNodes(v as JSONContent[])}
/>
```

`onChange` receives a `JSONContent[]` array — the raw ProseMirror content nodes from Tiptap's `editor.getJSON().content`.

## Custom Toolbar

Pass a `toolbar` prop to control which tools are shown and in what order:

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
| `heading1` – `heading6` | Headings H1–H6 |
| `bulletList` | Bullet list |
| `orderedList` | Numbered list |
| `blockquote` | Blockquote |
| `codeBlock` | Fenced code block |
| `link` | Insert or edit a hyperlink |
| `image` | Upload and insert an image (max 10 MB) |
| `table` | Insert a table (configurable rows × cols) |
| `fontSize` | Font size dropdown (12–48 px) |
| `undo` | Undo |
| `redo` | Redo |
| `divider` | Visual separator in the toolbar |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| JSONContent[]` | `''` | Initial content. Format must match `outputFormat`. |
| `onChange` | `(value: string \| JSONContent[]) => void` | — | Called on every content change. Receives a value in the format set by `outputFormat`. |
| `outputFormat` | `'html' \| 'md' \| 'json'` | `'html'` | Format used for both `value` input and `onChange` output. |
| `toolbar` | `ToolbarTool[]` | All tools | Tools to show in the toolbar. |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text shown when the editor is empty. |
| `editable` | `boolean` | `true` | Set to `false` to render a read-only view (toolbar is hidden). |
| `className` | `string` | — | Class added to the outer wrapper element. |
| `toolbarClassName` | `string` | — | Class added to the toolbar element. |
| `contentClassName` | `string` | — | Class added to the content area element. |
| `style` | `CSSProperties` | — | Inline style for the outer wrapper element. |

## Exported Types

```ts
import type { RichEditorProps, ToolbarTool, OutputFormat, JSONContent } from 'rte-react';
```

| Type | Description |
|------|-------------|
| `RichEditorProps` | Full props interface for `<RichEditor>` |
| `ToolbarTool` | Union of all valid toolbar tool names |
| `OutputFormat` | `'html' \| 'md' \| 'json'` |
| `JSONContent` | ProseMirror node shape used for JSON format (re-exported from `@tiptap/core`) |

## License

MIT
