import Button1 from "../../assets/tree-structure.svg";
import { Component, createMemo } from "solid-js";
import css from "../styles/sidebuttons.module.scss";
import {
  collapseChildrenNodeStructure,
  collapseParentNodeStructure,
  setupChildren,
  setupParents,
} from "../utils";
import { nodeflowData } from "../App";
import { NodeflowNodeData, Optional } from "nodeflow-lib";

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
        style={{ rotate: "90deg", cursor: "pointer", "user-select": "none" }}
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
        style={{ rotate: "-90deg", cursor: "pointer", "user-select": "none" }}
        onClick={() => {
          collapseParentNodeStructure(node()!.id);
          collapseChildrenNodeStructure(node()!.id);
        }}
      />
    </div>
  );
};

export default SideButtons;
