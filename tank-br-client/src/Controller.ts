class Controller {
    key = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false
    }
    config: { UP: string[]; DOWN: string[]; LEFT: string[]; RIGHT: string[] }
    move = () => { };
    constructor(config: { UP: string[]; DOWN: string[]; LEFT: string[]; RIGHT: string[] }) {
        this.key.UP = false
        this.key.LEFT = false
        this.key.DOWN = false
        this.key.RIGHT = false
        this.config = config
        this.handleKeyDown.bind(this)
        this.handleKeyUp.bind(this)
    }
    handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key
        for (const k in this.config) {
            if (this.config[k] && this.config[k].includes(key)) {
                this.key[k] = true
            }
        }
        this.move()
    }
    handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key
        for (const k in this.config) {
            if (this.config[k] && this.config[k].includes(key)) {
                this.key[k] = false
            }
        }
        this.move()
    }
    onMove = (callback: () => void) => {
        this.move = callback
        // console.log(this.event[key])
    }
}

export default Controller