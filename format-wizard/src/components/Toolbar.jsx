import { useState } from "react";
import {
  BEAUTIFY,
  HJSON,
  JSON5,
  JSON_VIEW,
  TOML,
  TREE_VIEW,
  XML,
  YAML,
  MINIFY,
  JSON_QUERY,
  COMPARE,
} from "../data/operation-constants";

const NONE = "none";
export default function Toolbar({
  isValidJSON,
  selectOperation,
  setJsonQuery,
}) {
  const [utilityOp, updateUtilityOp] = useState("");
  const [formatOp, updateFormatOp] = useState("");
  const [view, setView] = useState(JSON_VIEW);
  const [query, setQuery] = useState("");

  function handleUtilityChange(event) {
    const utilityVal = event.target.value;
    updateUtilityOp(utilityVal);
    updateFormatOp(NONE);
    setView(JSON_VIEW);
    selectOperation(utilityVal);
  }

  function handleFormatChange(event) {
    const formatVal = event.target.value;
    updateFormatOp(formatVal);
    updateUtilityOp(NONE);
    setView(JSON_VIEW);
    selectOperation(formatVal);
  }

  function handleUpdateView(view) {
    setView(view);
    updateUtilityOp(NONE);
    updateFormatOp(NONE);
    selectOperation(view);
  }

  function onExecuteQuery() {
    setView(JSON_VIEW);
    selectOperation(JSON_QUERY);
    setJsonQuery(query);
  }

  return (
    <header className="toolbar">
      <section className="wrapper">
        <div className="center-vertically">
          <img src="/app-logo-fox.png" height="20" width="20" />
        </div>
        <div className="view-toggle">
          <input
            type="radio"
            id="jsonView"
            name="view"
            value={JSON_VIEW}
            checked={view === JSON_VIEW}
            onChange={() => handleUpdateView(JSON_VIEW)}
          />
          <label htmlFor="jsonView" className="text">
            JSON View
          </label>

          <input
            type="radio"
            id="treeView"
            name="view"
            value={TREE_VIEW}
            checked={view === TREE_VIEW}
            onChange={() => handleUpdateView(TREE_VIEW)}
            disabled={!isValidJSON}
          />
          <label htmlFor="treeView" className="text">
            Tree View
          </label>

          <input
            type="radio"
            id="compareView"
            name="view"
            value={COMPARE}
            checked={view === COMPARE}
            onChange={() => handleUpdateView(COMPARE)}
          />
          <label htmlFor="compareView" className="text">
            Compare JSON
          </label>
        </div>
        {view === JSON_VIEW && (
          <div className="json-query-bar">
            <input
              type="text"
              className="json-query-input"
              placeholder="Type or paste a JSON query"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              disabled={!isValidJSON}
            />
            <button
              className="text app-default-btn"
              onClick={() => onExecuteQuery()}
              disabled={!isValidJSON}
            >
              Search
            </button>
          </div>
        )}
      </section>
      <section className="wrapper">
        {view === JSON_VIEW && (
          <div className="center-vertically">
            <select
              className="dropdown text"
              value={utilityOp}
              onChange={handleUtilityChange}
              disabled={!isValidJSON}
            >
              <option value={NONE} className="options text">
                Utility
              </option>
              <option value={BEAUTIFY} className="options text">
                Beautify
              </option>
              <option value={MINIFY} className="options text">
                Minify
              </option>
            </select>
          </div>
        )}
        {view === JSON_VIEW && (
          <div className="center-vertically">
            <select
              className="dropdown text"
              value={formatOp}
              onChange={handleFormatChange}
              disabled={!isValidJSON}
            >
              <option value={NONE} className="options text">
                Format
              </option>
              <option value={YAML} className="options text">
                YAML
              </option>
              <option value={XML} className="options text">
                XML
              </option>
              <option value={JSON5} className="options text">
                JSON5
              </option>
              <option value={HJSON} className="options text">
                HJSON
              </option>
              <option value={TOML} className="options text">
                TOML
              </option>
            </select>
          </div>
        )}
        <div className="center-vertically">
          <p className="title-text">FormatWizard</p>
        </div>
      </section>
    </header>
  );
}
