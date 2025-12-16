import { useState } from "react";

export default function Toolbar() {
  const [checkedOption, updateCheckedOption] = useState("");

  return (
    <div className="toolbar">
      <div className="format-group">
        <input
          type="radio"
          id="beautify"
          name="format"
          checked={checkedOption === "beautify"}
          onChange={() => updateCheckedOption("beautify")}
        />
        <label htmlFor="beautify">Beautify</label>
      </div>
      <div className="format-group">
        <input
          type="radio"
          id="yaml"
          name="format"
          checked={checkedOption === "yaml"}
          onChange={() => updateCheckedOption("yaml")}
        />
        <label htmlFor="yaml">YAML</label>

        <input
          type="radio"
          id="xml"
          name="format"
          checked={checkedOption === "xml"}
          onChange={() => updateCheckedOption("xml")}
        />
        <label htmlFor="xml">XML</label>

        <input
          type="radio"
          id="json5"
          name="format"
          checked={checkedOption === "json5"}
          onChange={() => updateCheckedOption("json5")}
        />
        <label htmlFor="json5">JSON5</label>

        <input
          type="radio"
          id="csv"
          name="format"
          checked={checkedOption === "csv"}
          onChange={() => updateCheckedOption("csv")}
        />
        <label htmlFor="csv">CSV</label>

        <input
          type="radio"
          id="hjson"
          name="format"
          checked={checkedOption === "hjson"}
          onChange={() => updateCheckedOption("hjson")}
        />
        <label htmlFor="hjson">HJSON</label>

        <input
          type="radio"
          id="msgpack"
          name="format"
          checked={checkedOption === "msgpack"}
          onChange={() => updateCheckedOption("msgpack")}
        />
        <label htmlFor="msgpack">MessagePack</label>

        <input
          type="radio"
          id="cbor"
          name="format"
          checked={checkedOption === "cbor"}
          onChange={() => updateCheckedOption("cbor")}
        />
        <label htmlFor="cbor">CBOR</label>
      </div>
    </div>
  );
}
