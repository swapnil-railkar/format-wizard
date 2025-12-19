import { useEffect, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Result from "./components/Result";
import Toolbar from "./components/Toolbar";
import { convertJSON, isValidJSON } from "./data/json-engine";
import {
  DFEFAULT_INPUT,
  DEFAULT_OUTPUT,
  TOGGLE_VIEW,
} from "./data/operation-constants";
import TreeView from "./components/TreeView";

function App() {
  const [input, updateInput] = useState(DFEFAULT_INPUT);
  const [output, updateOutput] = useState();
  const [operation, updateOperation] = useState(DEFAULT_OUTPUT);
  const [showTreeView, updateShowTreeView] = useState(false);

  useEffect(() => {
    console.log(operation);
    function handleUpdateOutput(msg) {
      updateOutput(msg);
    }
    function handleToggle() {
      updateShowTreeView((prevState) => !prevState);
    }
    const result = isValidJSON(input.trim());
    console.log(result);
    if (result.message) {
      handleUpdateOutput(result.message);
      return;
    }
    // input json is valid.
    console.log(operation);
    if (operation === TOGGLE_VIEW) {
      handleToggle();
      return;
    }
    const outputMsg = convertJSON(operation, input);
    console.log("Output : ", outputMsg);
    handleUpdateOutput(outputMsg);
  }, [input, operation]);

  return (
    <>
      <Toolbar
        operation={operation}
        selectOperation={updateOperation}
        treeView={showTreeView}
      />
      {!showTreeView && (
        <main className="editor-wrapper">
          <Editor defaultValue={input} handleUpdateInput={updateInput} />
          <Result value={output} format={operation} />
        </main>
      )}
      {showTreeView && <TreeView jsonStr={input}/>}
    </>
  );
}

export default App;
