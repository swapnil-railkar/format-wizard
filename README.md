# 🧙‍♂️ FormatWizard

**FormatWizard** is a lightweight web application that helps developers **work with JSON efficiently**.
It focuses on everyday JSON tasks like formatting, conversion, visualization, querying, and comparison, all in one place.

No noise. Just tools you actually use.

Try it yourself : http://format-wizard-261225.s3-website.ap-south-1.amazonaws.com/

------

## 🚀 Current Features

### 🧹 JSON Formatting

* **Beautify JSON**
  Converts minified or unformatted JSON into a clean, human-readable structure.

* **Minify JSON**
  Compresses JSON by removing whitespace for optimized storage or transmission.

---

### 🔁 JSON Conversions

Convert JSON into the following formats:

* **YAML**
* **XML**
* **JSON5**
* **HJSON**
* **TOML**

All conversions preserve the original data structure and values.

---

### 🌳 JSON Visualization

* **Tree View**
  Displays JSON as a tree/graph for easy exploration of nested structures.

* **JSON View**
  Displays formatted JSON with syntax highlighting for better readability.

---

### 🔍 JSON Query

* Query JSON using **JSONPath-style expressions**
* Instantly extract specific values or nodes from large or deeply nested JSON objects

Example:

```text
$.users[*].email
```

---

### 🔀 JSON Comparison

* Compare two JSON objects side by side
* Highlights:

  * Added keys
  * Removed keys
  * Modified values
* Useful for API response validation, config changes, and debugging

---

## 🛠️ Tech Stack

* React
* Modern JavaScript (ES6+)
* Code editor with syntax highlighting

---

## 🧪 Use Cases

* Format and validate API responses
* Convert JSON configs to YAML, TOML, or XML
* Inspect deeply nested JSON structures
* Extract specific data using JSON queries
* Compare API responses across environments
* Debug configuration changes quickly

---

## 📌 Philosophy

FormatWizard is built with a simple idea:

`Developers shouldn’t juggle five different tools just to work with JSON.`

Everything here exists because it solves a **real, recurring problem**.
