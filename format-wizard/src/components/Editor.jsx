import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

export default function Editor({ defaultValue, handleUpdateInput }) {

  return (
    <CodeMirror
      value={defaultValue}
      height="80vh"
      width="100%"
      theme={oneDark}
      extensions={[json()]}
      onChange={(val) => handleUpdateInput(val)}
    />
  );
}
