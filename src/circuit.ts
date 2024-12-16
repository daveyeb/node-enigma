import { WheelsDT } from ".";
import { Reflector, Rotor } from "./rotors";
import { etw } from "./util";
import data from "./wheels.json";

type BoundsDT = {
  start: number;
  end: number;
};

type CircuitDT = {
  code: number[];
  pos: BoundsDT;
  step: boolean;

  noRotors: number;
  turnovers: string[];
};

type CircuitPropsDT = {
  wheels: WheelsDT;
  turnovers: string[];
  code: number[];
};

const createCircuit = ({
  wheels,
  turnovers,
  code,
}: CircuitPropsDT): CircuitDT => {
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

const resetPos = (circuit: CircuitDT) => {
  circuit.pos = {
    start: 0,
    end: circuit.noRotors > 4 ? 3 : 2,
  };
};

const pathway = (circuit: CircuitDT): number => (circuit.noRotors > 4 ? 8 : 6);

const stopover = (circuit: CircuitDT): number => pathway(circuit) / 2 - 1;

const step = (circuit: CircuitDT): boolean => {
  if (circuit.pos.start <= pathway(circuit)) {
    if (!(circuit.pos.start < circuit.noRotors)) {
      circuit.pos.end -= 1;
    }
    circuit.pos.start += 1;
  }

  return circuit.pos.start <= pathway(circuit);
};

const updateCode = (circuit: CircuitDT, index: number): void => {
  circuit.code[index] = (circuit.code[index] + 1) % 26;
}

const accrue = (circuit: CircuitDT): void => {
  let turnover = circuit.turnovers[1].split("");
  let idx = circuit.code[1];

  if (!turnover.includes(etw[idx])) {
    circuit.step = false;
  }

  if (turnover.includes(etw[idx]) && !circuit.step) {
    circuit.code = circuit.code.map((code) => (code + 1) % 26);
    circuit.step = true; // Mark the step as true
    return;
  }

  turnover = circuit.turnovers[0].split("");
  idx = circuit.code[2];

  if (turnover.includes(etw[idx])) {
    circuit.code = circuit.code.map((code, index) =>
      index === 0 ? code : (code + 1) % 26
    );
    return;
  }

  updateCode(circuit, 2);
};

const getScrambledChar = (
  circult: CircuitDT, 
  ch: string, 
  rotors: (Rotor | Reflector)[], 
  wRotors: string[], 
  wReflectors: string[]
): string => {
  const signal = calculateSignal(circult, ch, circult.code);

  if (circult.pos.start < circult.noRotors) {
    return circult.pos.start === circult.noRotors - 1
      ? wReflectors[rotors[circult.pos.start]][signal]
      : wRotors[rotors[circult.pos.start]][signal];
  } else {
    const transformedChar = etw[signal];
    return circult.pos.end === circult.noRotors - 1
      ? etw[wReflectors[rotors[circult.pos.end]].indexOf(transformedChar)]
      : etw[wRotors[rotors[circult.pos.end]].indexOf(transformedChar)];
  }
};

const scramble = (
  circult: CircuitDT,
  { rotors }: WheelsDT,
  ch: string
): string => {
  const wRotors = data["rotors"];
  const wReflectors = data["reflectors"];
  let pch = ch;

  while (true) {
    pch = getScrambledChar(circult, pch, rotors, wRotors, wReflectors);

    if (!step(circult)) {
      break;
    }
  }

  return pch;
};

const calculateSignal = (circuit: CircuitDT, pch: string, code: number[]): number => {
  const calculateSignal = (pch: string, linkValue: string[], etw: string, code: number[]): number => {
    const idx = etw.indexOf(pch);
    let signal = idx + (code[Number(linkValue[0])] - code[Number(linkValue[1])]);
    signal %= 26;
    return signal < 0 ? signal + 26 : signal;
  }

  // Main logic
  const links = ["2", "12", "01", "0"];

  if (stopover(circuit) % 2 === 1) {
    links.push("42"); // Arbitrary addition based on stopover
  }

  const isEnd = circuit.pos.start > links.length - 1;

  if (isEnd) links.reverse();

  const start = circuit.pos.start % links.length;
  const link = links[start].split("");

  if (isEnd) link.reverse();

  // Case 1: Single-character link
  if (link.length === 2) {
    if (link.includes("4")) {
      return etw.indexOf(pch); // Return index if '4' is part of the link
    } else {
      return calculateSignal(pch, link, etw, code); // Calculate signal for non-'4' link
    }
  } else {
    // Case 2: Parity-based signal calculation
    const parity = links.length > 4 && isEnd ? start % 2 === 0 : start % 2 === 1;

    let signal: number;

    if (parity) {
      signal = etw.indexOf(pch) - code[Number(links[start % links.length])];
    } else {
      signal = etw.indexOf(pch) + code[Number(links[start])];
    }

    signal %= 26;
    return signal < 0 ? signal + 26 : signal;
  }
};

export {
  CircuitDT,
  createCircuit,
  resetPos,
  scramble,
  calculateSignal,
  accrue,
  step,
};
