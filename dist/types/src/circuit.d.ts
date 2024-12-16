import { WheelsDT } from ".";
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
declare const createCircuit: ({ wheels, turnovers, code, }: CircuitPropsDT) => CircuitDT;
declare const resetPos: (circuit: CircuitDT) => void;
declare const step: (circuit: CircuitDT) => boolean;
declare const accrue: (circuit: CircuitDT) => void;
declare const scramble: (circult: CircuitDT, { rotors }: WheelsDT, ch: string) => string;
declare const calculateSignal: (circuit: CircuitDT, pch: string, code: number[]) => number;
export { CircuitDT, createCircuit, resetPos, scramble, calculateSignal, accrue, step, };
