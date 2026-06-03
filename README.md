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

## Font Picker

Add `'fontFamily'` to the `toolbar` prop to show the font family picker. It renders as a dropdown where each option is displayed in its own font for a live preview.

```tsx
<RichEditor
  value={content}
  onChange={setContent}
  toolbar={['fontFamily', 'fontSize', 'divider', 'bold', 'italic', 'underline']}
/>
```

Selecting text and choosing a font wraps it in a `<span style="font-family: ...">`. Choosing **Default** removes the inline style cleanly. The dropdown always reflects the font at the current cursor position.

### Default fonts

| Label | CSS value |
|-------|-----------|
| Default | *(removes font mark)* |
| Arial | `Arial, sans-serif` |
| Georgia | `Georgia, serif` |
| Helvetica | `Helvetica, Arial, sans-serif` |
| Times New Roman | `'Times New Roman', Times, serif` |
| Trebuchet MS | `'Trebuchet MS', sans-serif` |
| Verdana | `Verdana, sans-serif` |
| Courier New | `'Courier New', Courier, monospace` |

### Custom font list

Pass a `fontFamilies` prop to replace the default list with your own fonts. Each entry is a `{ label, value }` object where `value` is any valid CSS `font-family` string.

```tsx
import { RichEditor, DEFAULT_FONT_FAMILIES } from 'rte-react';
import type { FontFamilyOption } from 'rte-react';

// Completely custom list
const myFonts: FontFamilyOption[] = [
  { label: 'Default',    value: '' },
  { label: 'Inter',      value: 'Inter, sans-serif' },
  { label: 'Roboto',     value: 'Roboto, sans-serif' },
  { label: 'Fira Code',  value: "'Fira Code', monospace" },
];

<RichEditor
  toolbar={['fontFamily', 'divider', 'bold', 'italic']}
  fontFamilies={myFonts}
  value={content}
  onChange={setContent}
/>
```

To extend the built-in list rather than replace it, spread `DEFAULT_FONT_FAMILIES`:

```tsx
import { DEFAULT_FONT_FAMILIES } from 'rte-react';

const extendedFonts = [
  ...DEFAULT_FONT_FAMILIES,
  { label: 'Inter',     value: 'Inter, sans-serif' },
  { label: 'Fira Code', value: "'Fira Code', monospace" },
];

<RichEditor fontFamilies={extendedFonts} ... />
```

> **Note:** the editor only renders the font — it does not load any font files. Make sure any custom web fonts (e.g. from Google Fonts) are loaded in your app before using them here.

`fontFamily` and `fontSize` are independent marks and can be combined freely — selecting both tools applies both `font-family` and `font-size` on the same span.

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
| `fontFamily` | Font family picker (Arial, Georgia, Helvetica, Times New Roman, Trebuchet MS, Verdana, Courier New) |
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
| `fontFamilies` | `FontFamilyOption[]` | Built-in list | Custom font list for the `fontFamily` picker. Replaces the default 8 fonts entirely. |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text shown when the editor is empty. |
| `editable` | `boolean` | `true` | Set to `false` to render a read-only view (toolbar is hidden). |
| `className` | `string` | — | Class added to the outer wrapper element. |
| `toolbarClassName` | `string` | — | Class added to the toolbar element. |
| `contentClassName` | `string` | — | Class added to the content area element. |
| `style` | `CSSProperties` | — | Inline style for the outer wrapper element. |

## Exported Types

```ts
import { DEFAULT_FONT_FAMILIES } from 'rte-react';
import type { RichEditorProps, ToolbarTool, OutputFormat, JSONContent, FontFamilyOption } from 'rte-react';
```

| Export | Kind | Description |
|--------|------|-------------|
| `RichEditorProps` | type | Full props interface for `<RichEditor>` |
| `ToolbarTool` | type | Union of all valid toolbar tool names |
| `OutputFormat` | type | `'html' \| 'md' \| 'json'` |
| `JSONContent` | type | ProseMirror node shape used for JSON format (re-exported from `@tiptap/core`) |
| `FontFamilyOption` | type | `{ label: string; value: string }` — shape of a font picker entry |
| `DEFAULT_FONT_FAMILIES` | value | The built-in font list used when no `fontFamilies` prop is passed |

## License

MIT
