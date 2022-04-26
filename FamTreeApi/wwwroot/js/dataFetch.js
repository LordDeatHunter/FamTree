export async function getAllFamilyMembers() {
    let response = await fetch(`${window.location.origin}/api/familytree/get_all_members`)
    return await response.json();
}