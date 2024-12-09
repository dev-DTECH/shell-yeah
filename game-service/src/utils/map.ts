// @ts-nocheck
import {WFCTool2D} from './ndwfc-tools';
import fs from 'fs'
import WFC from './ndwfc';
// initialize the 2d tool
var tool = new WFCTool2D();
// Ground
tool.addTile(`\
....
....
....
....`);
// Water
tool.addTile(`\
....
....
WW..
WW..`);
tool.addTile(`\
WWWW
WWWW
..WW
..WW`);
tool.addTile(`\
WW..
WW..
WW..
WW..`);
//     tool.addTile(`\
// WWWW
// WWWW
// WWWW
// WWWW`);

// Bridge
tool.addTile(`\
WWWW
####
####
WWWW`);
// Road
tool.addTile(`\
....
####
####
....`);
tool.addTile(`\
....
###.
###.
.##.`);
tool.addTile(`\
WW..
####
####
WW..`, {transforms: 'auto', weight: 0.5});

//     // Bush
//     tool.addTile(`\
// ....
// ....
// BB..
// BB..`);
//     tool.addTile(`\
// ....
// ..T.
// ....
// ....`);


//     // Wooden walls
//     tool.addTile(`\
// ....
// ....
// ####
// ....`, {transforms:'auto', weight:0.1});
//     tool.addTile(`\
// .#..
// .#..
// .###
// ....`, {transforms:'auto', weight:0.1});
//     tool.addTile(`\
// ....
// ..##
// ....
// ....`, {transforms:'auto', weight:0.1});

// Ground (green)
tool.addColor(".", [0, 255, 0]);
// Road (black)
tool.addColor("#", [0, 0, 0]);
// Water (blue)
tool.addColor("W", [0, 0, 255]);
// // Tree (deep green)
// tool.addColor("T", [0, 100, 0]);
// // Bush (deep green)
// tool.addColor("B", [0, 100, 0]);

// console.log(tool.getTileFormulae());
const assetMap = {}
const titleFormulae = tool.getTileFormulae()
for (let i = 0; i < titleFormulae.length; i++) {
    assetMap[i] = ""
    titleFormulae[i][2].forEach(row => {
        row.forEach(cell => {
            assetMap[i] += cell
        })
        assetMap[i] += "\n"

    })
    console.log(i)
    console.log(assetMap[i])
}
// console.log(assetMap)
fs.writeFileSync("asset-map.json", JSON.stringify(titleFormulae))
//
// // this generates all the input which you can directly pass to WFC
var wfcInput = tool.generateWFCInput();
// const size = 20
// wfc.expand([-size, -size], [size, size]);
// let done = false
// const start = performance.now()
// while (!done) {
//     // console.log('Generating...')
//     done = wfc.step()
// }
// console.log('Map Generated in', performance.now() - start, 'ms')
//
function seedRandom(seed) {
    let m = 0x80000000; // 2**31
    let a = 1103515245;
    let c = 12345;
    let state = seed ? seed : Math.floor(Math.random() * m);

    return function () {
        state = (a * state + c) % m;
        return state / (m - 1);
    };
}

export default function generateMap(size: number, seed ?: number): Record<string, number> {
    if (seed)
        Math.random = seedRandom(seed)
    
    var wfc = new WFC(wfcInput);
    wfc.expand([-size, -size], [size, size]);
    let done = false
    const start = performance.now()
    console.log('Generating...')
    while (!done) {
        done = wfc.step()
    }
    console.log('Map Generated in', performance.now() - start, 'ms')
    return wfc.readout()
    // })
}

function printMap(map: Record<string, number>) {
    const size = Math.sqrt(Object.keys(map).length) / 2
    console.log(size, Object.keys(map).length)
    for (let i = -size; i < size; i++) {
        let row = ""
        for (let j = -size; j < size; j++) {
            row += map[`${i},${j}`]
        }
        console.log(row)
    }
}

// const map = generateMap(20)
// printMap(map)