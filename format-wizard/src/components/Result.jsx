import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

export default function Result({value}) {
    return (
    <CodeMirror
      value={value}
      height="80vh"
      width="100%"
      theme={oneDark}
      extensions={[json()]}
      editable = {false}
    />
  );
}