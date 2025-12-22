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
} from "../data/operation-constants";

const NONE = "none";
export default function Toolbar({ selectOperation }) {
  const [utilityOp, updateUtilityOp] = useState("");
  const [formatOp, updateFormatOp] = useState("");
  const [view, setView] = useState("json");

  function handleUtilityChange(event) {
    const utilityVal = event.target.value;
    updateUtilityOp(utilityVal);
    updateFormatOp(NONE);
    selectOperation(utilityVal);
  }

  function handleFormatChange(event) {
    const formatVal = event.target.value;
    updateFormatOp(formatVal);
    updateUtilityOp(NONE);
    selectOperation(formatVal);
  }

  return (
    <section className="toolbar">
      <div className="wrapper">
        <img src="/app-logo-fox.png" height="20" width="20" />
        <div className="view-toggle">
          <input
            type="radio"
            id="jsonView"
            name="view"
            value="json"
            checked={view === "json"}
            onChange={() => setView("json")}
          />
          <label htmlFor="jsonView" className="text">JSON View</label>

          <input
            type="radio"
            id="treeView"
            name="view"
            value="tree"
            checked={view === "tree"}
            onChange={() => setView("tree")}
          />
          <label htmlFor="treeView" className="text">Tree View</label>
        </div>
      </div>
      <div className="wrapper">
        <select
          className="dropdown text"
          value={utilityOp}
          onChange={handleUtilityChange}
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
        <select
          className="dropdown text"
          value={formatOp}
          onChange={handleFormatChange}
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
        <p className="title-text">FormatWizard</p>
      </div>
    </section>
  );
}
