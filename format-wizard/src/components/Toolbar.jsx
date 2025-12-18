import { BEAUTIFY, CBOR, CSV, HJSON, JSON5, MSGPACK, XML, YAML } from "../data/operation-constants";

export default function Toolbar({operation, selectOperation}) {

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
          id="csv"
          name="format"
          checked={operation === CSV}
          onChange={() => selectOperation(CSV)}
        />
        <label htmlFor="csv">CSV</label>

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
          id="msgpack"
          name="format"
          checked={operation === MSGPACK}
          onChange={() => selectOperation(MSGPACK)}
        />
        <label htmlFor="msgpack">MessagePack</label>

        <input
          type="radio"
          id="cbor"
          name="format"
          checked={operation === CBOR}
          onChange={() => selectOperation(CBOR)}
        />
        <label htmlFor="cbor">CBOR</label>
      </div>
    </div>
  );
}
