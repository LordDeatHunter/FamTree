import Drawflow from '../FamtreeDrawflow/src/drawflow.js';
import {getAllFamilyMembers, getChildren, getParents} from './dataFetch.js';

let editor;
const xDistance = 150;
const yDistance = 150;

async function onClick(e) {
    editor.dispatch('click', e);

    editor.first_click = e.target;
    editor.ele_selected = e.target;

    if (e.target.closest(".drawflow_content_node") != null) {
        editor.ele_selected = e.target.closest(".drawflow_content_node").parentElement;
    }

    let id;
    let currentNode;
    let type;
    switch (editor.ele_selected.classList[0]) {
        case 'drawflow-node':
            if (editor.node_selected != null) {
                editor.node_selected.classList.remove("selected");
                if (editor.node_selected !== editor.ele_selected) {
                    editor.dispatch('nodeUnselected', true);
                }
            }
            if (editor.connection_selected != null) {
                editor.connection_selected.classList.remove("selected");
                editor.removeReouteConnectionSelected();
                editor.connection_selected = null;
            }
            if (editor.node_selected !== editor.ele_selected) {
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
            console.log(editor.node_selected.id);
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
            break;
        case 'input':
            if (editor.ele_selected.classList.length < 2) break;
            id = editor.ele_selected.parentNode.parentNode.id.slice('node-'.length);
            currentNode = editor.getNodeFromId(id);
            type = editor.ele_selected.classList[1];
            if (currentNode.inputs[type].connections.length > 0) {
                floodRemove(id, [currentNode.inputs[type].connections[0].node]);
                break;
            }
            let parent;
            getParents(id).then(parents => {
                if (type === 'input_1' && parents[0] != null) parent = parents[0];
                else if (type === 'input_2' && parents[1] != null) parent = parents[1];
                else return;
                if (!nodeExists(parent.id)) {
                    editor.addNodeWithId(parent.id, 'ft', 2, 1, currentNode.pos_x, currentNode.pos_y, [], {}, getFamilyMemberCardHtml({
                        id: parent.id, name: parent.currentName, description: parent.birthName
                    }));
                    let parentNode = editor.getNodeFromId(parent.id);
                    setPosition(parentNode, currentNode.pos_x, currentNode.pos_y, type);
                }
                getChildren(parent.id).then(children => children.forEach((child, index) => {
                    if (!nodeExists(child.id)) {
                        editor.addNodeWithId(child.id, 'ft', 2, 1, currentNode.pos_x, currentNode.pos_y, [], {}, getFamilyMemberCardHtml({
                            id: child.id, name: child.currentName, description: child.birthName
                        }));
                        let childNode = editor.getNodeFromId(child.id);
                        setPosition(childNode, currentNode.pos_x, currentNode.pos_y, '', index * (xDistance + 50));
                    }
                    if (nodeExists(child.father)) {
                        editor.addConnection(child.father, child.id, 'output_1', 'input_1');
                    }
                    if (nodeExists(child.mother)) {
                        editor.addConnection(child.mother, child.id, 'output_1', 'input_2');
                    }
                }));
            });
            break;
        case 'output':
            if (editor.ele_selected.classList.length < 2) break;
            id = editor.ele_selected.parentNode.parentNode.id.slice('node-'.length);
            currentNode = editor.getNodeFromId(id);
            type = editor.ele_selected.classList[1];
            // TODO: If the current node has children, check if all of them are shown
            if (currentNode.outputs[type].connections.length > 0) {
                floodRemove(id, currentNode.outputs[type].connections.map(c => c.node));
                break;
            }
            getChildren(id).then(children => children.forEach((child, index) => {
                if (!nodeExists(child.id)) {
                    editor.addNodeWithId(child.id, 'ft', 2, 1, currentNode.pos_x, currentNode.pos_y, [], {}, getFamilyMemberCardHtml({
                        id: child.id, name: child.currentName, description: child.birthName
                    }));
                    let childNode = editor.getNodeFromId(child.id);
                    setPosition(childNode, currentNode.pos_x, currentNode.pos_y, type, (index - 1) * (xDistance + 50));
                }
                if (nodeExists(child.father)) {
                    editor.addConnection(child.father, child.id, 'output_1', 'input_1');
                }
                if (nodeExists(child.mother)) {
                    editor.addConnection(child.mother, child.id, 'output_1', 'input_2');
                }
            }));
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
    editor.addNodeWithId = function (id, name, num_in, num_out, ele_pos_x, ele_pos_y, classoverride, data, html, typenode = false) {
        const lastId = editor.nodeId;
        editor.nodeId = id;
        editor.addNode(name, num_in, num_out, ele_pos_x, ele_pos_y, classoverride, data, html, typenode)
        editor.nodeId = lastId;
    }
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
            editor.addNodeWithId(member.id, 'ft', 2, 1, 500, 500, [], {}, getFamilyMemberCardHtml({
                id: member.id, name: member.currentName, description: member.birthName
            }));
            ids.push(member.id);
        }
        for (let member of data) {
            if (ids.includes(member.father)) editor.addConnection(member.father, member.id, 'output_1', 'input_1');
            if (ids.includes(member.mother)) editor.addConnection(member.mother, member.id, 'output_1', 'input_2');
        }
        for (let member of data) {
            let currentNode = editor.getNodeFromId(member.id);
            let [x, y] = [currentNode.pos_x, currentNode.pos_y];
            if (ids.includes(member.father)) {
                setPositionRecursively(member.father, x, y, 'left');
            }
            if (ids.includes(member.mother)) {
                setPositionRecursively(member.mother, x, y, 'right');
            }
        }
    });
}

function nodeExists(id) {
    return id in editor.drawflow.drawflow.Home.data;
}


function setPositionRecursively(id, startX, startY, type) {
    let currentNode = editor.getNodeFromId(id);
    let [x, y] = setPosition(currentNode, startX, startY, type);
    if (currentNode.inputs['input_1'].connections.length > 0) {
        setPositionRecursively(currentNode.inputs['input_1'].connections[0].node, x, y, 'left');
    }
    if (currentNode.inputs['input_2'].connections.length > 0) {
        setPositionRecursively(currentNode.inputs['input_2'].connections[0].node, x, y, 'right');
    }
}

function setPosition(node, startX, startY, type = '', xOffset = 0, yOffset = 0) {
    let nodeId = "node-" + node.id;
    let x = startX;
    let y = startY;
    if (type === 'left' || type === 'input_1') {
        x -= xDistance;
        y -= yDistance;
    } else if (type === 'right' || type === 'input_2') {
        x += xDistance;
        y -= yDistance;
    } else if (type.includes('output')) {
        x = xDistance;
        y += yDistance;
    }
    x += xOffset;
    y += yOffset;
    // node.pos_x = x;
    // node.pos_y = y;
    editor.drawflow.drawflow.Home.data[node.id].pos_x = x;
    editor.drawflow.drawflow.Home.data[node.id].pos_y = y;
    document.getElementById(nodeId).style.left = x + "px";
    document.getElementById(nodeId).style.top = y + "px";
    editor.updateConnectionNodes(nodeId);
    return [x, y];
}

function floodRemove(rootId, forRemoval) {
    let visitQueue = [];
    visitQueue.push(rootId);
    for (let toRemove of forRemoval) {
        editor.removeNodeId('node-' + toRemove);
    }
    for (let currentId of visitQueue) {
        let currentNode = editor.getNodeFromId(currentId);

        for (let c of [currentNode.inputs['input_1'].connections, currentNode.inputs['input_2'].connections, currentNode.outputs['output_1'].connections].flat()) {
            if (visitQueue.includes(c.node)) continue;
            visitQueue.push(c.node);
        }
    }
    for (let removeId in editor.drawflow.drawflow.Home.data) {
        if (visitQueue.includes(removeId)) continue;
        editor.removeNodeId('node-' + removeId);
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