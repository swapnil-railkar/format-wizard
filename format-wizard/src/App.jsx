import { useEffect, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Result from "./components/Result";
import Toolbar from "./components/Toolbar";
import { convertJSON, isValidJSON } from "./data/json-engine.jsx";
import {
  DFEFAULT_INPUT,
  DEFAULT_OUTPUT,
  TREE_VIEW,
  JSON_VIEW,
} from "./data/operation-constants";
import TreeView from "./components/TreeView";

function App() {
  const [input, updateInput] = useState(DFEFAULT_INPUT);
  const [output, updateOutput] = useState(DEFAULT_OUTPUT);
  const [showTree, updateShowTree] = useState(false);
  const [operation, updateSelectedOperation] = useState();

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

    function handleUpdateShowTree(opValue) {
      if(opValue === JSON_VIEW || result.message) {
        updateShowTree(false);
      }
      if(opValue === TREE_VIEW) {
        updateShowTree(true);
        return;
      }
    }
    // input json is valid.
    if(operation === TREE_VIEW || operation === TREE_VIEW) {
      handleUpdateShowTree(operation);
    }
    const outputMsg = convertJSON(operation, input);
    console.log("Output : ", outputMsg);
    handleUpdateOutput(outputMsg);
  }, [input, operation]);

  return (
    <>
      <Toolbar
        isValidJSON={isValidJSON(input.trim())}
        selectOperation={updateSelectedOperation}
      />
      {!showTree && (
        <main className="editor-wrapper">
          <Editor defaultValue={input} handleUpdateInput={updateInput} />
          <Result value={output} format={operation} />
        </main>
      )}
      {showTree && <TreeView jsonStr={input}/>}
    </>
  );
}

export default App;
