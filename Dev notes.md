#### Why FormatWizard ?
FormatWizard aims to be one stop JSON toolkit, offering many JSON related utilities such as format converter, Tree (Graph) view of JSON, JSON comparison, JSON query executor etc. So instead of going through loads of apps to do intended work, one can find most utilities in single place.
Also looks good on portfolio (I hope so).

---
#### What does it do?
1. BEAUTIFY given JSON
2. MINIFY given JSON
3. convert JSON to YAML
4. convert JSON to XML
5. convert JSON to JSON5
6. convert JSON to HJSON
7. convert JSON to TOML
8. TREE_VIEW (Show given JSON as graph)
9. JSON_VIEW (Allows user to perform function 1-7 and 10)
10. Query JSON (Allows user to query given JSON)
11. JSON Comparison (Compare two JSONs, gives result in 'modify', 'add', 'remove' along with changed path).

---
#### Rendering the JSON-view
The **JSON-view** mainly concerns about JSON-related activities like beautify-minify, format conversions etc.

To get input JSON from user, `CodeMirror` provided by `@uiw/react-codemirror` is used. Data is read as a string. Inputted data is read per key-stroke and immediately gets validated for valid JSON format, making JSON validation a default functionality of the app. If the input until current key-stroke is not valid, the error is shown on the `CodeMirror` screen designated for output. The output `CodeMirror` is not editable.

Following list shows npm helper packages installed to do conversion work
1. BEAUTIFY :
2. MINIFY : Both 1 and 2 are handled by `JSON.stringify`
3. YAML : `js-yaml`
4. XML : `xml-js`
5. JSON5 : `json5`
6. HJSON : `hjson`
7. TOML : `json2toml`
8. Query JSON : `jsonpath-plus`

Internal working of above activities is handled by internal or third party libraries.

---
#### Rendering the Tree-view
Tree-view in itself is just an output screen, showing graph version of JSON inputted in JSON-view. Tree-view is not independent component of app but work alongside JSON view, as an extension, to show graph view of JSON.

It uses ReactFlow (ReactFlow is used to render graphs. The integration focuses on converting JSON into the node–edge model expected by ReactFlow) to render a graph, ReactFlow requires an array of nodes and edges where each node is fixated on an x, y plane. Edges connect source and target nodes.

Following is the algorithm used to convert JSON to array of nodes and edges.
```
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
```

Following is the explanation for above algorithm : 

This algorithm converts a **JSON object into a graph structure** consisting of **nodes and edges**, suitable for rendering with graph libraries such as React Flow.
The goal is to transform hierarchical JSON into a **visual, navigable graph** where:
- Objects and arrays become **connected nodes**
- Relationships become **edges**
- Primitive values are grouped and displayed clearly
##### High-Level Idea
For each JSON object:
1. Create a **node for the current key (parent)**
2. Separate **primitive values** from **nested structures**
3. Group primitive values into a single “data” node
4. Create nodes for nested objects and arrays
5. Recursively repeat the process

This ensures:
- Clean layout
- Minimal node clutter
- Clear parent–child relationships

##### Function signature 
`toGraph(obj, parentId = "root", nodes = [], edges = [])`
##### Parameters
- `obj` → Current JSON object to process
- `parentId` → ID of the parent node in the graph
- `nodes` → Accumulator array for graph nodes
- `edges` → Accumulator array for graph edges

The function is **recursive** and mutates `nodes` and `edges` in place.
##### Step by step breakdown
1. Classifying JSON Entries
```
	const primitives = [];
	const nestedEntries = [];
```
Each key–value pair is classified into one of two categories:
##### Primitive values
- `string`
- `number`
- `boolean`
- `null`
These are collected into `primitives`.
##### Nested values
- objects `{}`
- arrays `[]`
These are collected into `nestedEntries`.

**Why?**  
Primitive values don’t need their own child graph. Grouping them reduces visual noise.

2. Creating parent node
```
if (!nodes.find((n) => n.id === parentId)) {
  nodes.push({ ... });
}
```
Every object in the JSON has a **parent key node**.
- The root object always has a `"root"` node
- Nested objects derive their label from the key name
- Duplicate nodes are avoided by checking `id`

**Purpose:**  
This node represents the current JSON object in the graph hierarchy.

3. Creating a 'Data Node' for primitives
```
 if (primitives.length > 0) {
  const dataId = `${parentId}__data`;
  nodes.push({ ... });
  edges.push({ ... });
}
```
All primitive key-value pairs are rendered inside one grouped data node.
**Why this design?**
- Prevents explosion of leaf nodes
- Keeps the graph readable

4. Creating nodes for 'Nested Keys'
```
nestedEntries.forEach(([key, value], index) => {
  const keyNodeId = `${parentId}-${key}-${index}`;
});
```
For each nested entry
- A node is created for the key
- An edge is created from parent to this key
- Arrays show their size `key[n]` for clarity

This preserves
- JSON hierarchy
- Order
- Uniqueness of node IDs

5. Handling arrays
```
if (Array.isArray(value)) {
  value.forEach((item, i) => { ... });
}
```

**Rules**
- The array key is parent node.
- Each array item becomes a child node
- Items are connected directly to the array node

**Array item cases** :
- Object item : recursively processed
- Primitive item : rendered as value node.

6. Handling nested objects
```
else {
  toGraph(value, keyNodeId, nodes, edges);
}
```
For nested objects:
- Recursively call the function
- The current key node becomes the new parent

Recursion continues until all level of JSON are processed.

---

#### Rendering the Comparison-view
Comparison view have three designated `CodeMirror` screen, JSON inputted in first screen is treated as base JSON. Second screen is treated as edited JSON. Both screens are editable and value is validated on every key-stroke. Third screen shows the output of comparison if both JSONs are valid otherwise it shows error message.

As stated above, `jsondiffpatch` library is used to get difference between original and updated JSONs.

**Why `jsondiffpatch` ?**
	`jsondiffpatch` finds and describes the differences between two JSON objects.

**What is actually does**
Given :
- an original JSON
- an updated JSON

`jsondiffpatch` :
- compares them structurally
- detects what changed
- produces delta object that represents :
- added fields
- removed fields
- modified values
- nested changes

**Usage in FormatWizard** :
```
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
	    else if (Array.isArray(value) && value[1] === 0 && value[2] === 0){
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

```

Following is the explanation for above algorithm : 

1. Parse JSON strings
```
const baseJSON = JSON.parse(baseJSONStr);
const updatedJSON = JSON.parse(updatedJSONStr);
```
- Converts input strings to JavaScript objects
- Throws an error is either JSON is invalid (both input strings are sanitized before this function is called.)

2. Generate a structural diff
```
const delta = diff(baseJSON, updatedJSON);
```

`diff` function provided by `jsondiffpatch` is used get structural differences between two JSONs.

3. Format the extracted differences to show as output (will cover this shortly)
4. Beautify the output JSON from above step and return it to produce output.
```
return formatJSON(difference);
```


Formatting the extracted differences to show as output 
```
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
	    else if (Array.isArray(value) && value[1] === 0 && value[2] === 0){
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
```

Above function converts the `jsondiffpatch` delta into a flat, human-readable list of changes, each with:
- The JSON path
- The type of change
- The old and/or new value

1. Initialize result container
```
let diffs = [];
```
To collect all detected differences.

2. Iterate through delta keys
```
for (const key in delta) {
```
Each key represents a changed property or array index.

3. Build the JSON path
```
const isIndex = /^\d+$/.test(key);
const path = isIndex
  ? `${basePath}[${key}]`
  : `${basePath}.${key}`;
```

- Numeric keys → array index (`[0]`)
- String keys → object property (`.name`)

This produces accurate JSONPaths like:
- `$.users[0].email`
- `$.config.port`

4. Detect change types 
**Modified Value**
```
if (Array.isArray(value) && value.length === 2)
```
Meaning :
- value existed before
- value exists now
- value changed

**Added Value**
```
else if (Array.isArray(value) && value.length === 1)
```
Meaning:
- value did not exist in base JSON
- added in updated JSON

**Removed Value**
```
else if (Array.isArray(value) && value[1] === 0 && value[2] === 0)
```
Meaning:
- value existed in base JSON
- removed in updated JSON

**Nested differences**
```
else if (typeof value === "object") {
  diffs = diffs.concat(extractDiffs(value, path));
}
```
If the value itself is an object:
- It contains deeper diffs
- Recursively process it
- Append results to the list

This is what allows **deep comparison**.

---
#### Non-goals
- The app does not aim to replace full IDEs or schema-driven tools.
- Graph view is intended for visualization, not editing.
- No backend or persistence layer is involved.
---
#### Scribbles
- FormatWizard is static web-app, hosted AWS S3 bucket.
- Access the app : [http://format-wizard-261225.s3-website.ap-south-1.amazonaws.com/](http://format-wizard-261225.s3-website.ap-south-1.amazonaws.com/ "http://format-wizard-261225.s3-website.ap-south-1.amazonaws.com/")
- For any query or issue, drop a mail to `swapnilrailkar01@gmail.com` 

