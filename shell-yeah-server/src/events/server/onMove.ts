import Player from "../../model/Player";

export default function onMove(player: Player, deltaTime: number){
    player.move(deltaTime)
}