import { useEffect, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Result from "./components/Result";
import Toolbar from "./components/Toolbar";
import { formatJSON, isValidJSON, toXML, toYAML } from "./data/json-engine";
import { BEAUTIFY, XML, YAML } from "./data/operation-constants";

const DFEFAULT_INPUT = "Paste or type JSON.";
const DEFAULT_OUTPUT = "Nothing to show.";
function App() {
  const [input, updateInput] = useState(DFEFAULT_INPUT);
  const [output, updateOutput] = useState();
  const [operation, updateOperation] = useState(DEFAULT_OUTPUT);

  useEffect(() => {
    function handleUpdateOutput(msg) {
      updateOutput(msg);
    }
    const result = isValidJSON(input.trim());
    if (input != DFEFAULT_INPUT || result.message) {
      handleUpdateOutput(result.message);
      return;
    }
    console.log(operation);
    switch (operation) {
      case BEAUTIFY:
        handleUpdateOutput(formatJSON(input));
        break;
      case YAML:
        handleUpdateOutput(toYAML(input));
        break;
      case XML:
        handleUpdateOutput(toXML(input));
        break;
      default:
        handleUpdateOutput(DEFAULT_OUTPUT);
    }
  }, [input, operation]);

  return (
    <>
      <Toolbar selectOperation={updateOperation} />
      <main className="editor-wrapper">
        <Editor defaultValue={input} handleUpdateInput={updateInput} />
        <Result value={output} format={operation} />
      </main>
    </>
  );
}

export default App;
