'use strict';

/**
 *  node-enigma.js
 */


var wheels = require("./wheels");
var clone = require("clone");

/**
 *  default values 
 */
var DEFAULT_CONFIG = {	code: [ 0, 0, 0 ],

			plugboard: {	'A':'A','B':'B','C':'C','D':'D','E':'E','F':'F','G':'G',
					'H':'H','I':'I','J':'J','K':'K','L':'L','M':'M','N':'N',
					'O':'O','P':'P','Q':'Q','R':'R','S':'S','T':'T','U':'U',
					'V':'V','W':'W','X':'X','Y':'Y','Z':'Z'	  }
};

var flag = false;


/**
 *  constructor
 *
 * @param {string} rotor_1
 * @param {string} rotor_2
 * @param {string} rotor_3
 * @param {string} rotor_4
 * @param {string} reflector
 *  
 */
function Enigma(rotor_1, rotor_2, rotor_3, rotor_4, reflector) {
	this.rotors = [wheels[rotor_3], wheels[rotor_2], wheels[rotor_1]];
	this.code = null;
	this.plugboard = null; 
	this.defaults = clone( DEFAULT_CONFIG );

	if( typeof reflector !== 'undefined' ){
		this.rotors.push(wheels[rotor_4]);
		this.rotors.push(wheels[reflector]);
	}else {
		this.rotors.push(wheels[rotor_4])
	}

	//console.log(this.rotors);
}


/**
 * sets ring settings
 *
 * @param  {Array} code
 *            An array of strings.
 *			  ex. ['A','B','Z']
 */
Enigma.prototype.setCode = function(code){
	this.code = this.defaults[ 'code' ];
	var df = wheels['df'];
	for ( var i in code ){
		this.code[i] = df.indexOf(code[i]);	
	}
}


/**
 * sets plug pairs
 *
 * @param  {Object} plugboard - An object of pairs.
 *           ex. {'A':'B','Z':'V'}
 */
Enigma.prototype.setPlugboard = function(plugboard){
	this.plugboard = this.defaults[ 'plugboard' ];
	for ( var i in plugboard ){
		this.plugboard[i] = plugboard[i];
		this.plugboard[plugboard[i]] = i;
	}
}


/**
 * increments ring/code settings 
 */
function increment() {
	var df = wheels['df'];
	var code = this.code || this.defaults[ 'code' ];
	var rotors = this.rotors;
	
	
	if ( !rotors[1].turnover.split('').includes( df[ code[1] ] )) flag = false;

	if ( rotors[0].turnover.split('').includes( df[ code[2]  ] ) ) {
		code[2] = ( code[2] + 1 ) % 26;
		code[1] = ( code[1] + 1 ) % 26;
		return;	
	}

	if ( rotors[1].turnover.split('').includes( df[ code[1]  ]) && !flag ) {
		code[2] = ( code[2] + 1 ) % 26;
		code[1] = ( code[1] + 1 ) % 26;
		code[0] = ( code[0] + 1 ) % 26;
		flag = true;
		return;
	}

	code[2] = ( code[2] + 1 ) % 26;
	
}

/**
 * returns the index of a letter
 *
 *@param {string} input - letter
 *
 *@return {number} 
 */
var getIndex = function(input){
	return wheels['df'].indexOf(input);
}



/**
 *  an array of signals 
 */
var signals = [ (input, code) => { var signal =  ( getIndex(input) + code[2] ) % 26;
				   return ( signal < 0 ) ? signal + 26 : signal;
				 },
		(input, code) => { var signal = ( getIndex(input) + (code[1] - code[2]) ) % 26;
				   return ( signal < 0 ) ? signal + 26 : signal;
				 },
		(input, code) => { var signal = ( getIndex(input) + (code[0] - code[1]) ) % 26;
				   return (signal < 0) ? signal + 26 : signal;
				 },
		(input, code) => {  var signal = ( getIndex(input) - code[0] ) % 26; 
				   return (signal < 0) ? signal + 26 : signal;
				 },		 
		(input, code) => {  var signal = ( getIndex(input)  ) % 26; 
				   return ( signal < 0 ) ? signal + 26 : signal;
				 },
		(input, code) => {  var signal = ( getIndex(input) ) % 26;
				   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
				 },
		(input, code) => {  return wheels['df'][ ( getIndex(input) + code[0] ) % 26 ];
				 },
		(input, code) => { var signal = ( getIndex(input) + (code[1]-code[0]) ) % 26;
				   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
				 },
		(input, code) => { var signal = ( getIndex(input) + (code[2]- code[1]) ) % 26;
				   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
				 },
		(input, code) => { var signal = ( getIndex(input) - (code[2]) ) % 26;
				   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
				 }
	     ];


/**
 *  ciphers plaintext
 *
 *  @param {string} input - plaintext
 *
 *  @returns {string} - ciphertext
 */
Enigma.prototype.encode = function(input){
	var plugboard = this.plugboard || this.defaults[ 'plugboard' ];
	var rotors = this.rotors;
	var df = wheels['df'];
	var code = null;
	
	var ciphertext = "";
	
	[...input].forEach((char) => {
		increment.call(this);
		code = this.code;
		console.log(df[code[0]], df[code[1]], df[code[2]]);
		char = plugboard[char];

		var i = 0, j = 3;
		while( true ){
			console.log(char);
			var isCap = i < rotors.length;
			char = isCap ? rotors[i].wire[signals[i](char, code)] : 
						   df[ rotors[j].wire.indexOf(signals[i](char, code)) ];
			if(!isCap) j--; i++;
			if(i > 8) break; 

		}

		char = plugboard[signals[i](char, code)];
		
		ciphertext += char;
	});
	
	return ciphertext;

}

/**
 *  deciphers ciphertext
 *
 *  @param {string} input - ciphertext
 *
 *  @returns {string} - plaintext
 */
Enigma.prototype.decode = function(input){
	return this.encode(input);
}


module.exports = Enigma;
