"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.step = exports.accrue = exports.calculateSignal = exports.scramble = exports.resetPos = exports.createCircuit = void 0;
const util_1 = require("./util");
const wheels_json_1 = __importDefault(require("./wheels.json"));
const createCircuit = ({ wheels, turnovers, code, }) => {
    return {
        code,
        pos: {
            start: 0,
            end: wheels.rotors.length > 4 ? 3 : 2,
        },
        step: false,
        noRotors: wheels.rotors.length,
        turnovers,
    };
};
exports.createCircuit = createCircuit;
const resetPos = (circuit) => {
    circuit.pos = {
        start: 0,
        end: circuit.noRotors > 4 ? 3 : 2,
    };
};
exports.resetPos = resetPos;
const pathway = (circuit) => (circuit.noRotors > 4 ? 8 : 6);
const stopover = (circuit) => pathway(circuit) / 2 - 1;
const step = (circuit) => {
    if (circuit.pos.start <= pathway(circuit)) {
        if (!(circuit.pos.start < circuit.noRotors)) {
            circuit.pos.end -= 1;
        }
        circuit.pos.start += 1;
    }
    return circuit.pos.start <= pathway(circuit);
};
exports.step = step;
const updateCode = (circuit, index) => {
    circuit.code[index] = (circuit.code[index] + 1) % 26;
};
const accrue = (circuit) => {
    let turnover = circuit.turnovers[1].split("");
    let idx = circuit.code[1];
    if (!turnover.includes(util_1.etw[idx])) {
        circuit.step = false;
    }
    if (turnover.includes(util_1.etw[idx]) && !circuit.step) {
        circuit.code = circuit.code.map((code) => (code + 1) % 26);
        circuit.step = true; // Mark the step as true
        return;
    }
    turnover = circuit.turnovers[0].split("");
    idx = circuit.code[2];
    if (turnover.includes(util_1.etw[idx])) {
        circuit.code = circuit.code.map((code, index) => index === 0 ? code : (code + 1) % 26);
        return;
    }
    updateCode(circuit, 2);
};
exports.accrue = accrue;
const getScrambledChar = (circult, ch, rotors, wRotors, wReflectors) => {
    const signal = calculateSignal(circult, ch, circult.code);
    if (circult.pos.start < circult.noRotors) {
        return circult.pos.start === circult.noRotors - 1
            ? wReflectors[rotors[circult.pos.start]][signal]
            : wRotors[rotors[circult.pos.start]][signal];
    }
    else {
        const transformedChar = util_1.etw[signal];
        return circult.pos.end === circult.noRotors - 1
            ? util_1.etw[wReflectors[rotors[circult.pos.end]].indexOf(transformedChar)]
            : util_1.etw[wRotors[rotors[circult.pos.end]].indexOf(transformedChar)];
    }
};
const scramble = (circult, { rotors }, ch) => {
    const wRotors = wheels_json_1.default["rotors"];
    const wReflectors = wheels_json_1.default["reflectors"];
    let pch = ch;
    while (true) {
        pch = getScrambledChar(circult, pch, rotors, wRotors, wReflectors);
        if (!step(circult)) {
            break;
        }
    }
    return pch;
};
exports.scramble = scramble;
const calculateSignal = (circuit, pch, code) => {
    const calculateSignal = (pch, linkValue, etw, code) => {
        const idx = etw.indexOf(pch);
        let signal = idx + (code[Number(linkValue[0])] - code[Number(linkValue[1])]);
        signal %= 26;
        return signal < 0 ? signal + 26 : signal;
    };
    // Main logic
    const links = ["2", "12", "01", "0"];
    if (stopover(circuit) % 2 === 1) {
        links.push("42"); // Arbitrary addition based on stopover
    }
    const isEnd = circuit.pos.start > links.length - 1;
    if (isEnd)
        links.reverse();
    const start = circuit.pos.start % links.length;
    const link = links[start].split("");
    if (isEnd)
        link.reverse();
    // Case 1: Single-character link
    if (link.length === 2) {
        if (link.includes("4")) {
            return util_1.etw.indexOf(pch); // Return index if '4' is part of the link
        }
        else {
            return calculateSignal(pch, link, util_1.etw, code); // Calculate signal for non-'4' link
        }
    }
    else {
        // Case 2: Parity-based signal calculation
        const parity = links.length > 4 && isEnd ? start % 2 === 0 : start % 2 === 1;
        let signal;
        if (parity) {
            signal = util_1.etw.indexOf(pch) - code[Number(links[start % links.length])];
        }
        else {
            signal = util_1.etw.indexOf(pch) + code[Number(links[start])];
        }
        signal %= 26;
        return signal < 0 ? signal + 26 : signal;
    }
};
exports.calculateSignal = calculateSignal;
