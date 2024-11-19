import Player from "../../model/Player";

export default async function onMove(player: Player, deltaTime: number){
    await player.move(deltaTime)
}