import { Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";

type Entity = {
    id: string;
    name: string;
    x: number;
    y: number;
    weapon: {
        damage: number,
        range: number,
        rotation: number
    }

    rotation: number;
}

export default function Player({ entity }: { entity: Entity }) {
    // const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png';
    const tankAssetUrl = "public/assets/Churchill/ww2_top_view_hull7.png"
    const turretAssetUrl = "public/assets/Churchill/ww2_top_view_turret7.png"
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
            <Sprite key={"tank:"+entity.id} image={tankAssetUrl} x={entity.x} y={entity.y} anchor={0.5} rotation={entity.rotation}/>
            <Sprite key={"turret:"+entity.id} image={turretAssetUrl} x={entity.x} y={entity.y} anchor={0.5} rotation={entity.weapon.rotation}/>
        </>
    );
}  