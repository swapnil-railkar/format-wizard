import yaml from "js-yaml";
import { js2xml } from "xml-js";
import JSON5 from "json5";
import Hjson from "hjson";
import {
  BEAUTIFY,
  JSON5 as JSON5OP,
  XML,
  YAML,
  HJSON,
  TOML as TOMLOP,
  DEFAULT_OUTPUT,
  MINIFY,
} from "./operation-constants";
import json2toml from "json2toml";
import { Position } from "@xyflow/react";
import { JSONPath } from "jsonpath-plus";
import { diff } from "jsondiffpatch";

export function isValidJSON(json) {
  try {
    JSON.parse(json);
    return {
      valid: true,
    };
  } catch (error) {
    return {
      valid: false,
      message: error.message,
    };
  }
}

export function convertJSON(target, input) {
  const json = JSON.parse(input);
  console.log("inside engine : ", target);
  switch (target) {
    case BEAUTIFY:
      return formatJSON(json);
    case MINIFY:
      return minifyJSON(json);
    case YAML:
      return toYAML(json);
    case XML:
      return toXML(json);
    case JSON5OP:
      return toJson5(json);
    case HJSON:
      return toHjson(json);
    case TOMLOP:
      return toToml(json);
    default:
      return DEFAULT_OUTPUT;
  }
}

function formatJSON(json) {
  return JSON.stringify(json, null, 2);
}

function minifyJSON(json) {
  return JSON.stringify(json);
}
function toYAML(json) {
  return yaml.dump(json, {
    indent: 2,
    lineWidth: -1,
    noRefs: true, // avoid YAML anchors
  });
}

function toXML(json) {
  return js2xml({ root: json }, { compact: true, spaces: 2 });
}

function toJson5(json) {
  return JSON5.stringify(json, null, 2);
}

function toHjson(json) {
  return Hjson.stringify(json, {
    quotes: "min",
    space: 2,
  });
}

function hasNullValue(value) {
  if (value === null) return true;

  if (Array.isArray(value)) {
    return value.some(hasNullValue);
  }

  if (typeof value === "object") {
    return Object.values(value).some(hasNullValue);
  }

  return false;
}

function toToml(json) {
  if (hasNullValue(json)) {
    return "JSON contains null values";
  }
  return json2toml(json, {
    indent: 2,
    newlineAfterSection: true,
  });
}

export function returnResultForQuery(input, query) {
  const json = JSON.parse(input);
    return JSONPath({
      path: query,
      json: json,
    });
}

export function getJSONDifference(baseJSONStr, updatedJSONStr) {
  const baseJSON = JSON.parse(baseJSONStr);
  const updatedJSON = JSON.parse(updatedJSONStr);
  const delta = diff(baseJSON, updatedJSON);
  const difference = extractDiffs(delta);
  return formatJSON(difference);
}

function extractDiffs(delta, basePath = "$") {
  let diffs = [];

  for (const key in delta) {
    if (key === "_t") continue;

    const value = delta[key];
    const isIndex = /^\d+$/.test(key);

    const path = isIndex
      ? `${basePath}[${key}]`
      : `${basePath}.${key}`;

    // MODIFIED (existed in A, changed in B)
    if (Array.isArray(value) && value.length === 2) {
      diffs.push({
        path,
        type: "modified",
        from: value[0],
        to: value[1]
      });
    }

    // ADDED (did not exist in A, added in B)
    else if (Array.isArray(value) && value.length === 1) {
      diffs.push({
        path,
        type: "added",
        to: value[0]
      });
    }

    // REMOVED (existed in A, removed in B)
    else if (Array.isArray(value) && value[1] === 0 && value[2] === 0) {
      diffs.push({
        path,
        type: "removed",
        from: value[0]
      });
    }

    // NESTED
    else if (typeof value === "object") {
      diffs = diffs.concat(extractDiffs(value, path));
    }
  }

  return diffs;
}

export function toGraph(obj, parentId = "root", nodes = [], edges = []) {
  const primitives = [];
  const nestedEntries = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && typeof value === "object") {
      nestedEntries.push([key, value]);
    } else {
      primitives.push(
        <div key={key} className="kv-line">
          <span className="json-key">{key}</span>
          <span className="json-sep">: </span>
          <span className="json-value">{String(value)}</span>
        </div>
      );
    }
  });

  // 1️⃣ Parent key node (always exists)
  if (!nodes.find((n) => n.id === parentId)) {
    nodes.push({
      id: parentId,
      data: {
        label:
          parentId === "root" ? (
            <span className="json-root">root</span>
          ) : (
            <span className="json-key">{parentId.split("-").pop()}</span>
          ),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
  }

  // 2️⃣ Data node (primitives only)
  if (primitives.length > 0) {
    const dataId = `${parentId}__data`;

    nodes.push({
      id: dataId,
      data: {
        label: <div className="data-node">{primitives}</div>,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    edges.push({
      id: `e-${parentId}-${dataId}`,
      source: parentId,
      target: dataId,
    });
  }

  // 3️⃣ Nested keys (objects & arrays)
  nestedEntries.forEach(([key, value], index) => {
    const keyNodeId = `${parentId}-${key}-${index}`;

    nodes.push({
      id: keyNodeId,
      data: {
        label: (
          <span className="json-key">
            {Array.isArray(value) ? `${key} [${value.length}]` : key}
          </span>
        ),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    edges.push({
      id: `e-${parentId}-${keyNodeId}`,
      source: parentId,
      target: keyNodeId,
    });

    // 📦 ARRAY — items are ALWAYS children of the array key
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        const itemId = `${keyNodeId}-item-${i}`;

        edges.push({
          id: `e-${keyNodeId}-${itemId}`,
          source: keyNodeId,
          target: itemId,
        });

        if (item !== null && typeof item === "object") {
          toGraph(item, itemId, nodes, edges);
        } else {
          nodes.push({
            id: itemId,
            data: {
              label: <span className="json-value">{String(item)}</span>,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });
        }
      });
    }

    // 🧱 OBJECT
    else {
      toGraph(value, keyNodeId, nodes, edges);
    }
  });

  return { nodes, edges };
}
