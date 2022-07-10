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

export async function getChildren(uuid) {
    let response = await fetch(`${window.location.origin}/api/familytree/get_children?uuid=${uuid}`)
    return await response.json();
}

export async function addMember(birthName, currentName, birthLocation, currentLocation, birthDate, deathDate, gender, note, fatherId, motherId) {
    let data = {birthName, gender};
    if (!!currentName) data.currentName = currentName;
    if (!!birthLocation) data.birthLocation = birthLocation;
    if (!!currentLocation) data.currentLocation = currentLocation;
    if (!!birthDate) data.birthDate = birthDate;
    if (!!deathDate) data.deathDate = deathDate;
    if (!!note) data.note = note;
    if (!!fatherId) data.father = fatherId;
    if (!!motherId) data.mother = motherId;
    let str = JSON.stringify(data);
    console.log(str);
    let response = await fetch(`${window.location.origin}/api/familytree/add_member`, {
        method: 'POST',
        body: str,
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    return await response.json();
}

export async function modifyMember(uuid, birthName, currentName, birthLocation, currentLocation, birthDate, deathDate, gender, note, fatherID, motherId) {
    let response = await fetch(`${window.location.origin}/api/familytree/modify_member`, {
        method: 'POST',
        body: JSON.stringify({
            uuid,
            birthName,
            currentName,
            birthLocation,
            currentLocation,
            birthDate,
            deathDate,
            gender,
            note,
            fatherID,
            motherId
        })
    })
    return await response.json();
}