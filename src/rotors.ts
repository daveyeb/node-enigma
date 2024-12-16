enum Rotor {
    I,
    II,
    III,
    IV,
    V,
    VI,
    VII,
    VIII,
    BETA,
    GAMMA,
}

enum Reflector {
    UKWB,
    UKWC,
    BTHIN,
    CTHIN,
}

type RotorDT = {
    rotors: Rotor[];
    reflector: Reflector;
};

export { RotorDT, Rotor, Reflector };
