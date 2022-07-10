import {addMember} from './dataFetch.js';

function submitNewMember() {
    const birthName = document.getElementById("birth-name-input").value;
    const currentName = document.getElementById("current-name-input")?.value;
    const birthLocation = document.getElementById("birth-location-input")?.value;
    const currentLocation = document.getElementById("current-location-input")?.value;
    const birthDate = document.getElementById("birth-date-input")?.value;
    const deathDate = document.getElementById("death-date-input")?.value;
    const gender = document.getElementById("gender-input").value;
    const note = document.getElementById("note-input")?.value;
    const father = document.getElementById("father-id-input")?.value;
    const mother = document.getElementById("mother-id-input")?.value;
    addMember(
        birthName,
        currentName,
        birthLocation,
        currentLocation,
        birthDate,
        deathDate,
        gender,
        note,
        father,
        mother
    );
}

function setup() {
    document.getElementById('input-button').onclick = () => submitNewMember();
}

window.addEventListener('DOMContentLoaded', setup);