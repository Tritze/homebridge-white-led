var Service, Characteristic;
var Gpio = require('pigpio').Gpio,
  	OutputPin = new Gpio(17, {mode: Gpio.OUTPUT}),
    dutyCycle = 0;
var level = 0;  

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("WhiteLED", "WhiteLED", WhiteLED);
}

function WhiteLED(log, config) {
  this.log = log;
  this.name = config.name;
  this.HOST = '127.0.0.1';
  this.PORT = 8888;
}

WhiteLED.prototype.getServices = function() {
  
  var lightbulbService = new Service.Lightbulb(this.name);
	
  lightbulbService
	.getCharacteristic(Characteristic.On)
	.on('set', this.setOn.bind(this));

  lightbulbService
	.addCharacteristic(new Characteristic.Brightness())
	.on('set', this.setBrightness.bind(this));
  
  return [lightbulbService];
}

WhiteLED.prototype.setBrightness = function(brightness, callback) { 
    
    level = brightness* 2.55 ;
    OutputPin.pwmWrite(level);
    callback();
}

WhiteLED.prototype.setOn = function(on, callback) {
	
	if (on == true) {
        OutputPin.pwmWrite(level);
	} else {     
        OutputPin.pwmWrite(0);
	}
	callback();
}
