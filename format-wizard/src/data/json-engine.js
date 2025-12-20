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
} from "./operation-constants";
import json2toml from "json2toml";
import { Position } from "reactflow";

const NODE_Y_SPACING = 60;
const ARRAY_ITEM_SPACING = 45;
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
      return formatJSON(input);
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
  return JSON.stringify(JSON.parse(json), null, 2);
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

export function toGraph(
  obj,
  parentId = "root",
  nodes = [],
  edges = [],
  depth = 0
) {
  const primitives = [];
  const nestedEntries = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && typeof value === "object") {
      nestedEntries.push([key, value]);
    } else {
      primitives.push(`${key}: ${value}`);
    }
  });

  // 1️⃣ Create node for current object's DATA
  nodes.push({
    id: parentId,
    data: {
      label: primitives.join("\n") || "(object)",
    },
    position: {
      x: depth * 300,
      y: nodes.length * 120,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  // 2️⃣ Handle nested objects & arrays
  nestedEntries.forEach(([key, value], index) => {
    const containerId = `${parentId}-${key}-${index}`;

    // Edge from parent data → container (key node)
    edges.push({
      id: `e-${parentId}-${containerId}`,
      source: parentId,
      target: containerId,
    });

    // 📦 ARRAY
    if (Array.isArray(value)) {
      // Array key node
      nodes.push({
        id: containerId,
        data: { label: `${key} [${value.length}]` },
        position: {
          x: (depth + 1) * 300,
          y: nodes.length * 120,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      value.forEach((item, i) => {
        const itemId = `${containerId}-item-${i}`;

        edges.push({
          id: `e-${containerId}-${itemId}`,
          source: containerId,
          target: itemId,
        });

        if (item !== null && typeof item === "object") {
          toGraph(item, itemId, nodes, edges, depth + 2);
        } else {
          nodes.push({
            id: itemId,
            data: { label: String(item) },
            position: {
              x: (depth + 2) * 300,
              y: nodes.length * 120,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });
        }
      });
    }

    // 🧱 OBJECT  ✅ FIXED PART
    else {
      // Object key node (e.g. "education")
      nodes.push({
        id: containerId,
        data: { label: key },
        position: {
          x: (depth + 1) * 300,
          y: nodes.length * 120,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      const dataNodeId = `${containerId}-data`;

      // Edge: key node → data node
      edges.push({
        id: `e-${containerId}-${dataNodeId}`,
        source: containerId,
        target: dataNodeId,
      });

      // Recurse into object data
      toGraph(value, dataNodeId, nodes, edges, depth + 2);
    }
  });

  return { nodes, edges };
}
