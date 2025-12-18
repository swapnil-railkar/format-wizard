import yaml from "js-yaml";
import { js2xml } from "xml-js";

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

export function formatJSON(json) {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export function toYAML(jsonStr) {
  const json = JSON.parse(jsonStr);
  return yaml.dump(json, {
    indent: 2,
    lineWidth: -1,  
    noRefs: true     // avoid YAML anchors
  });
}

export function toXML(jsonStr) {
  const json = JSON.parse(jsonStr);
  return js2xml(
    { root: json },
    { compact: true, spaces: 2 }
  );
}
