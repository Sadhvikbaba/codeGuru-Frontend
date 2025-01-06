import React, { useEffect, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";

const MonacoEditor = React.forwardRef(({ value, language, theme, onChange }, ref) => {
  const editorRef = useRef(null);
  const monacoEditorInstance = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => monacoEditorInstance.current?.getValue(),
  }));

  useEffect(() => {
    if (editorRef.current) {
      
      monacoEditorInstance.current = monaco.editor.create(editorRef.current, {
        value: value || "// Write your code here",
        language: language || "javascript",
        theme: theme || "vs-dark",
        automaticLayout: true,
      });

      monacoEditorInstance.current.onDidChangeModelContent(() => {
        if (onChange) {
          const currentValue = monacoEditorInstance.current.getValue();
          onChange(currentValue); 
        }
      });
    }

    return () => {
      monacoEditorInstance.current?.dispose();
    };
  }, []); 

  useEffect(() => {
    if (monacoEditorInstance.current) {
      monaco.editor.setModelLanguage(
        monacoEditorInstance.current.getModel(),
        language || "javascript"
      );
      monaco.editor.setTheme(theme || "vs-dark");
    }
  }, [language, theme]);

  return <div ref={editorRef} style={{ height: "500px", width: "100%" }} />;
});

export default MonacoEditor;
