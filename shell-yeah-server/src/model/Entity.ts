class Entity {
    public id: string;
    public name: string;
    public x: number;
    public y: number;
    public velocity: {
        x: number,
        y: number
    }
    public rotation: number;
    public rotationSpeed: number;
    public texture: string;
    public weapon?: {
        damage: number,
        range: number,
        rotation: number,
        texture: string
    }

    constructor(id: string | Entity) {
        if (typeof id === "string") {
            this.id = id;
            this.name = `entity:${id}`;
            this.x = 0;
            this.y = 0;
            this.velocity = {
                x: 0,
                y: 0
            }
            this.rotation = 0;
            this.rotationSpeed = 0;
            this.texture = "";
            this.weapon = undefined
            return;
        }
        this.id = id.id;
        this.name = id.name;
        this.x = id.x;
        this.y = id.y;
        this.velocity = id.velocity;
        this.rotation = id.rotation;
        this.rotationSpeed = id.rotationSpeed;
        this.texture = id.texture;
        this.weapon = id.weapon;
    }

    move(deltaTime: number) {
        // this.x += this.velocity.x * deltaTime;
        // this.y += this.velocity.y * deltaTime;
        if (!this.velocity.y && !this.rotationSpeed) return;

        // Move in the direction of the rotation
        this.x -= this.velocity.y * deltaTime * Math.sin(this.rotation)
        this.y += this.velocity.y * deltaTime * Math.cos(this.rotation)

        this.rotation += this.rotationSpeed * deltaTime

        // // -50 to 50
        // if (this.x < -50) this.x = -50
        // if (this.y < -50) this.y = -50
        // if (this.x > 50) this.x = 50
        // if (this.y > 50) this.y = 50
    }
}

export default Entity;