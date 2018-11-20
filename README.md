node-enigma
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
  let enigma = new Enigma('v','iv','iii','ukw-b');
  
  enigma.decode("BEIITTDNR");
  ```
  
  Output should be `INAPICKLE`
  
  >Refer to test directory for more basic usage
  
  
Contribute
----------

Clone this repo and make a script inside the folder to test outputs with `require('./libs/node-enigma')`. Any fixes, cleanup or new features are always appreciated.
