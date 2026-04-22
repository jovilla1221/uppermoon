const { normalizeCourierCode } = require('./src/lib/binderbyte');

const tests = [
  "SiCepat",
  "SiCepat Ekspres",
  "JNE REG",
  "J&T Express",
  "POS INDONESIA",
  "GoSend", // not in list
];

tests.forEach(t => {
  console.log(`Input: "${t}" -> Output: "${normalizeCourierCode(t)}"`);
});
