import {
  BEAUTIFY,
  HJSON,
  JSON5,
  JSON_VIEW,
  TOML,
  TREE_VIEW,
  XML,
  YAML,
} from "../data/operation-constants";

export default function Toolbar({ operation, selectOperation }) {
  return (
    <div className="toolbar">
      <div className="format-group">
        <input
          type="radio"
          id="json-view"
          name="format"
          checked={operation === JSON_VIEW}
          onChange={() => selectOperation(JSON_VIEW)}
        />
        <label htmlFor="json-view">JSON View</label>

        <input
          type="radio"
          id="tree-view"
          name="format"
          checked={operation === TREE_VIEW}
          onChange={() => selectOperation(TREE_VIEW)}
        />
        <label htmlFor="tree-view">Tree View</label>

        <input
          type="radio"
          id="beautify"
          name="format"
          checked={operation === BEAUTIFY}
          onChange={() => selectOperation(BEAUTIFY)}
        />
        <label htmlFor="beautify">Beautify</label>
      </div>
      <div className="format-group">
        <input
          type="radio"
          id="yaml"
          name="format"
          checked={operation === YAML}
          onChange={() => selectOperation(YAML)}
        />
        <label htmlFor="yaml">YAML</label>

        <input
          type="radio"
          id="xml"
          name="format"
          checked={operation === XML}
          onChange={() => selectOperation(XML)}
        />
        <label htmlFor="xml">XML</label>

        <input
          type="radio"
          id="json5"
          name="format"
          checked={operation === JSON5}
          onChange={() => selectOperation(JSON5)}
        />
        <label htmlFor="json5">JSON5</label>

        <input
          type="radio"
          id="hjson"
          name="format"
          checked={operation === HJSON}
          onChange={() => selectOperation(HJSON)}
        />
        <label htmlFor="hjson">HJSON</label>

        <input
          type="radio"
          id="toml"
          name="format"
          checked={operation === TOML}
          onChange={() => selectOperation(TOML)}
        />
        <label htmlFor="toml">TOML</label>
      </div>
    </div>
  );
}
