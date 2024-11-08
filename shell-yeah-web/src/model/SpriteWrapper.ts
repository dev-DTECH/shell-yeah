import * as PIXI from 'pixi.js';

interface SpriteWrapperOptions {
    texturePath: string;
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    anchor?: { x: number; y: number };
    interactive?: boolean;
    onClick?: () => void;
}

class SpriteWrapper {
    public sprite: PIXI.Sprite;

    constructor({
                    texturePath,
                    x = 0,
                    y = 0,
                    scale = 1,
                    rotation = 0,
                    anchor = { x: 0.5, y: 0.5 },
                    interactive = false,
                    onClick = undefined,
                }: SpriteWrapperOptions) {
        this.sprite = PIXI.Sprite.from(texturePath);

        // Set properties
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(scale);
        this.sprite.rotation = rotation;
        this.sprite.anchor.set(anchor.x, anchor.y);
        this.sprite.interactive = interactive;

        // Attach events
        if (interactive && onClick) {
            this.sprite.on('pointerdown', onClick);
        }
    }

    // Methods to manipulate the sprite
    setPosition(x: number, y: number): void {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    setScale(scale: number): void {
        this.sprite.scale.set(scale);
    }

    setRotation(rotation: number): void {
        this.sprite.rotation = rotation;
    }

    addToStage(stage: PIXI.Container): void {
        stage.addChild(this.sprite);
    }

    removeFromStage(stage: PIXI.Container): void {
        stage.removeChild(this.sprite);
    }
}

export default SpriteWrapper;
