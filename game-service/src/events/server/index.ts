import { EventEmitter } from "events";
import { createEntity, deleteEntity, updateEntity } from "../../service/entity";
import onMove from "./onMove";

class ServerEvent extends EventEmitter {
    constructor() {
        console.log("ServerEvent constructor")
        super();
        const events = {
            "move": onMove,
            // "create_entity": createEntity,
            // "destroy_entity": deleteEntity,
            "update_entity": updateEntity
        }
        for(const event in events){
            this.on(event,events[event])
        }
    }
}

const serverEvents = new ServerEvent();
export default serverEvents;
