import { Component, createMemo, For, Show } from "solid-js";
import { NodeflowNodeData } from "nodeflow-lib";

const displayContainer =
  "flex flex-col gap-6 items-center mb-4 w-full h-full [&>h2]:w-full [&>h2]:text-center";

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
    <div class={displayContainer}>
      <h2>Selected Node</h2>
      <div class="display-field">
        <p>Name</p>
        <p>{props.nodeData.customData.name}</p>
      </div>
      <div class="display-field">
        <p>Gender</p>
        <p
          class={
            props.nodeData.customData.gender === "F"
              ? "text-female-dark"
              : "text-male-dark"
          }
        >
          {props.nodeData.customData.gender === "F" ? "Female" : "Male"}
        </p>
      </div>
      <div class="flex w-full">
        <div class="display-field w-full px-6">
          <p>Mother</p>
          <p
            onClick={() => {
              mother()?.nodeflow.mouseData.clearSelections();
              mother()?.select();
            }}
            classList={{
              "valid-mother": !!mother(),
              "fill-invalid-parent": !mother(),
            }}
          >
            {mother()?.customData.name || "Unknown"}
          </p>
        </div>
        <div class="display-field w-full px-6">
          <p>Father</p>
          <p
            onClick={() => {
              father()?.nodeflow.mouseData.clearSelections();
              father()?.select();
            }}
            classList={{
              "valid-father": !!father(),
              "fill-invalid-parent": !father(),
            }}
          >
            {father()?.customData.name || "Unknown"}
          </p>
        </div>
      </div>
      <div class="display-field p-0 w-full h-full">
        <p>Children</p>
        <Show when={children()?.length > 0} fallback={<p>None</p>}>
          <div class="flex flex-col gap-2 items-center border border-border rounded-lg p-2 w-[70%] h-[250px] mx-auto mt-1.5 mb-8 overflow-x-hidden overflow-y-auto">
            <For each={children()}>
              {(child) => (
                <p
                  onClick={() => {
                    child.nodeflow.mouseData.clearSelections();
                    child.select();
                  }}
                  class="text-border cursor-pointer transition-[color] duration-100 ease-in-out text-2xl m-0 hover:text-child-hover"
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
