import Entity from "./Entity";
import config from "config/lib/config";

class Player extends Entity {
    // public key: Record<string, boolean>
    public health: number
    public weapon: {
        damage: number,
        range: number,
        rotation: number,
        texture: string
    }

    constructor(id: string) {
        super(id);
        this.name = "";
        this.health = 100;
        this.weapon = {
            damage: 10,
            range: 1,
            rotation: 0,
            texture: ""
        }
        this.texture = ""
    }
}

export default Player;