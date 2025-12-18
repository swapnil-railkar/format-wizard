import { useEffect, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Result from "./components/Result";
import Toolbar from "./components/Toolbar";
import { convertJSON, isValidJSON} from "./data/json-engine";
import { DFEFAULT_INPUT, DEFAULT_OUTPUT } from "./data/operation-constants";

function App() {
  const [input, updateInput] = useState(DFEFAULT_INPUT);
  const [output, updateOutput] = useState();
  const [operation, updateOperation] = useState(DEFAULT_OUTPUT);

  useEffect(() => {
    console.log(operation);
    function handleUpdateOutput(msg) {
      updateOutput(msg);
    }
    const result = isValidJSON(input.trim());
    console.log(result);
    if (result.message) {
      handleUpdateOutput(result.message);
      return;
    }
    console.log(operation);
    const outputMsg = convertJSON(operation, input);
    console.log('Output : ', outputMsg);
    handleUpdateOutput(outputMsg);
  }, [input, operation]);

  return (
    <>
      <Toolbar operation={operation} selectOperation={updateOperation} />
      <main className="editor-wrapper">
        <Editor defaultValue={input} handleUpdateInput={updateInput} />
        <Result value={output} format={operation} />
      </main>
    </>
  );
}

export default App;
