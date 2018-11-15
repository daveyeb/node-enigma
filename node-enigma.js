var wheels = require("./wheels");


var DEFAULT_CONFIG = {	code: [ 0, 0, 0 ],

						plugboard: {	'A':'A','B':'B','C':'C','D':'D','E':'E','F':'F','G':'G',
										'H':'H','I':'I','J':'J','K':'K','L':'L','M':'M','N':'N',
										'O':'O','P':'P','Q':'Q','R':'R','S':'S','T':'T','U':'U',
										'V':'V','W':'W','X':'X','Y':'Y','Z':'Z'	  }
};

var flag = false;

function Enigma(rotor_1, rotor_2, rotor_3, reflector) {
	this.rotors = [wheels[rotor_3], wheels[rotor_2], wheels[rotor_1], wheels[reflector]];
	this.code = null;
	this.plugboard = null; 
}

Enigma.prototype.setCode = function(code){
	this.code = DEFAULT_CONFIG['code'];
	var df = wheels['df'];
	for ( i in code ){
		this.code[i] = df.indexOf(code[i]);	
	}
}

Enigma.prototype.setPlugboard = function(plugboard){
	this.plugboard = DEFAULT_CONFIG['plugboard'];
	for ( i in plugboard ){
		this.plugboard[i] = plugboard[i];
		this.plugboard[plugboard[i]] = i;
	}
}


function increment() {
	var df = wheels['df'];
	var code = this.code || DEFAULT_CONFIG['code'];
	var rotors = this.rotors;


	code[2] = ( code[2] + 1 ) % 26;

	if ( code[1] > getIndex(rotors[1].turnover) + 1 ) flag = false;
	if ( code[2] == getIndex(rotors[0].turnover) + 1 ) code[1] = ( code[1] + 1 ) % 26;
	
	if ( code[1] == getIndex(rotors[1].turnover) + 1 && !flag ) {
		code[0] = ( code[0] + 1 ) % 26;
		flag = true;
	}

	this.code = code;
}

var getIndex = function(input){
	return wheels['df'].indexOf(input);
}

var signals = [ (input, code) => { signal =  ( getIndex(input) + code[2] ) % 26;
								   return ( signal < 0 ) ? signal + 26 : signal;
								 },
				(input, code) => { signal = ( getIndex(input) + (code[1]-code[2]) ) % 26;
								   return ( signal < 0 ) ? signal + 26 : signal;
								 },
				(input, code) => { signal = ( getIndex(input) + (code[0]-code[1]) ) % 26;
								 return (signal < 0) ? signal + 26 : signal;
								 },
				(input, code) => { signal = ( getIndex(input) - code[0] ) % 26;
								   return ( signal < 0 ) ? signal + 26 : signal;
								 },
				(input, code) => { signal = ( getIndex(input) + code[0] ) % 26;
								 return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
								 },
				(input, code) => { signal = ( getIndex(input) + (code[1]-code[0]) ) % 26;
								   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
								 },
				(input, code) => { signal = ( getIndex(input) + (code[2]-code[1]) ) % 26;
								   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
								 },
				(input, code) => { signal = ( getIndex(input) - (code[2]) ) % 26;
								   return wheels['df'][ (signal < 0) ? signal + 26 : signal ];
								 }
			  ];

Enigma.prototype.encode = function(input){
	var plugboard = this.plugboard || DEFAULT_CONFIG['plugboard'];
	var rotors = this.rotors;
	var df = wheels['df'];
	var code = null;
	
	var ciphertext = "";
	
	[...input].forEach((char) => {
		increment.call(this);
		code = this.code;
		char = plugboard[char];

		var i = 0, j = 2;
		while( true ){
			isCap = i < rotors.length;
			char = isCap ? rotors[i].wire[signals[i](char, code)] : 
						   df[ rotors[j].wire.indexOf(signals[i](char, code)) ];
			if(!isCap) j--; i++;
			if(i > 6) break; 
		}

		char = plugboard[signals[i](char, code)];
		
		ciphertext += char;
	});
	
	return ciphertext;

}

Enigma.prototype.decode = function(input){
	return this.encode(input);
}


module.exports = Enigma;