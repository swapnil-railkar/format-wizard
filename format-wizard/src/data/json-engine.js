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
  DEFAULT_OUTPUT,
} from "./operation-constants";

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
    default:
      return DEFAULT_OUTPUT;
  }
}

export function formatJSON(json) {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export function toYAML(json) {
  return yaml.dump(json, {
    indent: 2,
    lineWidth: -1,
    noRefs: true, // avoid YAML anchors
  });
}

export function toXML(json) {
  return js2xml({ root: json }, { compact: true, spaces: 2 });
}

export function toJson5(json) {
  return JSON5.stringify(json, null, 2);
}

export function toHjson(json) {
  return Hjson.stringify(json, {
    quotes: "min",
    space: 2,
  });
}
