import { Component, createMemo, For, Show } from "solid-js";
import formStyle from "../styles/form.module.scss";
import { NodeflowNodeData } from "nodeflow-lib";

const NodeDataDisplay: Component<{ nodeData: NodeflowNodeData }> = (props) => {
  const parentNodes = createMemo(() =>
    props.nodeData
      .getAllSourceConnectors()
      .map((connector) => connector.parentNode),
  );
  const mother = createMemo(() =>
    parentNodes().find((node) => node.customData.gender === "F"),
  );
  const father = createMemo(() =>
    parentNodes().find((node) => node.customData.gender === "M"),
  );

  const children = createMemo(() =>
    props.nodeData
      .getAllDestinationConnectors()
      .map((connector) => connector.parentNode)
      .sort((a, b) => a.customData.name.localeCompare(b.customData.name)),
  );

  return (
    <div class={formStyle.displayContainer}>
      <h2>Selected Node</h2>
      <div class={formStyle.fieldDisplayContainer}>
        <p>Name</p>
        <p>{props.nodeData.customData.name}</p>
      </div>
      <div class={formStyle.fieldDisplayContainer}>
        <p>Gender</p>
        <p
          class={
            formStyle[
              props.nodeData.customData.gender === "F"
                ? "femaleFont"
                : "maleFont"
            ]
          }
        >
          {props.nodeData.customData.gender === "F" ? "Female" : "Male"}
        </p>
      </div>
      <div class={formStyle.parentDisplayContainer}>
        <div class={formStyle.parentDisplay}>
          <p>Mother</p>
          <p
            onClick={() => {
              mother()?.nodeflow.mouseData.clearSelections();
              mother()?.select();
            }}
            classList={{
              [formStyle.validMother]: !!mother(),
              [formStyle.invalidParent]: !mother(),
            }}
          >
            {mother()?.customData.name || "Unknown"}
          </p>
        </div>
        <div class={formStyle.parentDisplay}>
          <p>Father</p>
          <p
            onClick={() => {
              father()?.nodeflow.mouseData.clearSelections();
              father()?.select();
            }}
            classList={{
              [formStyle.validFather]: !!father(),
              [formStyle.invalidParent]: !father(),
            }}
          >
            {father()?.customData.name || "Unknown"}
          </p>
        </div>
      </div>
      <div class={formStyle.childrenDisplayContainer}>
        <p>Children</p>
        <Show when={children()?.length > 0} fallback={<p>None</p>}>
          <div class={formStyle.childrenDisplayWindow}>
            <For each={children()}>
              {(child) => (
                <p
                  onClick={() => {
                    child.nodeflow.mouseData.clearSelections();
                    child.select();
                  }}
                  class={formStyle.child}
                >
                  {child.customData.name}
                </p>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default NodeDataDisplay;
