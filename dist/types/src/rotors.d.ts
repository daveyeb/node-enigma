declare enum Rotor {
    I = 0,
    II = 1,
    III = 2,
    IV = 3,
    V = 4,
    VI = 5,
    VII = 6,
    VIII = 7,
    BETA = 8,
    GAMMA = 9
}
declare enum Reflector {
    UKWB = 0,
    UKWC = 1,
    BTHIN = 2,
    CTHIN = 3
}
type RotorDT = {
    rotors: Rotor[];
    reflector: Reflector;
};
export { RotorDT, Rotor, Reflector };
