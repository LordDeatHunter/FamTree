export async function getAllFamilyMembers() {
    let response = await fetch(`${window.location.origin}/api/familytree/get_all_members`)
    return await response.json();
}
export async function getFather(uuid) {
    let response = await fetch(`${window.location.origin}/api/familytree/get_father?uuid=${uuid}`)
    return await response.json();
}
export async function getMother(uuid) {
    let response = await fetch(`${window.location.origin}/api/familytree/get_mother?uuid=${uuid}`)
    return await response.json();
}
export async function getParents(uuid) {
    let response = await fetch(`${window.location.origin}/api/familytree/get_parents?uuid=${uuid}`)
    return await response.json();
}