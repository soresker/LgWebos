var scheduleDatas;
var activeSchedule = false;
var oneDaytoSeconds = 86400;
var interval;
var scheduleId = 0;
var startOn = false;
var startOff = false;

function getSeconds(hms) {
    var timeComponents = hms.split(':');
    var hours = parseInt(timeComponents[0]);
    var minutes = parseInt(timeComponents[1]);
    var seconds = parseInt(timeComponents[2]);
    return (hours * 60 * 60) + (minutes * 60) + seconds;
}

function getWeekDay(date) {
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day = date.getDay();
    return weekdays[day];
}

function getNextDay(date) {
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day = date.getDay();
    return weekdays[(day + 1) % 7];
}

function isInScdule(scheduleDatas) {
    var result = false;
    var date = new Date();
    var weekDay = getWeekDay(date);
    var nowTime = date.toTimeString().slice(0, 8);

    for (var z = 0; z < scheduleDatas.length; z++) {
        var element = scheduleDatas[z];

        if (element.day === weekDay) {
            var scheduleStartTime = getSeconds(element.startTime);
            var scheduleEndTime = getSeconds(element.endTime);
            var nowTimeForSchedule = getSeconds(nowTime);

            if (nowTimeForSchedule > scheduleStartTime && nowTimeForSchedule < scheduleEndTime) {
				Logger.sendMessage("activeSchedule = false;result = true");
				activeSchedule = true;
                result = true;
            } else if (nowTimeForSchedule > scheduleStartTime && nowTimeForSchedule > scheduleEndTime) {
				Logger.sendMessage("activeSchedule result = false;continue;");
                activeSchedule = false;
				result = false;
                continue;
            } else {
                Logger.sendMessage("Schedule uykuda ");
                activeSchedule = false;
                result = false;
            }

            if (result === true)
                return true;
            else
                return false;
        }
    }

    return result;
}

function checkSchedule(scheduleData) {
    var date = new Date();
    var weekDay = getWeekDay(date);
    var nowTime = date.toTimeString().slice(0, 8);
    var nextDay = getNextDay(date);

    if (isInScdule(scheduleData) === false) {
        var nowTimeForSchedule = getSeconds(nowTime);
        
        Logger.sendMessage(date.toTimeString().slice(0, 8));
        Logger.sendMessage("nowTimeForSchedule=" + nowTimeForSchedule);
        Logger.sendMessage("scheduleData.length=" + scheduleData.length);

        var allStartTime = [];

        for (var y = 0; y < scheduleData.length; y++) {
            var temp = scheduleData[y];
			Logger.sendMessage("scheduleData.day=" + temp.day);

            if (temp.day === weekDay) {
				//Logger.sendMessage("scheduleData.weekDay=" + weekDay);
				//Logger.sendMessage("scheduleData.startTime=" + temp.startTime);
				//Logger.sendMessage("scheduleData.day=" + temp.day);

                if (getSeconds(temp.startTime) > nowTimeForSchedule)
                    allStartTime.push(getSeconds(temp.startTime) - nowTimeForSchedule);

            } else if (temp.day === nextDay) {

                var calcScheduleNextDay = oneDaytoSeconds - nowTimeForSchedule + getSeconds(temp.startTime);
                allStartTime.push(calcScheduleNextDay);

                Logger.sendMessage("nextDay:" + nextDay);
                Logger.sendMessage("calcScheduleNextDay:" + calcScheduleNextDay);
                
            }
            
        }

		Logger.sendMessage("allStartTime'in:" + allStartTime);

        for (var z = 0; z < allStartTime.length; z++) {
            var indexes = allStartTime[z];
            Logger.sendMessage("allStartTime'in",z,". elemani: " + indexes);
        }
        
        if (allStartTime.length > 0 && activeSchedule == true) {
			//activeSchedule = true;
            //WebosDevice.deviceScreenOn();
            Logger.sendMessage("***********UYANIYORUM HA*******");
        } else {        
			Logger.sendMessage("UYKUDAYIM HA");
            if(startOff == false)
            {
                WebosDevice.deviceScreenOff();
            }

        }

    } else {
        Logger.sendMessage("Schedule hicbir sey yapmiyoruz her sey OK");
        activeSchedule = false;

        if(startOn == false)
        {
            WebosDevice.deviceScreenOn();
        }
    }

}

function startSchedule(check) {

    if(check == true){
        Logger.sendMessage("setInterval Schedule");

        interval = setInterval(function () {
            var scheduleDatas = globalScheduleData;
			Logger.sendMessage("checkSchedule:"+JSON.stringify(scheduleDatas));
			checkSchedule(scheduleDatas);
        }, 30000);
    }else{
        Logger.sendMessage("clearInterval");
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
            endTime: "23:59:59",
            day: days[index]
        };
        // pushing data to empty array
        allData.push(data);
    }

    callback(allData);
}

