const { parentPort } = require('worker_threads');
const Entity = require('./model/Entity');
const Player = require('./model/Player');
function getEntityById(id, entities) {
    console.log(entities)
    return entities.find(entity => entity.id = id)
}
function log(message = "") {
    // parentPort.postMessage({ type: "log", data: message.toString() })
    console.log(message.toString())
}

const eventListeners = {
    // playerJoin: function (eventSocket, data, entities) {
    //     log(`[+] ${data.name}`)
    //     this.spawn(eventSocket, new Player(eventSocket.id, data.name), entities)
    // },
    // disconnect: function (eventSocket, data, entities) {
    //     const entity = getEntityById(eventSocket.id, entities)
    //     // console.log(entity)
    //     log(`[-] ${entity?.name}`)
    //     this.despawn(eventSocket, entity, entities)
    // },
    // spawn: function (eventSocket, entity, entities) {
    //     log(`Spawning entity with id: ${entity.id}`)
    //     entities.push(entity)
    // },
    // despawn: function (eventSocket, entity, entities) {
    //     log(`Despawning entity with id: ${entity.id}`)
    //     // console.log(entity)
    //     entities = entities.filter(e => e.id !== entity.id)
    //     // console.log("After despawn")
    //     // console.log(entities)
    //     // entities.pop()
    // },
    // move: function (eventSocket, entity, entities) {
    // }
}

function addEventListeners(eventSocket, entities) {
    const events = Object.keys(eventListeners)
    events.forEach(event => {
        eventSocket.on(event, (data) => {
            eventListeners[event](eventSocket, data, entities)
        })
    })
}

module.exports = {
    addEventListeners
}