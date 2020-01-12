"use strict";

var Enigma = require("../lib/node-enigma.js");
var expect = require('chai').expect;
var assert = require('assert');


describe('Enigma M3', function() {

 describe('instantiation', function() {
  it('should initialize an Enigma instance', function() {
   var result = new Enigma("i", "ii", "iii", "ukw-b");
   expect(result).to.be.an.instanceof(Enigma);
  });
 });

 describe('.setCode', function() {
  it('should set code', function() {
   var enigma = new Enigma("i", "ii", "iii", "ukw-b");
   enigma.setCode(['J', 'B', 'C']);
   var code = enigma.config.match(/\d*\.\d*\.\d*/g).join("").split(".").map((c)=> parseInt(c, 10))
   expect(code).to.deep.equal([9, 1, 2]);
  });
 });

 describe('.setPlugboard', function() {
  it('should set pair plugs', function() {
   var enigma = new Enigma("i", "ii", "iii", "ukw-b");
   enigma.setPlugboard({
    'V': 'F',
    "S": "P"
   });
   var plugboard = enigma.config.match(/[A-Z]/g).join("");
   var expected = "ABCDEVGHIJKLMNOSQRPTUFWXYZ"
   expect(plugboard).to.deep.equal(expected);
  });
 });

 describe('.encode', function() {
  it('should encode message with default setting', function() {
   var enigma = new Enigma("i", "ii", "iii", "ukw-c");
   var result = enigma.encode("ILOVEFISHES");
   expect(result).to.equal("WTPDVLWXLIB");
  });

  it('should encode with plug pairings', function() {
   var enigma = new Enigma("i", "ii", "iii", "ukw-c");
   enigma.setPlugboard({
    'X': 'S',
    'F': 'V'
   });
   var result = enigma.encode("ILOVEFISHES");
   expect(result).to.equal("WTPXFMWXLIW");
  });

  it('should encode message with ring setting', function() {
   var enigma = new Enigma("i", "ii", "iii", "ukw-c");
   enigma.setCode(['A', 'L', 'L']);
   var result = enigma.encode("ILOVEFISHES");
   expect(result).to.equal("KQJYTOHQEWP");
  });

 });


 describe('.decode', function() {
  it('should decode message with default setting', function() {
   var enigma = new Enigma("i", "ii", "iii", "ukw-b");
   var result = enigma.decode("UUUJGGOCWJM");
   expect(result).to.equal("ZVFZFZMJEWT");
  });
 });

});


describe('Enigma M4', function() {

 describe('instantiation', function() {
  it('should initialize an Enigma instance', function() {
   var result = new Enigma("beta", "i", "ii", "iii", "ukw-b");
   expect(result).to.be.an.instanceof(Enigma);
  });
 });

 describe('.setCode', function() {
  it('should set code', function() {
   var enigma = new Enigma("gamma", "i", "ii", "iii", "ukw-b");
   enigma.setCode(['J', 'B', 'C']);
   var code = enigma.config.match(/\d*\.\d*\.\d*/g).join("").split(".").map((c)=> parseInt(c, 10))
   expect(code).to.deep.equal([9, 1, 2]);
  });
 });

 describe('.setPlugboard', function() {
  it('should set pair plugs', function() {
   var enigma = new Enigma("gamma", "i", "ii", "iii", "ukw-b");
   enigma.setPlugboard({
    'V': 'F',
    "S": "P"
   });
   var expected = "ABCDEVGHIJKLMNOSQRPTUFWXYZ"
   var plugboard = enigma.config.match(/[A-Z]/g).join("")
   expect(plugboard).to.deep.equal(expected);
  });
 });

 describe('.encode', function() {
  it('should encode message with default setting', function() {
   var enigma = new Enigma("gamma", "i", "ii", "iii", "b-thin");
   var result = enigma.decode("ILOVEFISHES");
   expect(result).to.equal("UUUJGGOCWJM");
  });

  it('should encode with plug pairings', function() {
   var enigma = new Enigma("beta", "i", "ii", "iii", "b-thin");
   enigma.setPlugboard({
    'X': 'S',
    'F': 'V'
   });
   var result = enigma.encode("ILOVEFISHES");
   expect(result).to.equal("HENTRDPATCH");
  });

  it('should encode message with ring setting', function() {
   var enigma = new Enigma("gamma", "i", "ii", "iii", "c-thin");
   enigma.setCode(['Q', 'E', 'V']);
   var result = enigma.encode("ILOVEFISHES");
   expect(result).to.equal("TRZGXKNILKP");
  });

 });


 describe('.decode', function() {
  it('should decode message with default setting', function() {
   var enigma = new Enigma("gamma", "i", "ii", "iii", "b-thin");
   var result = enigma.decode("UUUJGGOCWJM");
   expect(result).to.equal("ILOVEFISHES");
  });
 });

});
