node-enigma  [![Build Status](https://travis-ci.org/dyeboah/node-enigma.svg?branch=master)](https://travis-ci.org/dyeboah/node-enigma)  [![Coverage Status](https://coveralls.io/repos/github/dyeboah/node-enigma/badge.svg?branch=master)](https://coveralls.io/github/dyeboah/node-enigma?branch=master)
===========

Node.js module to cipher and decipher messages. 
This module is intended to imitate the operation of the Enigma M3/M4 developed during the WWII.
For more information on Enigma, visit [Enigma Cipher Machine](http://www.cryptomuseum.com/crypto/enigma/index.htm).

Contact me [@dyeboah](mailto:dyeboah@oswego.edu) with any questions, feedback or bugs.

Install
-------

  ```
  $ npm install --save node-enigma
  ```
  
Usage
-----

  ```javascript
  var Enigma = require('node-enigma');
  
  // Initialize 
  var enigma = new Enigma('v','iv','iii','ukw-b');
  
  enigma.decode("BEIITTDNR"); // INAPICKLE
  ```
  
  
  >Refer to test directory for more basic usage
  
  
Contribute
----------

Clone this repo and make a script inside the folder to test outputs with `require('./libs/node-enigma')`. Any fixes, cleanup or new features are always appreciated.
