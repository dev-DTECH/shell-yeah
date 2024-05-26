import { Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";

type Entity = {
    id: string;
    name: string;
    x: number;
    y: number;

    rotation: number;
}

export default function Entity({ entity }: { entity: Entity }) {
    // const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png';
    const assertUrl = "/Churchill/ww2_top_view_hull7.png"
    // console.log(entity);

    return (
        <>
            {entity.name &&
                <Text
                    key={entity.id + "_name"}
                    text={entity.name}
                    anchor={0.5}
                    style={
                        new TextStyle({
                            align: 'center',
                        })
                    }
                    x={entity.x}
                    y={entity.y - 35}
                    />}
            <Sprite key={entity.id} image={assertUrl} x={entity.x} y={entity.y} anchor={0.5} rotation={entity.rotation}/>
        </>
    );
}  