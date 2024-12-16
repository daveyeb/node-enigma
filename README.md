# node-enigma ![workflow status](https://github.com/daveyeb/node-enigma/actions/workflows/ci.yml/badge.svg)

Node.js module to cipher and decipher messages.
This module is intended to imitate the operation of the Enigma M3/M4 developed during the WWII.
For more information on Enigma, visit [Enigma Cipher Machine](http://www.cryptomuseum.com/crypto/enigma/index.htm).

Contact me [@daveyeb](mailto:daveyeb@gmail.com) with any questions, feedback or bugs.

## Install 🛠

```
$ npm install node-enigma
```

## Usage 📜

```javascript
var {enima, decode, encode} = require("node-enigma");

var m4 = enigma({
  rotors: ["iii", "iv", "v", "beta"],
  reflector: "bthin",
  options: {
    plugboard: {
      W: "L",
      D: "N"
    },
  }})

decode(m4, "OGRFHRJYV"); // XXXKMVOXH

var m3 = enigma({
  rotors: ["iii", "iv", "v"],
  reflector: "ukwb",
  options: {
    plugboard: {
      Q: "V",
      S: "M"
    },
  }})

decode(m3, "OGRFHRJYV"); // INAPICKLE

const machine = enigma({
  rotors: ["iii", "ii", "i"],
  reflector: "ukwb",
 })
encode(machine, "BABYDRIVER"); //ADLVITPHWX
```

> Refer to test directory for more basic usage

## Contribute 🤝

Clone this repo to add custom wheels. Make a script inside the folder to test outputs with `require('./lib/node-enigma')`. Any fixes, cleanup or new features are always appreciated.
