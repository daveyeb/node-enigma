const getCombo = config => {
    var kwheels = Object.keys(getWheels(-1))
    var iwheels = kwheels.map((w, i) => {
        if (config.includes(w)) return config.indexOf(w)
        else return -1
    })

    var combo = iwheels.map((c, i) => {
        if (c != -1) return i
    }).filter((i) => {
        if (i != undefined) return i;
    }).sort((a, b) => {
        return iwheels[a] - iwheels[b]
    }).reverse()

    combo.push(combo.shift())

    return combo.join("^")
}

const getWheels = combo => {
    var wheels = {
        etw: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        i: "EKMFLGDQVZNTOWYHXUSPAIBRCJ/Q",
        ii: "AJDKSIRUXBLHWTMCQGZNPYFVOE/E",
        iii: "BDFHJLCPRTXVZNYEIWGAKMUSQO/V",
        iv: "ESOVPZJAYQUIRHXLNFTGKDCMWB/J",
        v: "VZBRGITYUPSDNHLXAWMJQOFECK/Z",
        vi: "JPGVOUMFYQBENHZRDKASXLICTW/ZM",
        vii: "NZJHGRCXMYSWBOUFAIVLPEKQDT/ZM",
        viii: "FKQHTLXOCBJSPDZRAMEWNIUYGV/ZM",
        beta: "LEYJVCNIXWPBQMDRTAKZGFUHOS",
        gamma: "FSOKANUERHMBTIYCWLQPZXVGJD",
        "ukw-b": "YRUHQSLDPXNGOKMIEBFZCWVJAT",
        "ukw-c": "FVPJIAOYEDRZXWGCTKUQSBNMHL",
        "b-thin": "ENKQAUYWJICOPBLMDXZVFTHRGS",
        "c-thin": "RDOBJNTKVEHMLFCWZAXGYIPSUQ"
    }

    if (combo == -1) return wheels
    else if (combo == 0) return wheels[Object.keys(wheels)[combo]]
    else {
        combo = combo.split("^")
        var kwheels = Object.keys(wheels)
        var whls = combo.map((c, i) => {
            return wheels[kwheels[c]]
        })
        return whls
    }
}


module.exports = {
    getCombo,
    getWheels
}