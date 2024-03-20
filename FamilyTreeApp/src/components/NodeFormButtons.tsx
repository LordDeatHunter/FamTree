import { Component, Show } from "solid-js";
import { NodeflowNodeData, Optional } from "nodeflow-lib";
import { FormDataType } from "./SidebarContent";
import formStyle from "../styles/form.module.scss";
import { cleanInput, updateFamilyMemberNode } from "../utils";
import nodeCss from "../styles/node.module.scss";
import {
  createNewMember,
  deleteMember,
  modifyFamilyMember,
  Person,
} from "../requests";
import { nodeflowData } from "../App";

interface NodeFormButtonsProps {
  mode: "add" | "empty" | "view" | "edit";
  nodeData: Optional<FormDataType>;
  formData: Optional<FormDataType>;
  setFormData: (data: Optional<FormDataType>) => void;
}

const AddButton: Component<{ onClick: () => void }> = (props) => (
  <button onClick={() => props.onClick()}>Add</button>
);

const NodeFormButtons: Component<NodeFormButtonsProps> = (props) => {
  const onAdd = () => props.setFormData({ name: "" } as FormDataType);
  const onCancel = () => props.setFormData(undefined);
  const onEdit = () => props.setFormData({ ...props.nodeData! });

  const handlePostDelete = () => {
    nodeflowData.removeNode(props.nodeData!.id);
    props.setFormData(undefined);
  };

  const handlePostCreate = (node?: NodeflowNodeData) => {
    nodeflowData.mouseData.clearSelections();
    node?.select(node?.getCenter());
    props.setFormData(undefined);
  };
  const handlePostUpdate = (data: Person | void) => {
    if (!data) return;

    const node = nodeflowData.nodes.get(data.id);
    if (!node) return;

    if (node.customData.gender !== data.gender) {
      node.css = {
        normal: data.gender === "M" ? nodeCss.maleNode : nodeCss.femaleNode,
        selected:
          data.gender === "M"
            ? nodeCss.selectedMaleNode
            : nodeCss.selectedFemaleNode,
      };

      node.getConnector("O")!.css =
        data.gender === "M"
          ? nodeCss.maleOutputConnector
          : nodeCss.femaleOutputConnector;
    }

    // TODO: update child connections
    // nodeflowData.removeOutgoingConnections(data.id);

    updateFamilyMemberNode(data);
    props.setFormData(undefined);
  };

  const onSaveNewNode = () => {
    if (!props.formData?.name || !props.formData?.gender) return;
    createNewMember(
      {
        name: cleanInput(props.formData!.name),
        gender: props.formData!.gender,
      },
      undefined,
      nodeflowData.center(),
    ).then(handlePostCreate);
  };
  const onUpdateNode = () => {
    const nodeId = props.formData!.id;
    const node = nodeflowData.nodes.get(nodeId);

    if (node === undefined) {
      props.setFormData(undefined);
      return;
    }

    const currentData = node.customData;

    const filteredData = Object.fromEntries(
      Object.entries(props.formData!)
        .map(([key, value]) => [
          key,
          typeof value === "string" ? cleanInput(value) : value,
        ])
        .filter(
          ([key, value]) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            key !== "id" && !!value && value !== currentData[key],
        ),
    );

    if (Object.keys(filteredData).length === 0) {
      props.setFormData(undefined);
      return;
    }

    modifyFamilyMember({
      id: nodeId,
      name: filteredData.name,
      gender: filteredData.gender,
    }).then(handlePostUpdate);
  };

  const onDeleteNode = () => {
    deleteMember(props.nodeData!.id).then(handlePostDelete);
  };

  return (
    <div class={formStyle.formButtonContainer}>
      <Show when={props.mode === "empty"}>
        <AddButton onClick={onAdd} />
      </Show>
      <Show when={props.mode === "add"}>
        <button onClick={onSaveNewNode}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </Show>
      <Show when={props.mode === "view"}>
        <AddButton onClick={onAdd} />
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDeleteNode}>Delete</button>
      </Show>
      <Show when={props.mode === "edit"}>
        <button onClick={onUpdateNode}>Save</button>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onDeleteNode}>Delete</button>
      </Show>
    </div>
  );
};

export default NodeFormButtons;
