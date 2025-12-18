import {
  BEAUTIFY,
  HJSON,
  JSON5,
  XML,
  YAML,
} from "../data/operation-constants";

export default function Toolbar({ operation, selectOperation }) {
  return (
    <div className="toolbar">
      <div className="format-group">
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
      </div>
    </div>
  );
}
