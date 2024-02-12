function Remote_Control() {

    this.valueSquence = [];
    this.valueSquenceMax = 20;

    this.commandList = [];
    this.commandList.push("792"); 
    this.commandList.push("33284"); 
    this.commandList.push("[Back]");
    this.commandList.push("[Exit]");
    this.commandList.push("[Red]");
    this.commandList.push("[Green]");
    this.commandList.push("[Blue]");
    this.commandList.push("[Yellow]");
    this.commandList.push("[Up]");
    this.commandList.push("[Down]");
    this.commandList.push("[Left]");
    this.commandList.push("[Right]");
    this.commandList.push("[Enter]");
    this.commandList.push("[Back]");

};

Remote_Control.prototype.addValue = function (value) {

    this.valueSquence.push(value);
    this.updateValueSquence();
    var command = this.checkCommands();

    Logger.sendMessage("Command " + command);
    switch (command) {

        case "792": 
            WTools.showUI();

            break;

        case "[Back]": 
   
            WTools.removeUI();

            break;

        case "[Up]":

            WTools.moveUp();
        
            break;
        case "[Down]":

            WTools.moveDown();

            break;
        case "[Left]":

            WTools.moveLeft();

            break;
        case "[Right]":

            WTools.moveRight();

            break;
        case "[Enter]":

                //submit(); bir if else 
                //ShowOnScreenKeyboard();
        
            break;

        case "[Back]":

            WTools.cancel();

            break;

    }

};

Remote_Control.prototype.checkCommands = function () {

    var commandFound = "";

    for (var i = 0; i < this.commandList.length; i++) {

        if (Remote_Control.checkCommand(this.commandList[i])) { //PXC

            commandFound = this.commandList[i];
            break;

        }

    }

    return commandFound;

}

Remote_Control.prototype.checkCommand = function (command) {

    var valueSequenceString = this.valueSquence.join("");
    if (valueSequenceString.length < command.length) {

        return false;

    } else if (command == valueSequenceString.substring(valueSequenceString.length - command.length, valueSequenceString.length)) {

        return true;

    } else {

        return false;
    }


};

Remote_Control.prototype.updateValueSquence = function () {

    while (this.valueSquence.length > this.valueSquenceMax) {

        this.valueSquence.shift();
    }

};



