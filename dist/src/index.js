"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.enigma = void 0;
const circuit_1 = require("./circuit");
const rotors_1 = require("./rotors");
const util_1 = require("./util");
const wheels_json_1 = __importDefault(require("./wheels.json"));
const validateRotors = (rotors, validRotors) => {
    if (rotors.length < 3 || rotors.length > 4) {
        throw new Error(`Invalid number of rotors, should be 3 or 4. Selected rotors: ${rotors.join(",")}`);
    }
    for (const rotor of rotors) {
        if (!validRotors.includes(rotor.toUpperCase())) {
            throw new Error(`Invalid rotor: ${rotor}. Valid rotors: ${validRotors.join(", ")}`);
        }
    }
    return rotors.map((r) => rotors_1.Rotor[r.toUpperCase()]);
};
const validateReflector = (reflector, validReflectors) => {
    if (!validReflectors.includes(reflector.toUpperCase())) {
        throw new Error(`Invalid reflector: ${reflector}. Valid reflectors: ${validReflectors.join(", ")}`);
    }
    return rotors_1.Reflector[reflector.toUpperCase()];
};
const processCode = (optionsCode) => {
    if (optionsCode.length !== 3) {
        throw new Error(`Invalid code length: ${optionsCode.length}, it should be 3`);
    }
    return optionsCode.map((c) => util_1.etw.indexOf(c.toUpperCase()));
};
const processPlugboard = (plugboardOptions) => {
    const plugboard = {};
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        plugboard[letter] = letter;
    }
    if (plugboardOptions) {
        if (Object.keys(plugboardOptions).length > 26) {
            throw new Error("Invalid number of entries in plug settings, should not be more than 26");
        }
        Object.entries(plugboardOptions).forEach(([key, value]) => {
            if (key.toUpperCase() in plugboard && value.toUpperCase() in plugboard) {
                plugboard[key.toUpperCase()] = value.toUpperCase();
                plugboard[value.toUpperCase()] = key.toUpperCase();
            }
        });
    }
    return plugboard;
};
// Main enigma function
const enigma = (config) => {
    const validReflectors = config.rotors.length > 3
        ? ["UKWB", "UKWC", "BTHIN", "CTHIN"]
        : ["UKWB", "UKWC"];
    const validRotors = [
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "BETA", "GAMMA"
    ];
    const { rotors, reflector, options } = config;
    const _rotors = validateRotors(rotors, validRotors);
    const _reflector = validateReflector(reflector, validReflectors);
    const wheels = { rotors: _rotors };
    let code = [0, 0, 0];
    if (options?.code) {
        code = processCode(options.code);
    }
    wheels.rotors = wheels.rotors
        .slice(0, 3)
        .reverse()
        .concat(wheels.rotors.slice(3));
    const turnovers = wheels.rotors
        .map((r) => wheels_json_1.default["turnovers"][r])
        .filter((t) => t !== "");
    wheels.rotors.push(_reflector);
    const plugboard = processPlugboard(options?.plugboard);
    return {
        wheels,
        internals: (0, circuit_1.createCircuit)({
            wheels,
            code,
            turnovers,
        }),
        plugboard,
    };
};
exports.enigma = enigma;
const applyPlugboard = (ch, plugboard) => {
    return plugboard[ch] || ch;
};
const applyScramble = (enigma, ch) => {
    ch = (0, circuit_1.scramble)(enigma.internals, enigma.wheels, ch);
    ch = String.fromCharCode((0, circuit_1.calculateSignal)(enigma.internals, ch, enigma.internals.code) + 65);
    return ch;
};
const encode = (enigma, plaintext) => {
    return plaintext
        .toUpperCase()
        .split("")
        .map((ch) => {
        if (!util_1.etw.includes(ch))
            return ch;
        (0, circuit_1.accrue)(enigma.internals);
        let tch = applyPlugboard(ch, enigma.plugboard);
        tch = applyScramble(enigma, tch);
        tch = applyPlugboard(tch, enigma.plugboard);
        (0, circuit_1.resetPos)(enigma.internals);
        return tch;
    })
        .join("");
};
exports.encode = encode;
const decode = (enigma, ciphertext) => {
    return encode(enigma, ciphertext);
};
exports.decode = decode;
