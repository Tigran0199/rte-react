import React, { useState } from 'react';
import { RichEditor } from 'rte-react';

function App() {
  const [html, setHtml] = useState('<p>Hello! Start editing...</p>');

  return (
    <div className="app">
      <div className="header">
        <h1>rte-react</h1>
        <p>A lightweight, configurable React rich text editor</p>
      </div>

      <div className="demo-section">
        <h2>Full Toolbar</h2>
        <RichEditor
          value={html}
          onChange={(val)=>{
            setHtml(val as string)
          }}
          placeholder="Start typing..."
          toolbar={['fontSize', 'divider', 'bold', 'italic', 'underline', 'strikethrough', 'divider', 'heading1', 'heading2', 'heading3', 'divider', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'divider', 'link', 'image', 'table', 'divider', 'undo', 'redo']}
        />
      </div>

      <div className="demo-section">
        <h2>Custom Toolbar</h2>
        <RichEditor
          onChange={(v) => console.log(v)}
          toolbar={['bold', 'italic', 'underline', 'divider', 'bulletList', 'orderedList', 'divider', 'link']}
          placeholder="Only basic tools..."
        />
      </div>

      <div className="demo-section">
        <h2>Read Only</h2>
        <RichEditor
          value="<p>This editor is <strong>read only</strong>. You cannot edit this content.</p>"
          editable={false}
        />
      </div>

      <div className="demo-section">
        <h2>HTML Output</h2>
        <pre className="output">{html}</pre>
      </div>
    </div>
  );
}

export default App;