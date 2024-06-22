import crusaderHull from '../assets/tanks/crusader/hull.png'
import crusaderTurret from '../assets/tanks/crusader/turret.png'

import churchillHull from '../assets/tanks/churchill/hull.png'
import churchillTurret from '../assets/tanks/churchill/turret.png'

const TankAssets = {
    crusader: {
        hull: crusaderHull,
        turret: crusaderTurret,
    },
    churchill: {
        hull: churchillHull,
        turret: churchillTurret,
    },
}

export default TankAssets
//
// export default function TankImage({string: turret, string: hull}) {
//     return (
//         <div>
//             <img style={{position: "absolute", top: 0}} src={tankImages[hull]} alt="Tank hull"/>
//             <img style={{position: "absolute", top: 0}} src={tankImages[turret]} alt="Tank turret"/>
//         </div>
//     )
// }