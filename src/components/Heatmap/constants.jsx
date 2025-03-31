export const COLOR_LEGEND_HEIGHT = 60;

// -----------------------------------------------------------------------------
// COLOR PALETTES
// -----------------------------------------------------------------------------


// rainbow color palette
// const colPalRainbow = [
//   "#e7f0fa", "#c9e2f6", "#95cbee", "#0099dc", "#4ab04a", "#ffd73e", "#eec73a", "#e29421", "#e29421", "#f05336", "#ce472e",
// ];

// magma color palette
const colPalMagma = [
  "#000004FF", "#150E37FF", "#3B0F70FF", "#641A80FF", "#8C2981FF", "#B63679FF", "#DE4968FF", "#F76F5CFF", "#FE9F6DFF", "#FECE91FF", "#FCFDBFFF",
];
// viridis color palette
const colPalInferno = [
  "#000004FF", "#170C3AFF", "#420A68FF", "#6B186EFF", "#932667FF", "#BB3754FF", "#DD513AFF", "#F3771AFF", "#FCA50AFF", "#F6D645FF", "#FCFFA4FF",
];
// plasma color palette
const colPalPlasma = [
  "#0D0887FF", "#42049EFF", "#6A00A8FF", "#900DA4FF", "#B12A90FF", "#CC4678FF", "#E16462FF", "#F1844BFF", "#FCA636FF", "#FCCE25FF", "#F0F921FF",
];
// viridis color palette
const colPalViridis = [
  "#440154FF", "#482576FF", "#414487FF", "#35608DFF", "#2A788EFF", "#21908CFF", "#22A884FF", "#43BF71FF", "#7AD151FF", "#BBDF27FF", "#FDE725FF",
];
// cividis color palette
const colPalCividis = [
  "#00204DFF", "#00326FFF", "#31446BFF", "#4E576CFF", "#666970FF", "#7C7B78FF", "#958F78FF", "#B0A473FF", "#CBBA69FF", "#E7D159FF", "#FFEA46FF",
];
// rocket color palette
const colPalRocket = [
  "#03051AFF", "#261433FF", "#4C1D4BFF", "#751F58FF", "#A11A5BFF", "#CB1B4FFF", "#E83F3FFF", "#F2704DFF", "#F69C73FF", "#F7C5A5FF", "#FAEBDDFF",
];
// mako color palette
const colPalMako = [
  "#0B0405FF", "#26172AFF", "#382A54FF", "#414081FF", "#395D9CFF", "#357BA2FF", "#3497A9FF", "#3DB4ADFF", "#60CEACFF", "#A8E1BCFF", "#DEF5E5FF",
];
// turbo color palette
const colPalTurbo = [
  "#30123BFF", "#455BCDFF", "#3E9BFEFF", "#18D6CBFF", "#46F884FF", "#A2FC3CFF", "#E1DD37FF", "#FEA632FF", "#F05B12FF", "#C42503FF", "#7A0403FF",
];


// make color palettes available
export const COLORS = {
  "magma":   colPalMagma,
  "inferno": colPalInferno,
  "plasma":  colPalPlasma,
  "viridis": colPalViridis,
  "cividis": colPalCividis,
  "rocket":  colPalRocket,
  "mako":    colPalMako,
  "turbo":   colPalTurbo,
};


// -----------------------------------------------------------------------------

export const THRESHOLDS = [
  // NOTE: use these values to fix color legend ticks
  // 0, 0.01, 0.02, 0.03, 0.09, 0.1, 0.15, 0.25, 0.4, 0.5, 1,
  0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
]; // .map(x => x*100);
