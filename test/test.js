var Enigma = require("./node-enigma");

var enigma = new Enigma("v","iii","iv","ukw-b");

enigma.setCode(['H','D','I']);
enigma.setPlugboard({"A":"W","G":"K"});

console.log(enigma.decode("ILOVEFISHES"));

console.log(require('path').resolve(__dirname, 'node-enigma.js'));
