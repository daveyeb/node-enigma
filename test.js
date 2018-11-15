var Enigma = require("./node-enigma");

var enigma = new Enigma("i","ii","iii","ukw-b");

enigma.setCode(['H','D','X']);

console.log(enigma.decode("HENYRQPFTONA"));
