import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

export default function Editor({ handleUpdateInput }) {
  const [value, updateValue] = useState("Paste or Type JSON");

  function handleValueChange(val) {
    handleUpdateInput(val);
    updateValue(val);
  }
  return (
    <CodeMirror
      value={value}
      height="80vh"
      width="100%"
      theme={oneDark}
      extensions={[json()]}
      onChange={(val) => handleValueChange(val)}
    />
  );
}
