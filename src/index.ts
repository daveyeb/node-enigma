import {
  accrue,
  CircuitDT,
  createCircuit,
  calculateSignal,
  resetPos,
  scramble,
} from "./circuit";

import { Reflector, Rotor } from "./rotors";
import { etw } from "./util";

import data from "./wheels.json";

export type SteckerDT = {
  [key: string]: string;
};

export type WheelsDT = {
  rotors: (Rotor | Reflector)[];
};

export type EngimaDT = {
  wheels: WheelsDT;
  plugboard: SteckerDT;
  internals: CircuitDT;
};

export type EnigmaProps = {
  rotors: string[];
  reflector: string;
  options?: {
    code?: string[];
    plugboard?: SteckerDT;
  };
};


const validateRotors = (rotors: string[], validRotors: string[]): Rotor[] => {
    if (rotors.length < 3 || rotors.length > 4) {
      throw new Error(
        `Invalid number of rotors, should be 3 or 4. Selected rotors: ${rotors.join(",")}`
      );
    }
  
    for (const rotor of rotors) {
      if (!validRotors.includes(rotor.toUpperCase())) {
        throw new Error(
          `Invalid rotor: ${rotor}. Valid rotors: ${validRotors.join(", ")}`
        );
      }
    }
  
    return rotors.map((r) => Rotor[r.toUpperCase() as keyof typeof Rotor]);
  };
  

  const validateReflector = (reflector: string, validReflectors: string[]): Reflector  => {
    if (!validReflectors.includes(reflector.toUpperCase())) {
      throw new Error(
        `Invalid reflector: ${reflector}. Valid reflectors: ${validReflectors.join(", ")}`
      );
    }
    return Reflector[reflector.toUpperCase() as keyof typeof Reflector];
  };
  

  const processCode = (optionsCode: string[]): number[] => {
    if (optionsCode.length !== 3) {
      throw new Error(`Invalid code length: ${optionsCode.length}, it should be 3`);
    }
    return optionsCode.map((c) => etw.indexOf(c.toUpperCase()));
  };
  

  const processPlugboard = (plugboardOptions?: { [key: string]: string }): { [key: string]: string } => {
    const plugboard: { [key: string]: string } = {};
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
  const enigma = (config: EnigmaProps): EngimaDT => {
    const validReflectors: string[] = config.rotors.length > 3
      ? ["UKWB", "UKWC", "BTHIN", "CTHIN"]
      : ["UKWB", "UKWC"];
  
    const validRotors: string[] = [
      "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "BETA", "GAMMA"
    ];
  
    const { rotors, reflector, options } = config;
  
    const _rotors = validateRotors(rotors, validRotors);
    const _reflector = validateReflector(reflector, validReflectors);
  
    const wheels: WheelsDT = { rotors: _rotors };

    let code = [0, 0, 0];
    if (options?.code) {
      code = processCode(options.code);
    }

    wheels.rotors = wheels.rotors
      .slice(0, 3)
      .reverse()
      .concat(wheels.rotors.slice(3));
  
    const turnovers = wheels.rotors
      .map((r) => data["turnovers"][r])
      .filter((t) => t !== "");

    wheels.rotors.push(_reflector);
  
    const plugboard = processPlugboard(options?.plugboard);
  
    return {
      wheels,
      internals: createCircuit({
        wheels,
        code,
        turnovers,
      }),
      plugboard,
    };
  };
  
const applyPlugboard = (
  ch: string,
  plugboard: { [key: string]: string }
): string => {
  return plugboard[ch] || ch;
};

const applyScramble = (enigma: EngimaDT, ch: string): string => {
  ch = scramble(enigma.internals, enigma.wheels, ch);
  ch = String.fromCharCode(
    calculateSignal(enigma.internals, ch, enigma.internals.code) + 65
  );
  return ch;
};

const encode = (enigma: EngimaDT, plaintext: string): string => {
  return plaintext
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (!etw.includes(ch)) return ch;

      accrue(enigma.internals);

      let tch = applyPlugboard(ch, enigma.plugboard);
      tch = applyScramble(enigma, tch);
      tch = applyPlugboard(tch, enigma.plugboard);

      resetPos(enigma.internals);

      return tch;
    })
    .join("");
};

const decode = (enigma: EngimaDT, ciphertext: string): string => {
  return encode(enigma, ciphertext);
};

export { enigma, encode, decode };
