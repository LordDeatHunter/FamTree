import {getAllFamilyMembers} from './dataFetch.js';

let editor;

function onClick(e) {
    editor.dispatch('click', e);

    editor.first_click = e.target;
    editor.ele_selected = e.target;

    if (e.target.closest(".drawflow_content_node") != null) {
        editor.ele_selected = e.target.closest(".drawflow_content_node").parentElement;
    }

    switch (editor.ele_selected.classList[0]) {
        case 'drawflow-node':
            if (editor.node_selected != null) {
                editor.node_selected.classList.remove("selected");
                if (editor.node_selected != editor.ele_selected) {
                    editor.dispatch('nodeUnselected', true);
                }
            }
            if (editor.connection_selected != null) {
                editor.connection_selected.classList.remove("selected");
                editor.removeReouteConnectionSelected();
                editor.connection_selected = null;
            }
            if (editor.node_selected != editor.ele_selected) {
                editor.dispatch('nodeSelected', editor.ele_selected.id.slice(5));
            }
            editor.node_selected = editor.ele_selected;
            editor.node_selected.classList.add("selected");
            if (!editor.draggable_inputs) {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT' && e.target.hasAttribute('contenteditable') !== true) {
                    editor.drag = true;
                }
            } else {
                if (e.target.tagName !== 'SELECT') {
                    editor.drag = true;
                }
            }
            break;
        case 'parent-drawflow':
            if (editor.node_selected != null) {
                editor.node_selected.classList.remove("selected");
                editor.node_selected = null;
                editor.dispatch('nodeUnselected', true);
            }
            if (editor.connection_selected != null) {
                editor.connection_selected.classList.remove("selected");
                editor.removeReouteConnectionSelected();
                editor.connection_selected = null;
            }
            editor.editor_selected = true;
            break;
        case 'drawflow':
            if (editor.node_selected != null) {
                editor.node_selected.classList.remove("selected");
                editor.node_selected = null;
                editor.dispatch('nodeUnselected', true);
            }
            if (editor.connection_selected != null) {
                editor.connection_selected.classList.remove("selected");
                editor.removeReouteConnectionSelected();
                editor.connection_selected = null;
            }
            editor.editor_selected = true;
        case 'input':

            break;
        // case 'point':
        //     editor.drag_point = true;
        //     editor.ele_selected.classList.add("selected");
        //     break;
        default:
            break;
    }
    if (e.type === "touchstart") {
        editor.pos_x = e.touches[0].clientX;
        editor.pos_x_start = e.touches[0].clientX;
        editor.pos_y = e.touches[0].clientY;
        editor.pos_y_start = e.touches[0].clientY;
    } else {
        editor.pos_x = e.clientX;
        editor.pos_x_start = e.clientX;
        editor.pos_y = e.clientY;
        editor.pos_y_start = e.clientY;
    }
    editor.dispatch('clickEnd', e);
}

function setup() {
    let id = document.getElementById("drawflow");
    editor = new Drawflow(id);

    editor.editor_mode = 'edit';
    editor.contextmenu = (_) => {
    };
    editor.key = (_) => {
    };
    const oldClick = editor.click;
    editor.click = (e) => {
        if (editor.editor_mode !== 'edit') {
            oldClick(e);
            return;
        }
        onClick(e, editor);
    }

    editor.start();

    const curvature = 64;
    editor.createCurvature = function (sx, sy, ex, ey, _, __) {
        return ` M  ${sx} ${sy} C ${sx} ${sy + curvature}, ${ex} ${ey - curvature}, ${ex} ${ey}`;
    }
    getAllFamilyMembers().then(data => {
        let ids = [];
        for (let member of data) {
            editor.addNode(member.id, 2, 1, 500, 500, [], {}, getFamilyMemberCardHtml({
                id: member.id,
                name: member.currentName,
                description: member.birthName
            }));
            ids.push(member.id);
        }
        for (let member of data) {
            if (member.father in ids) editor.addConnection(member.father, member.id, 'output_1', 'input_1');
            if (member.mother in ids) editor.addConnection(member.mother, member.id, 'output_1', 'input_2');
        }
        for (let member of data) {
            let currentNode = editor.getNodeFromId(7);
            let [x, y] = [currentNode.pos_x, currentNode.pos_y];
            if (member.father in ids) {
                setPositionRecursively(member.father, x, y, 'left');
            }
            if (member.mother in ids) {
                setPositionRecursively(member.mother, x, y, 'right');
            }
        }
    });
}

const xDistance = 150;
const yDistance = 150;

function setPositionRecursively(id, startX, startY, type) {
    let currentNode = editor.getNodeFromId(id);
    let x = startX;
    let y = startY;
    if (type === 'left') {
        x -= xDistance;
        y -= yDistance;
    } else if (type === 'right') {
        x += xDistance;
        y -= yDistance;
    }
    let nodeId = "node-" + id;
    currentNode.pos_x = x;
    currentNode.pos_y = y;
    document.getElementById(nodeId).style.left = x + "px";
    document.getElementById(nodeId).style.top = y + "px";
    editor.updateConnectionNodes(nodeId);
    if (currentNode.inputs['input_1'].connections.length > 0) {
        setPositionRecursively(currentNode.inputs['input_1'].connections[0].node, x, y, 'left');
    }
    if (currentNode.inputs['input_2'].connections.length > 0) {
        setPositionRecursively(currentNode.inputs['input_2'].connections[0].node, x, y, 'right');
    }
}


function getFamilyMemberCardHtml(data) {
    return `
    <h4 data-bs-toggle="collapse" data-bs-target="#collapse-${data.id}">${data.name}</h2>
    <p class="collapse" id="collapse-${data.id}">${data.description}</p>
    `
}

window.addEventListener('DOMContentLoaded', setup);
window.addEventListener('shown.bs.collapse', e => editor.updateConnectionNodes('node-' + e.target.id.slice("collapse-".length)));
window.addEventListener('show.bs.collapse', e => editor.updateConnectionNodes('node-' + e.target.id.slice("collapse-".length)));
window.addEventListener('hidden.bs.collapse', e => editor.updateConnectionNodes('node-' + e.target.id.slice("collapse-".length)));
window.addEventListener('hide.bs.collapse', e => editor.updateConnectionNodes('node-' + e.target.id.slice("collapse-".length)));