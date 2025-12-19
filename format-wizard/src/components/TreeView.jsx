import { useMemo } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { toGraph } from "../data/json-engine";
import "../App.css";

export default function TreeView({ jsonStr }) {
  const { nodes, edges } = useMemo(() => {
    return toGraph(JSON.parse(jsonStr));
  }, [jsonStr]);

  return (
    <div className="tree-view">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </div>
  );
}
