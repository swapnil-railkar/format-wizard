import { useEffect, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Result from "./components/Result";
import Toolbar from "./components/Toolbar";
import {
  convertJSON,
  isValidJSON,
  returnResultForQuery,
} from "./data/json-engine.jsx";
import {
  DFEFAULT_INPUT,
  DEFAULT_OUTPUT,
  TREE_VIEW,
  JSON_VIEW,
  JSON_QUERY,
} from "./data/operation-constants";
import TreeView from "./components/TreeView";

function App() {
  const [input, updateInput] = useState(DFEFAULT_INPUT);
  const [output, updateOutput] = useState(DEFAULT_OUTPUT);
  const [showTree, updateShowTree] = useState(false);
  const [operation, updateSelectedOperation] = useState();
  const [validJSON, updateValidJSON] = useState(false);
  const [query, updateQuery] = useState("");

  useEffect(() => {
    const result = isValidJSON(input.trim());

    function handleError(errorMsg) {
      updateValidJSON(false);
      updateOutput(errorMsg);
      updateShowTree(false);
    }

    function handleOutput() {
      updateValidJSON(true);
      if (operation === TREE_VIEW) {
        updateShowTree(true);
        return;
      }

      updateShowTree(false);
      let outputMsg = DEFAULT_OUTPUT;
      if (operation === JSON_QUERY) {
        try {
          const result = returnResultForQuery(input, query.trim());
          outputMsg = JSON.stringify(result, null, 2);
        } catch (error) {
          outputMsg = error.message;
        }
      } else {
        outputMsg = convertJSON(operation, input);
      }
      updateOutput(outputMsg);
    }

    if (result.message) {
      handleError(result.message);
      return;
    }

    // input is valid JSON
    console.log('Selected operation : ', operation);
    handleOutput();
  }, [input, operation, query]);

  return (
    <>
      <Toolbar
        isValidJSON={validJSON}
        selectOperation={updateSelectedOperation}
        setJsonQuery={updateQuery}
      />
      {!showTree && (
        <main className="editor-wrapper">
          <Editor defaultValue={input} handleUpdateInput={updateInput} />
          <Result value={output} format={operation} />
        </main>
      )}
      {showTree && <TreeView jsonStr={input} />}
    </>
  );
}

export default App;
