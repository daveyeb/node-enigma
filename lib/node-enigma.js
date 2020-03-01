"use strict";

var {getCombo, getWheels} = require('./wheels')

function Enigma(...config) {
    if (config.length < 4) {
        throw new Error("Enigma machine configuration is not setup right! Machine needs to be configured with the right amount of rotors or entered correctly!")
    }

    this.config = `${getCombo(config)}/$0$/0.0.0/ABCDEFGHIJKLMNOPQRSTUVWXYZ/2?12?01?0?-1`   
}

Enigma.prototype.setPlugboard = function(plugboard) {
    var alpha = getWheels(0).split("");

    for (const i in plugboard) {
        var p = alpha.indexOf(i)
        var n = alpha.indexOf(plugboard[i])
        alpha[p] = plugboard[i]
        alpha[n] = i
    }
    this.config = this.config.replace(/\/[A-Z]*\//, `/${alpha.join("")}/`)
};

Enigma.prototype.setCode = function(code) {
    code = code.map((c) => {
        return getWheels(0).indexOf(c)
    })

    this.config = this.config.replace(/\d*\.\d*\.\d*/, code.join("."))
};

Enigma.prototype.getSignal = function(index, cI) {
    var codeIndices = cI.split("?")
    var flag = false;

    if (index > codeIndices.length - 1) {
        codeIndices = codeIndices.reverse().map((i) => {
            return i.split("").reverse().join("")
        })
        flag = true;
    }

    index = index % (codeIndices.length)
    if (codeIndices[index].length - 1) {
        var cii = codeIndices[index].split("")

        if (cii.includes("-")) return (i, c) => {
            return getWheels(0).indexOf(i)
        }

        return (i, c) => {
            var computedIndex = getWheels(0).indexOf(i) + (c[cii[0]] - c[cii[1]])
            computedIndex = computedIndex % 26;
            return computedIndex < 0 ? computedIndex + 26 : computedIndex;
        }
    } else {
        var result = (codeIndices.length > 4 && flag) ? index % 2 == 0 : index % 2 == 1
        if (result) {
            return (i, c) => {
                var computedIndex = getWheels(0).indexOf(i) - c[codeIndices[index]]
                computedIndex = computedIndex % 26;
                return computedIndex < 0 ? computedIndex + 26 : computedIndex;
            }
        } else {
            return (i, c) => {
                var computedIndex = getWheels(0).indexOf(i) + c[codeIndices[index]]
                computedIndex = computedIndex % 26;
                return computedIndex < 0 ? computedIndex + 26 : computedIndex;
            }
        }
    }

}

Enigma.prototype.accrue = function() {
    var turnovers = getWheels(this.config.split("/")[0]).filter((w) => w.split("").includes("/")).map((r) => r.split("/")[1])
    var code = this.config.match(/\d*\.\d*\.\d*/g).join("").split(".").map((c) => parseInt(c, 10))
    var flag = this.config.match(/\$\d\$/g).join("").match(/\d/g)[0]
    flag = parseInt(flag, 10)

    if (!turnovers[1].split("").includes(getWheels(0)[code[1]])) {
        flag = 0

        this.config = this.config.replace(/\$\d\$/g, `\$${flag}\$`)
    }
    if (turnovers[1].split("").includes(getWheels(0)[code[1]]) && !flag) {
        code[2] = (code[2] + 1) % 26;
        code[1] = (code[1] + 1) % 26;
        code[0] = (code[0] + 1) % 26;

        flag = 1
        this.config = this.config.replace(/\d*\.\d*\.\d*/, code.join(".")).replace(/\$\d\$/g, `\$${flag}\$`)
        return
    }

    if (turnovers[0].split("").includes(getWheels(0)[code[2]])) {
        code[2] = (code[2] + 1) % 26;
        code[1] = (code[1] + 1) % 26;
        this.config = this.config.replace(/\d*\.\d*\.\d*/, code.join("."))
        return;
    }

    code[2] = (code[2] + 1) % 26;
    this.config = this.config.replace(/\d*\.\d*\.\d*/, code.join("."))
}


Enigma.prototype.encode = function(plaintext) {
    var {getSignal, config} = this

    var rotors = getWheels(config.split("/")[0])
    var rotorslength = rotors.length

    var pathway = rotorslength > 4 ? 8 : 6
    var midPathway = pathway / 2 - 1

    var plugboard = config.match(/[A-Z]/g).join("");

    var codeIndices = config.split("/").pop().split("?")
    if (midPathway % 2 == 0) codeIndices.pop()
    codeIndices = codeIndices.join("?")

    var ciphertext = [...plaintext.toUpperCase()].map((pt) => {
        if (!getWheels(0).includes(pt)) return " ";
        
        this.accrue()
        var code = this.config.match(/\d*\.\d*\.\d*/g).join("").split(".").map((c) => parseInt(c, 10))
        var forwards = 0
        var backwards = midPathway

        pt = plugboard[getWheels(0).indexOf(pt)]
        while (forwards <= pathway) {
            pt = forwards < rotorslength ? rotors[forwards][getSignal(forwards, codeIndices)(pt, code)] :
                getWheels(0)[rotors[backwards].indexOf(getWheels(0)[getSignal(forwards, codeIndices)(pt, code)])]

            if (!(forwards < rotorslength)) {
                backwards--;
            }
            forwards++;
        }

        pt = plugboard[getSignal(forwards, codeIndices)(pt, code)]
        return pt;
    });

    return ciphertext.join("");
};

Enigma.prototype.decode = function(ciphertext) {
    return this.encode(ciphertext)
};

module.exports = Enigma