import { CircuitDT } from "./circuit";
import { Reflector, Rotor } from "./rotors";
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
declare const enigma: (config: EnigmaProps) => EngimaDT;
declare const encode: (enigma: EngimaDT, plaintext: string) => string;
declare const decode: (enigma: EngimaDT, ciphertext: string) => string;
export { enigma, encode, decode };
