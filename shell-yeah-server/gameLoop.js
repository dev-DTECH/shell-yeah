import config from 'config';

function log(message = "") {
    // parentPort.postMessage({ type: "log", data: message.toString() })
    console.log(`[GAME LOOP] ${message.toString()}`)
}
let tps = 0
let startTimeTPS = performance.now();
function showTPS(deltaTime, entities) {
    if (performance.now() - startTimeTPS > 1000) {
        log()
        log("----- TPS -----")
        console.table({ "TPS": tps, "MSPT": deltaTime, "Entity": entities.length });
        console.log(entities)

        // log("TPS  : " + tps)
        // log("MSPT : " + deltaTime)
        log("---------------")
        log()
        tps = 0;
        startTimeTPS = performance.now();
    }
    else {
        tps++;
    }
}
log("Game loop starting...")
let startTime = performance.now();
// while (true) {
function gameLoop(io, entities) {
    const deltaTime = (performance.now() - startTime);
    process.env.DELTA_TIME = deltaTime
    if (deltaTime < (1000 / (config.get('tps')))) {
        setImmediate(() => gameLoop(io, entities))
        return
    }
    startTime = performance.now();

    if (config.get('debug.showTPS'))
        showTPS(deltaTime, entities)

    entities = entities.map(entity => {
        if(entity?.key?.UP)
            entity.y -= config.get('player.speed') * deltaTime
        else if(entity?.key?.DOWN)
            entity.y += config.get('player.speed') * deltaTime
        if(entity?.key?.LEFT)
            entity.x -= config.get('player.speed') * deltaTime
        else if(entity?.key?.RIGHT)
            entity.x += config.get('player.speed') * deltaTime
        return entity
    })
    // console.log(entities.map(entity => entity.name))
    io.emit("sync", { entities });
    setImmediate(() => gameLoop(io, entities))
}
export default gameLoop
// parentPort.postMessage({ type: "sync", data: { entities } })
// }