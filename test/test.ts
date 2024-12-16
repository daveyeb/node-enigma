"use strict";

import { enigma, encode, decode } from "../src/index";
var expect = require("chai").expect;

describe("Instantiation", function () {
  describe("intantiating with invalid rotor", function () {
    it("should throw a config error", function () {
      expect(() =>
        enigma({
          rotors: ["ii", "iii", "ukwb"],
          reflector: "",
        })
      ).to.throw(
        "Invalid rotor: ukwb. Valid rotors: I, II, III, IV, V, VI, VII, VIII, BETA, GAMMA"
      );
    });
  });

  describe("intantiating with invalid rotor", function () {
    it("should throw a config error", function () {
      expect(() =>
        enigma({
          rotors: ["ii", "iii"],
          reflector: "ukwb",
        })
      ).to.throw(
        "Invalid number of rotors, should be 3 or 4. Selected rotors: ii,iii"
      );
    });
  });

  describe("instantiating with wrong config", function () {
    it("should throw a config error", function () {
      expect(() =>
        enigma({
          rotors: ["alpha", "i", "ii", "iii"],
          reflector: "ukwb",
        })
      ).to.throw(
        "Invalid rotor: alpha. Valid rotors: I, II, III, IV, V, VI, VII, VIII, BETA, GAMMA"
      );
    });
  });
});

describe("Encoding plaintext with whitespaces/illegal characters", function () {
  describe("Plaintext with whitespaces", function () {
    it("should initialize an Enigma m3 instance", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwc",
      });
      var result = encode(machine, "I LOVE FISHES");
      expect(result).to.equal("W TPDV LWXLIB");
    });
  });

  describe("Plaintext with illegal characters", function () {
    it("should initialize an Enigma m3 instance", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwc",
      });
      var result = encode(machine, "ILOVE*/?FISHES");
      expect(result).to.equal("WTPDV*/?LWXLIB");
    });
  });
});

describe("Enigma M3", function () {
  describe(".setCode", function () {
    it("should set code", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwb",
        options: {
          code: ["J", "B", "C"],
        },
      });

      expect(machine.internals.code).to.deep.equal([9, 1, 2]);
    });
  });

  describe(".setPlugboard", function () {
    it("should set pair plugs", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwb",
        options: {
          plugboard: {
            V: "F",
            S: "P",
          },
        },
      });

      var expected = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "V",
        G: "G",
        H: "H",
        I: "I",
        J: "J",
        K: "K",
        L: "L",
        M: "M",
        N: "N",
        O: "O",
        P: "S",
        Q: "Q",
        R: "R",
        S: "P",
        T: "T",
        U: "U",
        V: "F",
        W: "W",
        X: "X",
        Y: "Y",
        Z: "Z",
      };
      expect(machine.plugboard).to.deep.equal(expected);
    });
  });

  describe(".encode", function () {
    it("should encode message with default setting", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwc",
      });
      var result = encode(machine, "ILOVEFISHES");
      expect(result).to.equal("WTPDVLWXLIB");
    });

    it("should encode with plug pairings", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwc",
        options: {
          plugboard: {
            X: "S",
            F: "V",
          },
        },
      });

      var result = encode(machine, "ILOVEFISHES");
      expect(result).to.equal("WTPXFMWXLIW");
    });

    it("should encode message with ring setting", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwc",
        options: {
          code: ["A", "L", "L"],
        },
      });

      var result = encode(machine, "ILOVEFISHES");
      expect(result).to.equal("KQJYTOHQEWP");
    });
  });

  describe(".decode", function () {
    it("should decode message with default setting", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii"],
        reflector: "ukwb",
      });

      var result = decode(machine, "UUUJGGOCWJM");
      expect(result).to.equal("ZVFZFZMJEWT");
    });
  });
});

describe("Enigma M4", function () {
  describe(".setCode", function () {
    it("should set code", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii", "gamma"],
        reflector: "ukwb",
        options: {
          code: ["J", "B", "C"],
        },
      });

      expect(machine.internals.code).to.deep.equal([9, 1, 2]);
    });
  });

  describe(".setPlugboard", function () {
    it("should set pair plugs", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii", "gamma"],
        reflector: "ukwb",
        options: {
          plugboard: {
            V: "F",
            S: "P",
          },
        },
      });

      var expected = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "V",
        G: "G",
        H: "H",
        I: "I",
        J: "J",
        K: "K",
        L: "L",
        M: "M",
        N: "N",
        O: "O",
        P: "S",
        Q: "Q",
        R: "R",
        S: "P",
        T: "T",
        U: "U",
        V: "F",
        W: "W",
        X: "X",
        Y: "Y",
        Z: "Z",
      };
      expect(machine.plugboard).to.deep.equal(expected);
    });
  });

  describe(".encode", function () {
    it("should encode message with default setting 2", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii", "gamma"],
        reflector: "bthin",
      });

      var result = decode(machine, "ILOVEFISHES");
      expect(result).to.equal("UUUJGGOCWJM");
    });

    it("should encode with plug pairings", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii", "beta"],
        reflector: "bthin",
        options: {
          plugboard: {
            X: "S",
            F: "V",
          },
        },
      });
      var result = encode(machine, "ILOVEFISHES");
      expect(result).to.equal("HENTRDPATCH");
    });

    it("should encode message with ring setting", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii", "gamma"],
        reflector: "cthin",
        options: {
          code: ["Q", "E", "V"],
        },
      });
      var result = encode(machine, "ILOVEFISHES");
      expect(result).to.equal("TRZGXKNILKP");
    });
  });

  describe(".decode", function () {
    it("should decode message with default setting", function () {
      var machine = enigma({
        rotors: ["i", "ii", "iii", "gamma"],
        reflector: "bthin",
      });

      var result = decode(machine, "UUUJGGOCWJM");
      expect(result).to.equal("ILOVEFISHES");
    });
  });
});
