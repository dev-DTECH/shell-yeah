class Controller {
    key: Record<string, boolean> = {}
    config: Record<string, string[]>
    move = () => {
    };

    constructor(config: Record<string, string[]>) {
        for (const k in config) {
            this.key[k] = false
        }
        this.config = config
        this.handleKeyDown.bind(this)
        this.handleKeyUp.bind(this)
    }

    handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key
        let isChanged = false
        for (const k in this.config) {
            if (this.config[k] && this.config[k].includes(key)) {
                isChanged = isChanged || !this.key[k]
                this.key[k] = true
            }
        }
        if (isChanged)
            this.move()
    }
    handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key
        let isChanged = false
        for (const k in this.config) {
            if (this.config[k] && this.config[k].includes(key)) {
                isChanged = isChanged || this.key[k]
                this.key[k] = false
            }
        }
        if (isChanged)
            this.move()
    }
    onMove = (callback: () => void) => {
        this.move = callback
        // console.log(this.event[key])
    }
}

export default Controller