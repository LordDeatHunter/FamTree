import { Component } from "solid-js";
import { NodeflowNodeData } from "nodeflow-lib";
import { nodeFont } from "../styles/nodeClasses";

const NodeBody: Component<{ node: NodeflowNodeData }> = (props) => (
  <p class={nodeFont}>{props.node.customData?.name}</p>
);

export default NodeBody;
