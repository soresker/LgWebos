// Sabitler ve Global Değişkenler
var SECONDS_IN_A_DAY = 86400; // Bir günde kaç saniye olduğunu belirler
var interval;
var isActiveSchedule = false;
var scheduleId = 0;
var startOn = true;

// Yardımcı Fonksiyonlar
function getSeconds(hms) {
    var timeComponents = hms.split(':');
    var hours = parseInt(timeComponents[0], 10);
    var minutes = parseInt(timeComponents[1], 10);
    var seconds = parseInt(timeComponents[2], 10);
    return (hours * 3600) + (minutes * 60) + seconds;
}

function getWeekDay(date) {
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[date.getDay()];
}

function getNextDay(date) {
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[(date.getDay() + 1) % 7];
}

function isInSchedule(scheduleDatas) {
    var date = new Date();
    var weekDay = getWeekDay(date);
    var nowTime = getSeconds(date.toTimeString().slice(0, 8));

    for (var i = 0; i < scheduleDatas.length; i++) {
        var schedule = scheduleDatas[i];
        var startTime = getSeconds(schedule.startTime);
        var endTime = getSeconds(schedule.endTime);

        if (schedule.day === weekDay) {
            if (startTime < endTime) {
                if (nowTime >= startTime && nowTime <= endTime) {
                    Logger.sendMessage("Aktif program tespit edildi");
                    isActiveSchedule = true;
                    return true;
                }
            } else {
                if (nowTime >= startTime || nowTime <= endTime) {
                    Logger.sendMessage("Aktif program tespit edildi (gece yarısı)");
                    isActiveSchedule = true;
                    return true;
                }
            }
        }
    }
    isActiveSchedule = false;
    return false;
}

function checkSchedule(scheduleDatas) {
    var date = new Date();
    var weekDay = getWeekDay(date);
    var nowTime = getSeconds(date.toTimeString().slice(0, 8));
    var nextDay = getNextDay(date);

    if (!isInSchedule(scheduleDatas)) {
        var startTimes = [];

        for (var i = 0; i < scheduleDatas.length; i++) {
            var schedule = scheduleDatas[i];
            if (schedule.day === weekDay && getSeconds(schedule.startTime) > nowTime) {
                startTimes.push(getSeconds(schedule.startTime) - nowTime);
            } else if (schedule.day === nextDay) {
                startTimes.push(SECONDS_IN_A_DAY - nowTime + getSeconds(schedule.startTime));
            }
        }

        Logger.sendMessage("Yaklaşan başlangıç saatleri: " + startTimes.join(", "));

        if (startTimes.length > 0 && isActiveSchedule) {
            Logger.sendMessage("Uyanıyorum...");
            WebosDevice.deviceScreenOn();
        } else {
            Logger.sendMessage("Uyku moduna geçiyorum...");
            WebosDevice.getPowerStatus();
            WebosDevice.deviceScreenOff();
        }
    } else {
        Logger.sendMessage("Program aktif, işlem gerekmiyor");
        isActiveSchedule = false;
        if (!startOn) {
            WebosDevice.deviceScreenOn();
        }
    }
}

function startSchedule(shouldStart) {
    if (shouldStart) {
        Logger.sendMessage("Zamanlayıcı başlatılıyor");
        interval = setInterval(function () {
            var scheduleDatas = globalScheduleData;
            Logger.sendMessage("Program kontrol ediliyor: " + JSON.stringify(scheduleDatas));
            checkSchedule(scheduleDatas);
        }, 30000);
    } else {
        Logger.sendMessage("Zamanlayıcı temizleniyor");
        clearInterval(interval);
    }
}

function newDefaultSchedule(callback) {
    var allData = [];
    // Sets days
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (var index = 0; index < days.length; index++) {
        // Sets data
        var data = {
            startTime: "00:00:00",
            endTime: "23:59:00",
            day: days[index]
        };
        // pushing data to empty array
        allData.push(data);
    }

    callback(allData);
}
