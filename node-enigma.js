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
	this.plugboard = {}; 
}

Enigma.prototype.setCode = function(code){
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


var increment = function(){
	var df = wheels['df'];
	var code = this.code || DEFAULT_CONFIG['code'];
	var rotors = this.rotors;

	code[2] = ( code[2] + 1 ) % 26;

	if ( df[code[1]] > rotors[1].turnover ) flag = false;
	if ( df[code[2]] == rotors[0].turnover ) code[1] = ( code[1] + 1 ) % 26;
	
	if ( df[code[1]] == rotors[1].turnover && !flag ) {
		code[0] = ( code[0] + 1 ) % 26;
		flag = true;
	}

	this.code = code;
}

Enigma.prototype.encode = function(input){
}

Enigma.prototype.decode = function(input){
}


module.exports = Enigma;