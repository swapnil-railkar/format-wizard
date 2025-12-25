import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { foldGutter } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { convertJSON, isValidJSON } from "../data/json-engine";
import { BEAUTIFY } from "../data/operation-constants";

const BASE_JSON = `{
  "message": "Type or Paste Base JSON here."
}`;

const UPDATED_JSON = `{
  "message": "Type or Paste Updated JSON here."
}`;
export default function Compare() {
  const [baseJSON, updateBaseJson] = useState(BASE_JSON);
  const [newJSON, updateJSON] = useState(UPDATED_JSON);
  const [result, updateResult] = useState("Result will be displayed here.");

  function handleBaseJSONUpdate(value) {
    updateBaseJson(value);
    const result = isValidJSON(value);
    if (result.message) {
      updateResult(`Base JSON is not valid, ${result.message}`);
      return;
    }
    const formattedJSON = convertJSON(BEAUTIFY, value);
    updateBaseJson(formattedJSON);
    getResult();
  }

  function handleNewJSONUpdate(value) {
    updateJSON(value);
    const result = isValidJSON(value);
    if (result.message) {
      updateResult(`Updated JSON is not valid, ${result.message}`);
      return;
    }
    const formattedJSON = convertJSON(BEAUTIFY, value);
    updateJSON(formattedJSON);
    getResult();
  }

  function getResult() {
    updateResult("Result will be displayed here");
  }

  return (
    <main className="compare-wrapper">
      <CodeMirror
        value={baseJSON}
        height="80vh"
        width="100%"
        theme={oneDark}
        extensions={[json(), foldGutter()]}
        onChange={(val) => handleBaseJSONUpdate(val)}
      />
      <CodeMirror
        value={newJSON}
        height="80vh"
        width="100%"
        theme={oneDark}
        extensions={[json(), foldGutter()]}
        onChange={(val) => handleNewJSONUpdate(val)}
      />
      <CodeMirror
        value={result}
        height="80vh"
        width="100%"
        theme={oneDark}
        extensions={[json(), foldGutter()]}
        editable={false}
      />
    </main>
  );
}
