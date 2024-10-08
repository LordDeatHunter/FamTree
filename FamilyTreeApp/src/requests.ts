import { createFamilyMemberNode } from "./utils";
import { NodeflowNodeData, Vec2 } from "nodeflow-lib";

const HOST = import.meta.env.VITE_HOST;
const GET_ALL_MEMBERS = "/api/familytree/get_all_members";
const GET_MEMBER = "/api/familytree/get_member";
const ADD_MEMBER = "/api/familytree/add_member";
const MODIFY_MEMBER = "/api/familytree/modify_member";
const DELETE_MEMBER = "/api/familytree/delete_member";
const GET_PARENTS = "/api/familytree/get_parents";
const GET_CHILDREN = "/api/familytree/get_children";

export interface Person {
  gender: CustomNodeflowDataType["gender"];
  id: string;
  name: string;
  fatherId?: string;
  motherId?: string;
}

export interface BackendPerson {
  currentName: string;
  gender: "Female" | "Male";
  id: string;
  father?: string;
  mother?: string;
}

export const getRequestURL = (path: string) => `${HOST}${path}`;

export const fetchAllData = async (): Promise<Array<Person>> =>
  await fetch(getRequestURL(GET_ALL_MEMBERS))
    .then((response) => response.json())
    .then((data: Array<BackendPerson>) => data.map(mapFromBackendPerson));

export const fetchPerson = async (id: string): Promise<Person> =>
  await fetch(getRequestURL(`${GET_MEMBER}/${id}`)).then(mapResponse);

export const fetchParents = async (
  id: string,
): Promise<[Person | null, Person | null]> =>
  await fetch(getRequestURL(`${GET_PARENTS}/${id}`))
    .then((response) => response.json())
    .then((data: [BackendPerson | null, BackendPerson | null]) =>
      data.map((person) => (person ? mapFromBackendPerson(person) : person)),
    )
    .then(([father, mother]) => [father, mother]);

export const fetchChildren = async (id: string): Promise<Array<Person>> =>
  await fetch(getRequestURL(`${GET_CHILDREN}/${id}`))
    .then((response) => response.json())
    .then((data: Array<BackendPerson>) => data.map(mapFromBackendPerson));

export const modifyFamilyMember = async (
  person: Partial<Person>,
): Promise<Person | void> =>
  await fetch(getRequestURL(MODIFY_MEMBER), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapToPartialBackendPerson(person)),
  }).then(mapResponse);

export const setFather = async (childId: string, fatherId: string) =>
  await fetch(getRequestURL(MODIFY_MEMBER), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: childId, fatherId }),
  }).then(mapResponse);

export const setMother = async (childId: string, motherId: string) =>
  await fetch(getRequestURL(MODIFY_MEMBER), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: childId, motherId }),
  }).then(mapResponse);

export const createNewMember = async (
  nodeData?: Partial<CustomNodeflowDataType>,
  parent?: NodeflowNodeData,
  position = Vec2.zero(),
) => {
  const gender = nodeData?.gender ?? (Math.random() > 0.5 ? "M" : "F");

  const person: Parameters<typeof addMember>[0] = {
    currentName: nodeData?.name ?? "Unknown",
    gender: gender === "M" ? "Male" : "Female",
  };

  if (parent) {
    if (parent.customData.gender === "M") {
      person.father = parent.id;
    } else {
      person.mother = parent.id;
    }
  }

  return addMember(person).then((data) => {
    if (!data) return;
    return createFamilyMemberNode(
      data.id,
      data.name,
      data.gender,
      position,
      data.fatherId,
      data.motherId,
    );
  });
};

export const addMember = async (
  person: Omit<BackendPerson, "id">,
): Promise<Person | void> =>
  await fetch(getRequestURL(ADD_MEMBER), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  }).then(mapResponse);

export const deleteMember = async (id: string) =>
  await fetch(getRequestURL(`${DELETE_MEMBER}/${id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const mapResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const person = await response.json();
  return mapFromBackendPerson(person);
};

export const mapToBackendPerson = (person: Person): BackendPerson => ({
  currentName: person.name,
  id: person.id,
  gender: person.gender === "F" ? "Female" : "Male",
  father: person.fatherId,
  mother: person.motherId,
});

export const mapToPartialBackendPerson = (
  person: Partial<Person>,
): Partial<BackendPerson> => {
  const partial = {
    currentName: person.name,
    id: person.id,
    gender: mapGenderToBackend(person.gender),
    father: person.fatherId,
    mother: person.motherId,
  };
  return Object.fromEntries(
    Object.entries(partial).filter(([_, value]) => value !== undefined),
  ) as Partial<BackendPerson>;
};

export const mapGenderToBackend = (gender?: "M" | "F") => {
  switch (gender) {
    case "M":
      return "Male";
    case "F":
      return "Female";
    default:
      return undefined;
  }
};

export const mapFromBackendPerson = (person: BackendPerson): Person => ({
  name: person.currentName,
  id: person.id,
  fatherId: person.father,
  motherId: person.mother,
  gender: person.gender === "Female" ? "F" : "M",
});
