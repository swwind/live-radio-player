// copy from https://github.com/caseif/vis.js/blob/gh-pages/js/util/config.js
// New BSD License
// I don't know how these configurations work.
// But that is ok, I have no necessary to understand them.
// We only need its spectrum smooth algorithms.

// ------------------

// NOTE: Not all config values may necessarily be changed by the user at
// runtime. Some are mutated internally after intialization, meaning changing
// them at runtime may not work as expected.

/* *********************** */
/* * Audio node settings * */
/* *********************** */
// let volumeStep = 0.05; // the step for each volume notch as a fraction of 1

/* *************************** */
/* * Basic spectrum settings * */
/* *************************** */
// BASIC ATTRIBUTES
let spectrumSize = 8192; // number of bars in the spectrum
let spectrumDimensionScalar = 4.5; // the ratio of the spectrum width to its height
let spectrumSpacing = 7; // the separation of each spectrum bar in pixels at width=1920
let maxFftSize = 16384; // the preferred fftSize to use for the audio node (actual fftSize may be lower)
// let maxFftSize = 8192;
// let audioDelay = 0.4; // audio will lag behind the rendered spectrum by this amount of time (in seconds)
// BASIC TRANSFORMATION
let spectrumStart = 4; // the first bin rendered in the spectrum
let spectrumEnd = 1200; // the last bin rendered in the spectrum
let spectrumScale = 2.5; // the logarithmic scale to adjust spectrum values to
// EXPONENTIAL TRANSFORMATION
let spectrumMaxExponent = 6; // the max exponent to raise spectrum values to
let spectrumMinExponent = 3; // the min exponent to raise spectrum values to
let spectrumExponentScale = 2; // the scale for spectrum exponents
// DROP SHADOW
let spectrumShadowBlur = 6; // the blur radius of the spectrum's drop shadow
let spectrumShadowOffsetX = 0; // the x-offset of the spectrum's drop shadow
let spectrumShadowOffsetY = 0; // the y-offset of the spectrum's drop shadow

let spectrumHeight = 100;
let headMarginSlope = 0.013334120966221101;
let tailMarginSlope = Infinity;
let marginDecay = 1.6;

/* ********************** */
/* * Smoothing settings * */
/* ********************** */
let smoothingPoints = 3; // points to use for algorithmic smoothing. Must be an odd number.
let smoothingPasses = 1; // number of smoothing passes to execute
// let temporalSmoothing = 0.2; // passed directly to the JS analyzer node

/* ************************************ */
/* * Spectrum margin dropoff settings * */
/* ************************************ */
let headMargin = 7; // the size of the head margin dropoff zone
let tailMargin = 0; // the size of the tail margin dropoff zone
let minMarginWeight = 0.7; // the minimum weight applied to bars in the dropoff zone

/* *************************** */
/* * Basic particle settings * */
/* *************************** */
// COUNT
// let baseParticleCount = 2000; // the number of particles at 1080p
// let fleckCount = 50; // total fleck count
// let bokehCount = 250; // total bokeh count
// OPACITY
// let particleOpacity = 0.7; // opacity of primary particles
// let bokehOpacity = 0.5; // opacity of bokeh (raising this above 0.5 results in weird behavior)
// SIZE
// let minParticleSize = 4; // the minimum size scalar for particle systems
// let maxParticleSize = 7; // the maximum size scalar for particle systems
// let particleSizeExponent = 2; // the exponent to apply during dynamic particle scaling (similar to spectrum exponents)
// POSITIONING
// let yVelRange = 3; // the range for particle y-velocities
// let xPosBias = 4.5; // bias for particle x-positions (higher values = more center-biased)
// let zPosRange = 450; // the range of z-particles
// let zModifier = -250; // the amount to add to z-positions
// let zPosBias = 2.3; // bias for particle z-positions (higher values = more far-biased)
// let leftChance = 0.88; // the chance for a particle to spawn along the left edge of the screen
// let rightChance = 0.03; // the chance for a particle to spawn along the right edge of the screen
// let topBottomChance = 0.09; // the chance for a particle to spawn along the top/bottom edges of the screen
// VELOCITY
// let velBias = 1.8; // bias for particle velocities (higher values = more center-biased)
// let minParticleVelocity = 2; // the minimum scalar for particle velocity
// let maxParticleVelocity = 5; // the maximum scalar for particle velocity
// let absMinParticleVelocity = 0.001; // the absolute lowest speed for particles
// let fleckVelocityScalar = 1.75; // velocity of flecks relative to normal particles
// let fleckYVelScalar = 0.75; // y-velocity range of flecks relative to x-velocity
// let bokehMinVelocity = maxParticleVelocity * 0.15; // the minimum velocity of bokeh
// let bokehMaxVelocity = maxParticleVelocity * 0.3; // the maximum velocity of bokeh

/* ****************************** */
/* * Particle analysis settings * */
/* ****************************** */
// let ampLower = 7; // the lower bound for amplitude analysis (inclusive)
// let ampUpper = 30; // the upper bound for amplitude analysis (exclusive)
// let particleExponent = 4.5; // the power to raise velMult to after initial computation

/* ***************** */
/* * Misc settings * */
/* ***************** */
// let cycleSpeed = 4; // the (arbitrary) scalar for cycling rainbow spectrums
// let blockWidthRatio = 0.63; // the width of the Monstercat logo relative to its containing block
// let blockHeightRatio = 0.73; // the height of the Monstercat logo relative to its containing block
// let mouseSleepTime = 1000; // inactivity period in milliseconds before the bottom text is hidden






// copy from https://github.com/caseif/vis.js/blob/gh-pages/js/analysis/spectrum_algorithms.js
// New BSD License

/**
 * Applies a Savitsky-Golay smoothing algorithm to the given array.
 *
 * See {@link http://www.wire.tu-bs.de/OLDWEB/mameyer/cmr/savgol.pdf} for more
 * info.
 *
 * @param array The array to apply the algorithm to
 *
 * @return The smoothed array
 */
const savitskyGolaySmooth = (array) => {
  let lastArray = array;
  let newArr = [];
  for (let pass = 0; pass < smoothingPasses; pass++) {
    let sidePoints = Math.floor(smoothingPoints / 2); // our window is centered so this is both nL and nR
    let cn = 1 / (2 * sidePoints + 1); // constant
    newArr = [];
    for (let i = 0; i < sidePoints; i++) {
      newArr[i] = lastArray[i];
      newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
    }
    for (let i = sidePoints; i < lastArray.length - sidePoints; i++) {
      let sum = 0;
      for (let n = -sidePoints; n <= sidePoints; n++) {
        sum += cn * lastArray[i + n] + n;
      }
      newArr[i] = sum;
    }
    lastArray = newArr;
  }
  return newArr;
}

/*
const transformToVisualBins = (array) => {
  let newArray = new Uint8Array(spectrumSize);
  for (let i = 0; i < spectrumSize; i++) {
    let bin = Math.pow(i / spectrumSize, spectrumScale) * (spectrumEnd - spectrumStart) + spectrumStart;
    newArray[i] = array[Math.floor(bin) + spectrumStart] * (bin % 1)
        + array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1))
  }
  return newArray;
}
*/

const normalizeAmplitude = (array) => {
  let values = [];
  for (let i = 0; i < spectrumSize; i++) {
    values[i] = array[i] / 255 * spectrumHeight;
  }
  return values;
}

const averageTransform = (array) => {
  let values = [];
  let length = array.length;

  for (let i = 0; i < length; i++) {
    let value = 0;
    if (i == 0) {
      value = array[i];
    } else if (i == length - 1) {
      value = (array[i - 1] + array[i]) / 2;
    } else {
      let prevValue = array[i - 1];
      let curValue = array[i];
      let nextValue = array[i + 1];

      if (curValue >= prevValue && curValue >= nextValue) {
        value = curValue;
      } else {
        value = (curValue + Math.max(nextValue, prevValue)) / 2;
      }
    }
    value = Math.min(value + 1, spectrumHeight);

    values[i] = value;
  }

  let newValues = [];
  for (let i = 0; i < length; i++) {
    let value = 0;
    if (i == 0) {
      value = values[i];
    } else if (i == length - 1) {
      value = (values[i - 1] + values[i]) / 2;
    } else {
      let prevValue = values[i - 1];
      let curValue = values[i];
      let nextValue = values[i + 1];

      if (curValue >= prevValue && curValue >= nextValue) {
        value = curValue;
      } else {
        value = ((curValue / 2) + (Math.max(nextValue, prevValue) / 3) + (Math.min(nextValue, prevValue) / 6));
      }
    }
    value = Math.min(value + 1, spectrumHeight);

    newValues[i] = value;
  }
  return newValues;
}

const tailTransform = (array) => {
  let values = [];
  for (let i = 0; i < spectrumSize; i++) {
    let value = array[i];
    if (i < headMargin) {
      value *= headMarginSlope * Math.pow(i + 1, marginDecay) + minMarginWeight;
    } else if (spectrumSize - i <= tailMargin) {
      value *= tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) + minMarginWeight;
    }
    values[i] = value;
  }
  return values;
}

const exponentialTransform = (array) => {
  let newArr = [];
  for (let i = 0; i < array.length; i++) {
    let exp = (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;
    newArr[i] = Math.max(Math.pow(array[i] / spectrumHeight, exp) * spectrumHeight, 1);
  }
  return newArr;
}

// top secret bleeding-edge shit in here
const experimentalTransform = (array) => {
  let resistance = 3; // magic constant
  let newArr = [];
  for (let i = 0; i < array.length; i++) {
    let sum = 0;
    let divisor = 0;
    for (let j = 0; j < array.length; j++) {
      let dist = Math.abs(i - j);
      let weight = 1 / Math.pow(2, dist);
      if (weight == 1) weight = resistance;
      sum += array[j] * weight;
      divisor += weight;
    }
    newArr[i] = sum / divisor;
  }
  return newArr;
}
/* not work
const addtiveSmoothing = (array, alpha, times = 1) => {
  let newArr = [];
  for (let t = 0; t < times; ++ t) {
    newArr = [];
    for (let i = 0; i < array.length; ++ i) {
      newArr[i] = (array[i] + alpha) / (times + alpha * array.length);
    }
    array = newArr;
  }
  return newArr;
}
*/
const averageScale = (arr, size) => {
  const n = arr.length;
  const block_size = n / size;
  const newArr = new Array(size).fill(0);
  for (let i = 0; i < n; ++ i) {
    newArr[Math.floor(i / block_size)] += arr[i] / block_size;
  }
  return newArr;
}

const linearSmooth7 = (arr) => {
  const n = arr.length;
  if (n < 7) {
    return arr;
  }
  let newArr = [];

  newArr[0] = (13 * arr[0] + 10 * arr[1] + 7 * arr[2] + 4 * arr[3] + arr[4] - 2 * arr[5] - 5 * arr[6]) / 28;
  newArr[1] = (5 * arr[0] + 4 * arr[1] + 3 * arr[2] + 2 * arr[3] + arr[4] - arr[6]) / 14;
  newArr[2] = (7 * arr[0] + 6 * arr [1] + 5 * arr[2] + 4 * arr[3] + 3 * arr[4] + 2 * arr[5] + arr[6]) / 28;

  for (let i = 3; i < n - 3; ++ i) {
    newArr[i] = (arr[i - 3] + arr[i - 2] + arr[i - 1] + arr[i] + arr[i + 1] + arr[i + 2] + arr[i + 3]) / 7;
  }

  newArr[n - 3] = (7 * arr[n - 1] + 6 * arr [n - 2] + 5 * arr[n - 3] + 4 * arr[n - 4] + 3 * arr[n - 5] + 2 * arr[n - 6] + arr[n - 7]) / 28;
  newArr[n - 2] = (5 * arr[n - 1] + 4 * arr[n - 2] + 3 * arr[n - 3] + 2 * arr[n - 4] + arr[n - 5] - arr[n - 7]) / 14;
  newArr[n - 1] = (13 * arr[n - 1] + 10 * arr[n - 2] + 7 * arr[n - 3] + 4 * arr[n - 4] + arr[n - 5] - 2 * arr[n - 6] - 5 * arr[n - 7]) / 28;

  return newArr;
}

const getTransformedSpectrum = (array, size) => {
  spectrumSize = 1024;
  let newArr = normalizeAmplitude(array);
      newArr = averageTransform(newArr);
      newArr = tailTransform(newArr);
      newArr = savitskyGolaySmooth(newArr);
      newArr = exponentialTransform(newArr);
      newArr = averageScale(newArr, size);
      newArr = linearSmooth7(newArr);
      newArr = linearSmooth7(newArr);
  return newArr;
}

module.exports = getTransformedSpectrum;
