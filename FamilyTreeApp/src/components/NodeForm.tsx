import { Component, Show } from "solid-js";
import { FormDataType } from "./SidebarContent";
import formStyle from "../styles/form.module.scss";
import Male from "../icons/Male";
import Female from "../icons/Female";

const NodeForm: Component<{
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
}> = (props) => (
  <div class={formStyle.displayContainer}>
    <Show when={props.formData.id} fallback={<h2>Create Node</h2>}>
      <h2>Update Node</h2>
    </Show>
    <div class={formStyle.fieldDisplayContainer}>
      <p>Name</p>
      <input
        type="text"
        name="lname"
        placeholder="Name"
        value={props.formData.name}
        onInput={(e) => props.updateFormData({ name: e.target.value })}
      />
    </div>
    <div class={formStyle.fieldDisplayContainer}>
      <p>Gender</p>
      <div class={formStyle.horizontalRadioContainer}>
        <div class={formStyle.horizontalRadioInput}>
          <input
            type="radio"
            id="male"
            name="gender"
            value="M"
            checked={props.formData.gender === "M"}
            onChange={() => props.updateFormData({ gender: "M" })}
            class={formStyle.radioInputMale}
          />
          <Male />
          <label for="male">Male</label>
        </div>
        <div class={formStyle.horizontalRadioInput}>
          <input
            type="radio"
            id="female"
            name="gender"
            value="M"
            checked={props.formData.gender === "F"}
            onChange={() => props.updateFormData({ gender: "F" })}
            class={formStyle.radioInputFemale}
          />
          <Female />
          <label for="female">Female</label>
        </div>
      </div>
    </div>
  </div>
);

export default NodeForm;
