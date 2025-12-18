import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { xml } from "@codemirror/lang-xml";
import { foldGutter } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { XML, YAML } from "../data/operation-constants";

export default function Result({value, format}) {
    let extensionValue = json();
    switch(format) {
      case YAML:
        extensionValue = yaml();
        break;
      case XML:
        extensionValue = xml();
        break;
      default: json();
    }
    return (
    <CodeMirror
      value={value}
      height="80vh"
      width="100%"
      theme={oneDark}
      extensions={[extensionValue, foldGutter()]}
      editable = {false}
    />
  );
}