function Keyboard_Control() {

    Remote_Control.call(this);

}

Keyboard_Control.prototype = Object.create(Remote_Control.prototype);
Keyboard_Control.prototype.constructor = Keyboard_Control;


Keyboard_Control.prototype.ShowOnScreenKeyboard = function () {

}

Keyboard_Control.prototype.startListen = function (callback) {

    $('input[type=text]').keypress(function (event) {
        var keyCode = event.which || event.keyCode;
        Logger.sendMessage('keypress ' + keyCode);
        //10009 - 10182
        switch (keyCode) {
            case 13: {
                Logger.sendMessage("Selected Item:" + $('.selected-item').attr("rel") + " - " + $(this).val().toLowerCase());
                if ($(this).val() == '')
                    return;
                //INPUT TAMAMLANDI, KAPATILDI

            } break;
            default: break;
        }
    })

    window.onkeydown = function (event) {

        var keyValue = RemoteControl.keyCodeToValue(event.keyCode);
        if (keyValue != "Unknown") {

            RemoteControl.addValue(keyValue);

        }
        if (keyValue == '[KeyboardBack]') {
       
        }
        return;
    };


}

Keyboard_Control.prototype.keyCodeToValue = function (keyCode) {

    var value = "Unknown";

    switch (keyCode) {

        case 49: value = "1"; break;
        case 50: value = "2"; break;
        case 51: value = "3"; break;
        case 52: value = "4"; break;
        case 53: value = "5"; break;
        case 54: value = "6"; break;
        case 55: value = "7"; break;
        case 56: value = "8"; break;
        case 57: value = "9"; break
        case 48: value = "0"; break
        case 10009: value = "[Back]"; break
        case 13: value = "[Enter]"; break;
        case 38: value = "[Up]"; break;
        case 40: value = "[Down]"; break;
        case 37: value = "[Left]"; break;
        case 39: value = "[Right]"; break;
        case 65385: value = "[KeyboardBack]"; break

        default: value = "Unknown";
    }

    return value;

}
