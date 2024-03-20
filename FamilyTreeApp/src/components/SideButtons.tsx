import Button1 from "../../assets/tree-structure.svg";
import { Component, createMemo } from "solid-js";
import css from "../styles/sidebuttons.module.scss";
import { NodeflowNodeData, Optional } from "nodeflow-lib";
import {collapseChildrenNodeStructure, collapseParentNodeStructure, setupChildren, setupParents} from "../utils";
import { nodeflowData } from "../App";

const SideButtons: Component = () => {
  const node = createMemo<Optional<NodeflowNodeData>>(
    () => nodeflowData.mouseData.heldNodes.at(-1)?.node,
  );

  return (
    <div class={css.sideButtonContainer}>
      <img
        src={Button1}
        draggable={false}
        alt="Button 1"
        width="48"
        height="48"
        style={{ rotate: "90deg", cursor: "pointer"}}
        onClick={() => {
          setupParents(node()!.id);
          setupChildren(node()!.id);
        }}
      />
      <img
        src={Button1}
        draggable={false}
        alt="Button 1"
        width="48"
        height="48"
        style={{ rotate: "-90deg", cursor: "pointer"}}
        onClick={() => {
          collapseParentNodeStructure(node()!.id);
          collapseChildrenNodeStructure(node()!.id);
        }}
      />
    </div>
  );
};

export default SideButtons;
