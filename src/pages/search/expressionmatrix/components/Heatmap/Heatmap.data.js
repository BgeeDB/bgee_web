const nCol = 10;
const nRow = 5;
const nLvl = 3;

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

/* TypeScript specific
type HeatmapData = { x: string; y: string; value: number; ylvl: number }[];
const data: HeatmapData = [];
*/

const data = [];

for (let x = 0; x < nCol; x+=1) {
  for (let y = 0; y < nRow; y+=1) {
    data.push({
      x: alphabet[x],
      y: alphabet[y],
      value: Math.random(),
      ylvl: 0,  
    });
    for (let yl = 1; yl < nLvl+1; yl+=1) {
      // for (let i = 0; i < 3; i++) {
        data.push({
          x: alphabet[x],
          y: `${alphabet[y]}.${yl}`,
          value: Math.random(),
          ylvl: 1,
        });
      // }
    }
  }
}

export default data ;
