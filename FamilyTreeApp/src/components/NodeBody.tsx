import { Component } from "solid-js";
import { NodeflowNodeData } from "nodeflow-lib";
import nodeCss from "../styles/node.module.scss";

const NodeBody: Component<{ node: NodeflowNodeData }> = (props) => (
  <p class={nodeCss.nodeFont}>{props.node.customData?.name}</p>
);

export default NodeBody;
