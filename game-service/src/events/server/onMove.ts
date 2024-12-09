import Player from "../../model/Player";

export default async function onMove(player: Player, deltaTime: number){
    try {
        
        await player.move(deltaTime)
    } catch(e) {
        console.error(e)
    }
}