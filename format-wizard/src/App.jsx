import "./App.css";
import Editor from "./components/Editor";
import Result from "./components/Result";
import Toolbar from "./components/Toolbar";

function App() {
  return (
    <>
      <Toolbar />
      <main className="editor-wrapper">
        <div className="editor-pane">
          <Editor />
        </div>

        <div className="editor-pane">
          <Result value={"This is results screen"} />
        </div>
      </main>
    </>
  );
}

export default App;
