const getCombo = config => {
    var kwheels = Object.keys(getWheels(-1))
    var iwheels = config.map((w, i) => {
        if (kwheels.includes(w)) return kwheels.indexOf(w)
    })

    var combo = iwheels.sort((a, b) => {
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