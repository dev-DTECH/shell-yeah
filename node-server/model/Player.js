import Entity from "./Entity.js";

class Player extends Entity {
    constructor(id, name) {
        super(id);
        this.name = name;
        this.health = 100;
        this.weapon = {
            damage: 10,
            range: 1,
            rotation: 0,
            texture: "Churchill/ww2_top_view_turret7.png"
        }
        this.texture = "Churchill/ww2_top_view_hull7.png"
    }
}

export default Player;