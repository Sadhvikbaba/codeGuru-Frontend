import React, { useState, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { FiSun, FiMoon } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { testCode } from "@/connecting";

const languageIds = {
  cpp: 54,
  c : 50 ,
  python: 71,
  java: 62,
};

function Playground() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [btnValue, setBtnValue] = useState("Run Code / Submit");

  const editorRef = useRef(null);
  const monacoEditorInstance = useRef(null);

  const handleRunCode = async () => {
    const languageId = languageIds[language];
    setBtnValue("compiling...")
    const result = await testCode({
      source_code : code,
      language_id :languageId,
      stdin: customInput,
    });
    if(result.response.stderr = "Request failed with status code 429"){
      setOutput("Sorry to inform that our API rate limit has been completed for today")
    }
    
    setOutput(result?.response?.stdout ||" ");

    setBtnValue("Run Code / Submit")
  };

  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "hc-light" : "vs-dark");
  };

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorInstance.current = monaco.editor.create(editorRef.current, {
        value: code,
        language: language,
        theme: theme,
        automaticLayout: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: { other: true, comments: true, strings: true },
      });

      monacoEditorInstance.current.onDidChangeModelContent(() => {
        const currentCode = monacoEditorInstance.current.getValue();
        setCode(currentCode);
      });
    }

    return () => {
      if (monacoEditorInstance.current) {
        monacoEditorInstance.current.dispose();
      }
    };
  }, [language, theme]);

  return (
    <div className="flex">
      <div className="w-1/2 p-2">
        <div className="flex space-x-3 m-4">
          {/* Language Selection Dropdown */}
          <Select
            value={language}
            onValueChange={setLanguage}
            className="bg-gray-100 dark:bg-gray-700"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(languageIds).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-gray-700 border-0"
          >
            {theme === "vs-dark" ? (
              <FiSun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <FiMoon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <div className="mt-4">
          <div ref={editorRef} style={{ height: "400px", width: "100%" }} />
        </div>
        <div className="text-xl font-bold">custom input:</div>
        <textarea
          className="w-full mt-2 p-2 border rounded bg-gray-300 dark:bg-gray-900"
          rows={4}
          placeholder="Enter custom input"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
        />
        <Button onClick={handleRunCode} className="w-full mt-4 mb-7">
          {btnValue}
        </Button>
      </div>

      <div className="min-w-[50%] dark:bg-gray-900 bg-gray-300  p-4 overflow-y-auto">
        <h2 className="text-xl font-bold">Output :</h2>
        <pre className="mt-4 whitespace-pre-wrap break-words">
          {output || "No output yet. Run your code to see the result here."}
        </pre>
      </div>
    </div>
  );
}

export default Playground;
