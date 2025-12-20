import { useMemo } from "react";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

import { toGraph } from "../data/json-engine.jsx";
import "../App.css";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

function layoutWithDagre(nodes, edges) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 140, // ⬅️ vertical space between siblings
    ranksep: 180, // ⬅️ horizontal space between levels
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
      sourcePosition: "right",
      targetPosition: "left",
    };
  });
}

export default function TreeView({ jsonStr }) {
  const { nodes, edges } = useMemo(() => {
    const graph = toGraph(JSON.parse(jsonStr));
    return {
      nodes: layoutWithDagre(graph.nodes, graph.edges),
      edges: graph.edges,
    };
  }, [jsonStr]);

  return (
    <div className="tree-view">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        defaultEdgeOptions={{
          style: { stroke: "#54a0ff", strokeWidth: 2 },
        }}
      />
    </div>
  );
}
