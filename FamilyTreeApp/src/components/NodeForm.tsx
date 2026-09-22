import { Component, Show } from "solid-js";
import { FormDataType } from "./SidebarContent";
import Male from "../icons/Male";
import Female from "../icons/Female";

const displayContainer =
  "flex flex-col gap-6 items-center mb-4 w-full h-full [&>h2]:w-full [&>h2]:text-center";

const NodeForm: Component<{
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
}> = (props) => (
  <div class={displayContainer}>
    <Show when={props.formData.id} fallback={<h2>Create Node</h2>}>
      <h2>Update Node</h2>
    </Show>
    <div class="display-field">
      <p>Name</p>
      <input
        type="text"
        name="lname"
        placeholder="Name"
        value={props.formData.name}
        onInput={(e) => props.updateFormData({ name: e.target.value })}
      />
    </div>
    <div class="display-field">
      <p>Gender</p>
      <div class="flex justify-between h-[10px] py-2 gap-2">
        <div class="flex justify-between h-6 gap-2 radio-group-male">
          <input
            type="radio"
            id="male"
            name="gender"
            value="M"
            checked={props.formData.gender === "M"}
            onChange={() => props.updateFormData({ gender: "M" })}
          />
          <Male />
          <label for="male">Male</label>
        </div>
        <div class="flex justify-between h-6 gap-2 radio-group-female">
          <input
            type="radio"
            id="female"
            name="gender"
            value="M"
            checked={props.formData.gender === "F"}
            onChange={() => props.updateFormData({ gender: "F" })}
          />
          <Female />
          <label for="female">Female</label>
        </div>
      </div>
    </div>
  </div>
);

export default NodeForm;
