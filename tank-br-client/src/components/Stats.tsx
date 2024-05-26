export default function Stats({tps, ping, entityCount}: {tps: number, ping: number, entityCount: number}) {
    return (
        <div id="stats">
            <h3>Stats</h3>
            <p>TPS: {tps}</p>
            <p>Ping: {ping.toFixed(2)}</p>
            <p>Entity Count: {entityCount}</p>
        </div>
    )
}