Power = (function() {
    var c, b;

    function f(g) {}
    if (typeof window === "object") {
        cordova.define("cordova/plugin/power", function(h, g, i) {
            c = function() {};
            if (window.PalmSystem) {
                f("Window.PalmSystem Available");
                b = h("cordova/plugin/webos/service")
            } else {
                b = {
                    Request: function(j, k) {
                        f(j + " invoked. But I am a dummy because PalmSystem is not available");
                        if (typeof k.onFailure === "function") {
                            k.onFailure({
                                returnValue: false,
                                errorText: "PalmSystem Not Available. Cordova is not installed?"
                            })
                        }
                    }
                }
            }
            i.exports = c
        });
        c = cordova.require("cordova/plugin/power")
    } else {
        c = function(g) {
            b = g;
            b.Request = function(h, j) {
                var i = h + "/" + j.method;
                var k = {};
                if (j.hasOwnProperty("parameters") === true) {
                    k = j.parameters
                }
                var l = {};
                var m = function(n) {
                    console.log("res : " + JSON.stringify(n));
                    if (n.payload.returnValue === true) {
                        l = n.payload;
                        j.onSuccess(l)
                    } else {
                        l.returnValue = false;
                        l.errorCode = n.payload.errorCode;
                        l.errorText = n.payload.errorText;
                        j.onFailure(l)
                    }
                };
                if (b) {
                    b.call(i, k, m)
                }
            }
        };
        module.exports = c
    }

    function e(h, i, g) {
        if (h.errorCode === undefined || h.errorCode === null) {
            h.errorCode = i
        }
        if (h.errorText === undefined || h.errorText === null) {
            h.errorText = g
        }
    }

    function a(h, g) {
        if (h === g) {
            return true
        }
        if (h == null || g == null) {
            return false
        }
        if (h.length != g.length) {
            return false
        }
        h.sort();
        g.sort();
        for (var j = 0; j < h.length; j++) {
            if (h[j] !== g[j]) {
                return false
            }
        }
        return true
    }

    function d(g) {
        switch (g) {
            case "ext://hdmi:1":
                return "HDMI1";
            case "ext://hdmi:2":
                return "HDMI2";
            case "ext://hdmi:3":
                return "HDMI3";
            case "ext://dvi:1":
                return "DVI";
            case "ext://dp:1":
                return "DISPLAYPORT";
            case "ext://rgb:1":
                return "RGB";
            case "ext://ops:1":
                return "OPS";
            case "HDMI1":
                return "ext://hdmi:1";
            case "HDMI":
                return "ext://hdmi:1";
            case "HDMI2":
                return "ext://hdmi:2";
            case "HDMI3":
                return "ext://hdmi:3";
            case "DVI":
                return "ext://dvi:1";
            case "DISPLAYPORT":
                return "ext://dp:1";
            case "RGB":
                return "ext://rgb:1";
            case "OPS":
                return "ext://ops:1";
            case "OPS/HDMI3/DVI":
                return "ext://hdmi:3"
        }
        return null
    }
    c.PowerCommand = {
        SHUTDOWN: "powerOff",
        REBOOT: "reboot"
    };
    c.DisplayMode = {
        DISPLAY_OFF: "Screen Off",
        DISPLAY_ON: "Active"
    };
    c.TimerWeek = {
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 4,
        THURSDAY: 8,
        FRIDAY: 16,
        SATURDAY: 32,
        SUNDAY: 64,
        EVERYDAY: 127
    };
    c.DPMSignalType = {
        CLOCK: "clock",
        CLOCK_WITH_DATA: "clockAndData"
    };
    c.PMMode = {
        PowerOff: "powerOff",
        SustainAspectRatio: "sustainAspectRatio",
        ScreenOff: "screenOff",
        ScreenOffAlways: "screenOffAlways",
        ScreenOffBacklight: "screenOffBacklight"
    };
    c.prototype.getPowerStatus = function(g, h) {
        f("getPowerStatus");
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "getPowerStatus",
            parameters: {},
            onSuccess: function(i) {
                f("getPowerStatus: On onSuccess");
                delete i.returnValue;
                if (typeof g === "function") {
                    g(i)
                }
            },
            onFailure: function(i) {
                f("getPowerStatus: On Failure");
                delete i.returnValue;
                if (typeof h === "function") {
                    e(i, "PGPS", "Power.getPowerStatus returns failure.");
                    h(i)
                }
            }
        });
        f("Power.getPowerStatus Done")
    };
    c.prototype.enableAllOnTimer = function(h, i, j) {
        f("enableAllOnTimer: " + JSON.stringify(j));
        var k = null;
        switch (j.allOnTimer) {
            case true:
                k = "on";
                break;
            case false:
                k = "off";
                break;
            default:
                if (typeof i === "function") {
                    var g = {};
                    e(g, "PEAOT", "Power.enableAllOnTimer returns failure. Invalid option value.");
                    i(g)
                }
                return
        }
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "set",
            parameters: {
                category: "time",
                settings: {
                    onTimerEnable: k
                }
            },
            onSuccess: function() {
                if (j.clearOnTimer === true) {
                    b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                        method: "get",
                        parameters: {
                            category: "commercial",
                            keys: ["onOffTimeSchedule"]
                        },
                        onSuccess: function(l) {
                            if (l.returnValue === true) {
                                var o;
                                var m = {};
                                m.onTime = [];
                                m.offTime = [];
                                var n = {};
                                var p = (l.settings.onOffTimeSchedule.offTime === null || l.settings.onOffTimeSchedule.offTime === undefined ? 0 : l.settings.onOffTimeSchedule.offTime.length);
                                for (o = 0; o < p; o++) {
                                    if (l.settings.onOffTimeSchedule.offTime[o].day !== undefined && l.settings.onOffTimeSchedule.offTime[o].day !== null) {
                                        n.day = l.settings.onOffTimeSchedule.offTime[o].day
                                    }
                                    if (l.settings.onOffTimeSchedule.offTime[o].hour !== undefined && l.settings.onOffTimeSchedule.offTime[o].hour !== null) {
                                        n.hour = l.settings.onOffTimeSchedule.offTime[o].hour
                                    }
                                    if (l.settings.onOffTimeSchedule.offTime[o].minute !== undefined && l.settings.onOffTimeSchedule.offTime[o].minute !== null) {
                                        n.minute = l.settings.onOffTimeSchedule.offTime[o].minute
                                    }
                                    m.offTime.push(n);
                                    n = {}
                                }
                                b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                                    method: "set",
                                    parameters: {
                                        category: "commercial",
                                        settings: {
                                            onOffTimeSchedule: m
                                        }
                                    },
                                    onSuccess: function() {
                                        f("enableAllOnTimer: On Success 2");
                                        if (typeof h === "function") {
                                            h()
                                        }
                                    },
                                    onFailure: function(q) {
                                        f("enableAllOnTimer: On Failure 2");
                                        delete q.returnValue;
                                        if (typeof i === "function") {
                                            e(q, "PAOT", "Power.enableAllOnTimer returns failure.");
                                            i(q)
                                        }
                                        return
                                    }
                                })
                            } else {
                                if (typeof h === "function") {
                                    f("enableAllOnTimer: On Success");
                                    h()
                                }
                            }
                        },
                        onFailure: function(l) {
                            delete l.returnValue;
                            if (typeof i === "function") {
                                f("enableAllOnTimer: On Failure");
                                e(l, "PEAOT", "Power.enableAllOnTimer returns failure.");
                                i(l)
                            }
                        }
                    })
                } else {
                    if (typeof h === "function") {
                        f("enableAllOnTimer: On Success");
                        h()
                    }
                }
            },
            onFailure: function(l) {
                delete l.returnValue;
                if (typeof i === "function") {
                    f("enableAllOnTimer: On Failure");
                    e(l, "PEAOT", "Power.enableAllOnTimer returns failure.");
                    i(l)
                }
            }
        });
        f("Power.enableAllOnTimer Done")
    };
    c.prototype.enableAllOffTimer = function(h, i, j) {
        f("enableAllOffTimer: " + JSON.stringify(j));
        var k = null;
        switch (j.allOffTimer) {
            case true:
                k = "on";
                break;
            case false:
                k = "off";
                break;
            default:
                if (typeof i === "function") {
                    var g = {};
                    e(g, "PEAOT", "Power.enableAllOffTimer returns failure. Invalid option value.");
                    i(g)
                }
                return
        }
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "set",
            parameters: {
                category: "time",
                settings: {
                    offTimerEnable: k
                }
            },
            onSuccess: function() {
                if (j.clearOffTimer === true) {
                    b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                        method: "get",
                        parameters: {
                            category: "commercial",
                            keys: ["onOffTimeSchedule"]
                        },
                        onSuccess: function(l) {
                            if (l.returnValue === true) {
                                var o;
                                var m = {};
                                m.onTime = [];
                                m.offTime = [];
                                var n = {};
                                var p = (l.settings.onOffTimeSchedule.onTime === null || l.settings.onOffTimeSchedule.onTime === undefined ? 0 : l.settings.onOffTimeSchedule.onTime.length);
                                for (o = 0; o < p; o++) {
                                    if (l.settings.onOffTimeSchedule.onTime[o].day !== undefined && l.settings.onOffTimeSchedule.onTime[o].day !== null) {
                                        n.day = l.settings.onOffTimeSchedule.onTime[o].day
                                    }
                                    if (l.settings.onOffTimeSchedule.onTime[o].hour !== undefined && l.settings.onOffTimeSchedule.onTime[o].hour !== null) {
                                        n.hour = l.settings.onOffTimeSchedule.onTime[o].hour
                                    }
                                    if (l.settings.onOffTimeSchedule.onTime[o].minute !== undefined && l.settings.onOffTimeSchedule.onTime[o].minute !== null) {
                                        n.minute = l.settings.onOffTimeSchedule.onTime[o].minute
                                    }
                                    m.onTime.push(n);
                                    n = {}
                                }
                                b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                                    method: "set",
                                    parameters: {
                                        category: "commercial",
                                        settings: {
                                            onOffTimeSchedule: m
                                        }
                                    },
                                    onSuccess: function() {
                                        f("enableAllOffTimer: On Success 2");
                                        if (typeof h === "function") {
                                            h()
                                        }
                                    },
                                    onFailure: function(q) {
                                        f("enableAllOffTimer: On Failure 2");
                                        delete q.returnValue;
                                        if (typeof i === "function") {
                                            e(q, "PAOT", "Power.enableAllOffTimer returns failure.");
                                            i(q)
                                        }
                                        return
                                    }
                                })
                            } else {
                                if (typeof h === "function") {
                                    f("enableAllOffTimer: On Success");
                                    h()
                                }
                            }
                        },
                        onFailure: function(l) {
                            delete l.returnValue;
                            if (typeof i === "function") {
                                f("enableAllOffTimer: On Failure");
                                e(l, "PEAOT", "Power.enableAllOffTimer returns failure.");
                                i(l)
                            }
                        }
                    })
                } else {
                    if (typeof h === "function") {
                        f("enableAllOffTimer: On Success");
                        h()
                    }
                }
            },
            onFailure: function(l) {
                delete l.returnValue;
                if (typeof i === "function") {
                    f("enableAllOffTimer: On Failure");
                    e(l, "PEAOT", "Power.enableAllOffTimer returns failure.");
                    i(l)
                }
            }
        });
        f("Power.enableAllOffTimer Done")
    };
    c.prototype.enableWakeOnLan = function(g, h, i) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "enableWakeOnLan",
            parameters: i,
            onSuccess: function(j) {
                delete j.returnValue;
                if (typeof g === "function") {
                    g()
                }
            },
            onFailure: function(j) {
                delete j.returnValue;
                if (typeof h === "function") {
                    e(j, "PEWO", "Power.enableWakeOnLan returns failure.");
                    h(j)
                }
            }
        })
    };
    c.prototype.addOnTimer = function(h, i, j) {
        f("addOnTimer: " + JSON.stringify(j));
        if (j.hour === undefined || isNaN(j.hour) || typeof j.hour !== "number" || j.hour < 0 || j.hour > 23 || j.minute === undefined || isNaN(j.minute) || typeof j.minute !== "number" || j.minute < 0 || j.minute > 59 || j.week === undefined || isNaN(j.week) || typeof j.week !== "number" || j.week <= 0 || j.week > 127) {
            if (typeof i === "function") {
                var g = {};
                e(g, "PAOT", "Power.addOnTimer returns failure. invalid parameters or out of range.");
                i(g)
            }
            return
        }
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "get",
            parameters: {
                category: "commercial",
                keys: ["onOffTimeSchedule"]
            },
            onSuccess: function(k) {
                if (k.returnValue === true) {
                    var p;
                    var m = {};
                    m.onTime = [];
                    m.offTime = [];
                    var r = [];
                    var o = {};
                    var l = 1;
                    while (j.week !== 0) {
                        if (j.week & 1) {
                            console.log("AddonTimer - options.week - " + j.week);
                            switch (l) {
                                case 1:
                                    r.push("mon");
                                    break;
                                case 2:
                                    r.push("tue");
                                    break;
                                case 4:
                                    r.push("wed");
                                    break;
                                case 8:
                                    r.push("thu");
                                    break;
                                case 16:
                                    r.push("fri");
                                    break;
                                case 32:
                                    r.push("sat");
                                    break;
                                case 64:
                                    r.push("sun");
                                    break
                            }
                        }
                        j.week = j.week >>> 1;
                        l = l << 1;
                        if (j.week === 0) {
                            break
                        }
                    }
                    o.day = r;
                    o.hour = j.hour;
                    o.minute = j.minute;
                    m.onTime.push(o);
                    o = {};
                    var n = (k.settings.onOffTimeSchedule.onTime === null || k.settings.onOffTimeSchedule.onTime === undefined ? 0 : k.settings.onOffTimeSchedule.onTime.length);
                    for (p = 0; p < n; p++) {
                        if (k.settings.onOffTimeSchedule.onTime[p].day !== undefined && k.settings.onOffTimeSchedule.onTime[p].day !== null) {
                            o.day = k.settings.onOffTimeSchedule.onTime[p].day
                        }
                        if (k.settings.onOffTimeSchedule.onTime[p].hour !== undefined && k.settings.onOffTimeSchedule.onTime[p].hour !== null) {
                            o.hour = k.settings.onOffTimeSchedule.onTime[p].hour
                        }
                        if (k.settings.onOffTimeSchedule.onTime[p].minute !== undefined && k.settings.onOffTimeSchedule.onTime[p].minute !== null) {
                            o.minute = k.settings.onOffTimeSchedule.onTime[p].minute
                        }
                        m.onTime.push(o);
                        o = {}
                    }
                    var q = (k.settings.onOffTimeSchedule.offTime === null || k.settings.onOffTimeSchedule.offTime === undefined ? 0 : k.settings.onOffTimeSchedule.offTime.length);
                    for (p = 0; p < q; p++) {
                        if (k.settings.onOffTimeSchedule.offTime[p].day !== undefined && k.settings.onOffTimeSchedule.offTime[p].day !== null) {
                            o.day = k.settings.onOffTimeSchedule.offTime[p].day
                        }
                        if (k.settings.onOffTimeSchedule.offTime[p].hour !== undefined && k.settings.onOffTimeSchedule.offTime[p].hour !== null) {
                            o.hour = k.settings.onOffTimeSchedule.offTime[p].hour
                        }
                        if (k.settings.onOffTimeSchedule.offTime[p].minute !== undefined && k.settings.onOffTimeSchedule.offTime[p].minute !== null) {
                            o.minute = k.settings.onOffTimeSchedule.offTime[p].minute
                        }
                        m.offTime.push(o);
                        o = {}
                    }
                    b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                        method: "set",
                        parameters: {
                            category: "commercial",
                            settings: {
                                onOffTimeSchedule: m
                            }
                        },
                        onSuccess: function() {
                            f("addOnTimer: On Success 2");
                            if (typeof h === "function") {
                                h()
                            }
                        },
                        onFailure: function(s) {
                            f("addOnTimer: On Failure 2");
                            delete s.returnValue;
                            if (typeof i === "function") {
                                e(s, "PAOT", "Power.addOnTimer returns failure.");
                                i(s)
                            }
                            return
                        }
                    })
                }
            },
            onFailure: function(k) {
                f("addOnTimer: On Failure");
                delete k.returnValue;
                if (typeof i === "function") {
                    e(k, "PAOT", "Power.addOnTimer returns failure.");
                    i(k)
                }
                return
            }
        });
        f("Power.addOnTimer Done")
    };
    c.prototype.deleteOnTimer = function(h, i, j) {
        f("deleteOnTimer: " + JSON.stringify(j));
        if (j.hour === undefined || isNaN(j.hour) || typeof j.hour !== "number" || j.hour < 0 || j.hour > 23 || j.minute === undefined || isNaN(j.minute) || typeof j.minute !== "number" || j.minute < 0 || j.minute > 59 || j.week === undefined || isNaN(j.week) || typeof j.week !== "number" || j.week < 0 || j.week > 127) {
            if (typeof i === "function") {
                var g = {};
                e(g, "PAOT", "Power.deleteOnTimer returns failure. invalid parameters or out of range.");
                i(g)
            }
            return
        }
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "get",
            parameters: {
                category: "commercial",
                keys: ["onOffTimeSchedule"]
            },
            onSuccess: function(t) {
                if (t.returnValue === true) {
                    var n;
                    var o = {};
                    o.onTime = [];
                    o.offTime = [];
                    var s = [];
                    var m = {};
                    var r = {};
                    var k = 1;
                    while (j.week !== 0) {
                        if (j.week & 1) {
                            switch (k) {
                                case 1:
                                    s.push("mon");
                                    break;
                                case 2:
                                    s.push("tue");
                                    break;
                                case 4:
                                    s.push("wed");
                                    break;
                                case 8:
                                    s.push("thu");
                                    break;
                                case 16:
                                    s.push("fri");
                                    break;
                                case 32:
                                    s.push("sat");
                                    break;
                                case 64:
                                    s.push("sun");
                                    break
                            }
                        }
                        j.week = j.week >>> 1;
                        k = k << 1;
                        if (j.week === 0) {
                            break
                        }
                    }
                    k = 0;
                    m.day = s;
                    m.hour = j.hour;
                    m.minute = j.minute;
                    var p = (t.settings.onOffTimeSchedule.onTime === null || t.settings.onOffTimeSchedule.onTime === undefined ? 0 : t.settings.onOffTimeSchedule.onTime.length);
                    var l = false;
                    for (n = 0; n < p; n++) {
                        if (t.settings.onOffTimeSchedule.onTime[n].day !== undefined && t.settings.onOffTimeSchedule.onTime[n].day !== null && t.settings.onOffTimeSchedule.onTime[n].hour !== undefined && t.settings.onOffTimeSchedule.onTime[n].hour !== null && t.settings.onOffTimeSchedule.onTime[n].minute !== undefined && t.settings.onOffTimeSchedule.onTime[n].minute !== null) {
                            if (a(t.settings.onOffTimeSchedule.onTime[n].day, m.day) && t.settings.onOffTimeSchedule.onTime[n].hour === m.hour && t.settings.onOffTimeSchedule.onTime[n].minute === m.minute) {
                                l = true
                            } else {
                                r.day = t.settings.onOffTimeSchedule.onTime[n].day;
                                r.hour = t.settings.onOffTimeSchedule.onTime[n].hour;
                                r.minute = t.settings.onOffTimeSchedule.onTime[n].minute;
                                o.onTime.push(r)
                            }
                        }
                        r = {}
                    }
                    var q = (t.settings.onOffTimeSchedule.offTime === null || t.settings.onOffTimeSchedule.offTime === undefined ? 0 : t.settings.onOffTimeSchedule.offTime.length);
                    for (n = 0; n < q; n++) {
                        if (t.settings.onOffTimeSchedule.offTime[n].day !== undefined && t.settings.onOffTimeSchedule.offTime[n].day !== null) {
                            r.day = t.settings.onOffTimeSchedule.offTime[n].day
                        }
                        if (t.settings.onOffTimeSchedule.offTime[n].hour !== undefined && t.settings.onOffTimeSchedule.offTime[n].hour !== null) {
                            r.hour = t.settings.onOffTimeSchedule.offTime[n].hour
                        }
                        if (t.settings.onOffTimeSchedule.offTime[n].minute !== undefined && t.settings.onOffTimeSchedule.offTime[n].minute !== null) {
                            r.minute = t.settings.onOffTimeSchedule.offTime[n].minute
                        }
                        o.offTime.push(r);
                        r = {}
                    }
                    if (l) {
                        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                            method: "set",
                            parameters: {
                                category: "commercial",
                                settings: {
                                    onOffTimeSchedule: o
                                }
                            },
                            onSuccess: function() {
                                f("deleteOnTimer: On Success 2");
                                if (typeof h === "function") {
                                    h()
                                }
                            },
                            onFailure: function(u) {
                                f("deleteOnTimer: On Failure 2");
                                delete u.returnValue;
                                if (typeof i === "function") {
                                    e(u, "PAOT", "Power.deleteOnTimer returns failure.");
                                    i(u)
                                }
                                return
                            }
                        })
                    } else {
                        var t = {};
                        e(t, "PAOT", "Power.deleteOnTimer returns failure. / No matched found");
                        i(t)
                    }
                }
            },
            onFailure: function(k) {
                f("deleteOnTimer: On Failure");
                delete k.returnValue;
                if (typeof i === "function") {
                    e(k, "PAOT", "Power.deleteOnTimer returns failure.");
                    i(k)
                }
                return
            }
        });
        f("Power.deleteOnTimer Done")
    };
    c.prototype.addOffTimer = function(h, i, j) {
        if (j.hour === undefined || isNaN(j.hour) || typeof j.hour !== "number" || j.hour < 0 || j.hour > 23 || j.minute === undefined || isNaN(j.minute) || typeof j.minute !== "number" || j.minute < 0 || j.minute > 59 || j.week === undefined || isNaN(j.week) || typeof j.week !== "number" || j.week <= 0 || j.week > 127) {
            if (typeof i === "function") {
                var g = {};
                e(g, "PAOT", "Power.addOffTimer returns failure. Invalid parameter.");
                i(g)
            }
            return
        }
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "get",
            parameters: {
                category: "commercial",
                keys: ["onOffTimeSchedule"]
            },
            onSuccess: function(k) {
                if (k.returnValue === true) {
                    var p;
                    var m = {};
                    m.onTime = [];
                    m.offTime = [];
                    var r = [];
                    var o = {};
                    var l = 1;
                    while (j.week !== 0) {
                        if (j.week & 1) {
                            switch (l) {
                                case 1:
                                    r.push("mon");
                                    break;
                                case 2:
                                    r.push("tue");
                                    break;
                                case 4:
                                    r.push("wed");
                                    break;
                                case 8:
                                    r.push("thu");
                                    break;
                                case 16:
                                    r.push("fri");
                                    break;
                                case 32:
                                    r.push("sat");
                                    break;
                                case 64:
                                    r.push("sun");
                                    break
                            }
                        }
                        j.week = j.week >>> 1;
                        l = l << 1;
                        if (j.week === 0) {
                            break
                        }
                    }
                    o.day = r;
                    o.hour = j.hour;
                    o.minute = j.minute;
                    m.offTime.push(o);
                    o = {};
                    var n = (k.settings.onOffTimeSchedule.onTime === null || k.settings.onOffTimeSchedule.onTime === undefined ? 0 : k.settings.onOffTimeSchedule.onTime.length);
                    for (p = 0; p < n; p++) {
                        if (k.settings.onOffTimeSchedule.onTime[p].day !== undefined && k.settings.onOffTimeSchedule.onTime[p].day !== null) {
                            o.day = k.settings.onOffTimeSchedule.onTime[p].day
                        }
                        if (k.settings.onOffTimeSchedule.onTime[p].hour !== undefined && k.settings.onOffTimeSchedule.onTime[p].hour !== null) {
                            o.hour = k.settings.onOffTimeSchedule.onTime[p].hour
                        }
                        if (k.settings.onOffTimeSchedule.onTime[p].minute !== undefined && k.settings.onOffTimeSchedule.onTime[p].minute !== null) {
                            o.minute = k.settings.onOffTimeSchedule.onTime[p].minute
                        }
                        m.onTime.push(o);
                        o = {}
                    }
                    var q = (k.settings.onOffTimeSchedule.offTime === null || k.settings.onOffTimeSchedule.offTime === undefined ? 0 : k.settings.onOffTimeSchedule.offTime.length);
                    for (p = 0; p < q; p++) {
                        if (k.settings.onOffTimeSchedule.offTime[p].day !== undefined && k.settings.onOffTimeSchedule.offTime[p].day !== null) {
                            o.day = k.settings.onOffTimeSchedule.offTime[p].day
                        }
                        if (k.settings.onOffTimeSchedule.offTime[p].hour !== undefined && k.settings.onOffTimeSchedule.offTime[p].hour !== null) {
                            o.hour = k.settings.onOffTimeSchedule.offTime[p].hour
                        }
                        if (k.settings.onOffTimeSchedule.offTime[p].minute !== undefined && k.settings.onOffTimeSchedule.offTime[p].minute !== null) {
                            o.minute = k.settings.onOffTimeSchedule.offTime[p].minute
                        }
                        m.offTime.push(o);
                        o = {}
                    }
                    b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                        method: "set",
                        parameters: {
                            category: "commercial",
                            settings: {
                                onOffTimeSchedule: m
                            }
                        },
                        onSuccess: function() {
                            f("addOffTimer: On Success 2");
                            if (typeof h === "function") {
                                h()
                            }
                        },
                        onFailure: function(s) {
                            f("addOffTimer: On Failure 2");
                            delete s.returnValue;
                            if (typeof i === "function") {
                                e(s, "PAOT", "Power.addOffTimer returns failure.");
                                i(s)
                            }
                            return
                        }
                    })
                }
            },
            onFailure: function(k) {
                f("addOffTimer: On Failure");
                delete k.returnValue;
                if (typeof i === "function") {
                    e(k, "PAOT", "Power.addOffTimer returns failure.");
                    i(k)
                }
                return
            }
        });
        f("Power.addOffTimer Done")
    };
    c.prototype.deleteOffTimer = function(h, i, j) {
        f("deleteOffTimer: " + JSON.stringify(j));
        if (j.hour === undefined || isNaN(j.hour) || typeof j.hour !== "number" || j.hour < 0 || j.hour > 23 || j.minute === undefined || isNaN(j.minute) || typeof j.minute !== "number" || j.minute < 0 || j.minute > 59 || j.week === undefined || isNaN(j.week) || typeof j.week !== "number" || j.week < 0 || j.week > 127) {
            if (typeof i === "function") {
                var g = {};
                e(g, "PAOT", "Power.deleteOffTimer returns failure. invalid parameters or out of range.");
                i(g)
            }
            return
        }
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "get",
            parameters: {
                category: "commercial",
                keys: ["onOffTimeSchedule"]
            },
            onSuccess: function(t) {
                if (t.returnValue === true) {
                    var n;
                    var o = {};
                    o.onTime = [];
                    o.offTime = [];
                    var s = [];
                    var m = {};
                    var r = {};
                    var k = 1;
                    while (j.week !== 0) {
                        if (j.week & 1) {
                            switch (k) {
                                case 1:
                                    s.push("mon");
                                    break;
                                case 2:
                                    s.push("tue");
                                    break;
                                case 4:
                                    s.push("wed");
                                    break;
                                case 8:
                                    s.push("thu");
                                    break;
                                case 16:
                                    s.push("fri");
                                    break;
                                case 32:
                                    s.push("sat");
                                    break;
                                case 64:
                                    s.push("sun");
                                    break
                            }
                        }
                        j.week = j.week >>> 1;
                        k = k << 1;
                        if (j.week === 0) {
                            break
                        }
                    }
                    k = 0;
                    m.day = s;
                    m.hour = j.hour;
                    m.minute = j.minute;
                    var p = (t.settings.onOffTimeSchedule.onTime === null || t.settings.onOffTimeSchedule.onTime === undefined ? 0 : t.settings.onOffTimeSchedule.onTime.length);
                    var l = false;
                    for (n = 0; n < p; n++) {
                        if (t.settings.onOffTimeSchedule.onTime[n].day !== undefined && t.settings.onOffTimeSchedule.onTime[n].day !== null) {
                            r.day = t.settings.onOffTimeSchedule.onTime[n].day
                        }
                        if (t.settings.onOffTimeSchedule.onTime[n].hour !== undefined && t.settings.onOffTimeSchedule.onTime[n].hour !== null) {
                            r.hour = t.settings.onOffTimeSchedule.onTime[n].hour
                        }
                        if (t.settings.onOffTimeSchedule.onTime[n].minute !== undefined && t.settings.onOffTimeSchedule.onTime[n].minute !== null) {
                            r.minute = t.settings.onOffTimeSchedule.onTime[n].minute
                        }
                        o.onTime.push(r);
                        r = {}
                    }
                    var q = (t.settings.onOffTimeSchedule.offTime === null || t.settings.onOffTimeSchedule.offTime === undefined ? 0 : t.settings.onOffTimeSchedule.offTime.length);
                    for (n = 0; n < q; n++) {
                        if (t.settings.onOffTimeSchedule.offTime[n].day !== undefined && t.settings.onOffTimeSchedule.offTime[n].day !== null && t.settings.onOffTimeSchedule.offTime[n].hour !== undefined && t.settings.onOffTimeSchedule.offTime[n].hour !== null && t.settings.onOffTimeSchedule.offTime[n].minute !== undefined && t.settings.onOffTimeSchedule.offTime[n].minute !== null) {
                            if (a(t.settings.onOffTimeSchedule.offTime[n].day, m.day) && t.settings.onOffTimeSchedule.offTime[n].hour === m.hour && t.settings.onOffTimeSchedule.offTime[n].minute === m.minute) {
                                l = true
                            } else {
                                r.day = t.settings.onOffTimeSchedule.offTime[n].day;
                                r.hour = t.settings.onOffTimeSchedule.offTime[n].hour;
                                r.minute = t.settings.onOffTimeSchedule.offTime[n].minute;
                                o.offTime.push(r)
                            }
                        }
                        r = {}
                    }
                    if (l) {
                        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
                            method: "set",
                            parameters: {
                                category: "commercial",
                                settings: {
                                    onOffTimeSchedule: o
                                }
                            },
                            onSuccess: function() {
                                f("deleteOffTimer: On Success 2");
                                if (typeof h === "function") {
                                    h()
                                }
                            },
                            onFailure: function(u) {
                                f("deleteOffTimer: On Failure 2");
                                delete u.returnValue;
                                if (typeof i === "function") {
                                    e(u, "PAOT", "Power.deleteOffTimer returns failure.");
                                    i(u)
                                }
                                return
                            }
                        })
                    } else {
                        var t = {};
                        e(t, "PAOT", "Power.deleteOffTimer returns failure. / No matched found.");
                        i(t)
                    }
                }
            },
            onFailure: function(k) {
                f("deleteOffTimer: On Failure");
                delete k.returnValue;
                if (typeof i === "function") {
                    e(k, "PAOT", "Power.deleteOffTimer returns failure.");
                    i(k)
                }
                return
            }
        });
        f("Power.deleteOffTimer Done")
    };
    c.prototype.getOnTimerList = function(g, h) {
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "get",
            parameters: {
                category: "commercial",
                keys: ["onOffTimeSchedule"]
            },
            onSuccess: function(k) {
                if (k.returnValue === true) {
                    var q = {};
                    var r = new Array(k.settings.onOffTimeSchedule.onTime === null || k.settings.onOffTimeSchedule.onTime === undefined ? 0 : k.settings.onOffTimeSchedule.onTime.length);
                    for (var n = 0, o = 0; o < r.length; o++, n++) {
                        if (k.settings.onOffTimeSchedule.onTime[o] === null || k.settings.onOffTimeSchedule.onTime[o] === undefined) {
                            continue
                        }
                        r[n] = {
                            hour: 0,
                            minute: 0,
                            week: 0
                        };
                        var p = k.settings.onOffTimeSchedule.onTime[o].day;
                        var l = 0;
                        for (var m = 0; m < p.length; m++) {
                            if (p[m] === "mon") {
                                l += 1
                            }
                            if (p[m] === "tue") {
                                l += 2
                            }
                            if (p[m] === "wed") {
                                l += 4
                            }
                            if (p[m] === "thu") {
                                l += 8
                            }
                            if (p[m] === "fri") {
                                l += 16
                            }
                            if (p[m] === "sat") {
                                l += 32
                            }
                            if (p[m] === "sun") {
                                l += 64
                            }
                        }
                        r[n].hour = k.settings.onOffTimeSchedule.onTime[o].hour;
                        r[n].minute = k.settings.onOffTimeSchedule.onTime[o].minute;
                        r[n].week = l
                    }
                    q.timerList = r;
                    if (typeof g === "function") {
                        g(q)
                    }
                }
            },
            onFailure: function(i) {
                f("getOnTimerList: On Failure");
                delete i.returnValue;
                if (typeof h === "function") {
                    e(i, "PGOTL", "Power.getOnTimerList returns failure.");
                    h(i)
                }
            }
        });
        f("Power.getOnTimerList Done")
    };
    c.prototype.getOffTimerList = function(g, h) {
        f("getOffTimerList: ");
        b.Request("luna://com.webos.service.commercial.scapadapter/settings/", {
            method: "get",
            parameters: {
                category: "commercial",
                keys: ["onOffTimeSchedule"]
            },
            onSuccess: function(k) {
                if (k.returnValue === true) {
                    var q = {};
                    var r = new Array(k.settings.onOffTimeSchedule.offTime === null || k.settings.onOffTimeSchedule.offTime === undefined ? 0 : k.settings.onOffTimeSchedule.offTime.length);
                    for (var n = 0, o = 0; o < r.length; o++, n++) {
                        if (k.settings.onOffTimeSchedule.offTime[o] === null || k.settings.onOffTimeSchedule.offTime[o] === undefined) {
                            continue
                        }
                        r[n] = {
                            hour: 0,
                            minute: 0,
                            week: 0
                        };
                        var p = k.settings.onOffTimeSchedule.offTime[o].day;
                        var l = 0;
                        for (var m = 0; m < p.length; m++) {
                            if (p[m] === "mon") {
                                l += 1
                            }
                            if (p[m] === "tue") {
                                l += 2
                            }
                            if (p[m] === "wed") {
                                l += 4
                            }
                            if (p[m] === "thu") {
                                l += 8
                            }
                            if (p[m] === "fri") {
                                l += 16
                            }
                            if (p[m] === "sat") {
                                l += 32
                            }
                            if (p[m] === "sun") {
                                l += 64
                            }
                        }
                        r[n].hour = k.settings.onOffTimeSchedule.offTime[o].hour;
                        r[n].minute = k.settings.onOffTimeSchedule.offTime[o].minute;
                        r[n].week = l
                    }
                    q.timerList = r;
                    if (typeof g === "function") {
                        g(q)
                    }
                }
            },
            onFailure: function(i) {
                f("getOffTimerList: On Failure");
                delete i.returnValue;
                if (typeof h === "function") {
                    e(i, "PGOTL", "Power.getOffTimerList returns failure.");
                    h(i)
                }
            }
        });
        f("Power.getOffTimerList Done")
    };
    c.prototype.setDisplayMode = function(g, h, i) {
        f("setDisplayMode: " + JSON.stringify(i));
        b.Request("luna://com.webos.service.commercial.scapadapter/power", {
            method: "setDisplayMode",
            parameters: {
                displayMode: i.displayMode
            },
            onSuccess: function(j) {
                f("setDisplayMode: On Success");
                if (j.returnValue === true) {
                    delete j.returnValue;
                    if (typeof g === "function") {
                        f("setDisplayMode: no need to do any action.");
                        g()
                    }
                }
            },
            onFailure: function(j) {
                f("setDisplayMode: On Failure");
                delete j.returnValue;
                if (typeof h === "function") {
                    e(j, "PSDM", "Power.setDisplayMode returns failure.");
                    h(j)
                }
            }
        });
        f("Power.setDisplayMode Done")
    };
    c.prototype.executePowerCommand = function(g, h, i) {
        f("executePowerCommand: " + JSON.stringify(i));
        b.Request("luna://com.webos.service.commercial.scapadapter/power", {
            method: "executePowerCommand",
            parameters: {
                powerCommand: i.powerCommand
            },
            onSuccess: function(j) {
                f("executePowerCommand: On Success");
                delete j.returnValue;
                if (typeof g === "function") {
                    g()
                }
            },
            onFailure: function(j) {
                f("executePowerCommand: On Failure");
                delete j.returnValue;
                if (typeof h === "function") {
                    e(j, "PEPM", "Power.executePowerCommand returns failure.");
                    h(j)
                }
            }
        });
        f("Power.executePowerCommand Done")
    };
    c.prototype.setDPMWakeup = function(g, h, i) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "setDPMWakeup",
            parameters: i,
            onSuccess: function(j) {
                delete j.returnValue;
                if (typeof g === "function") {
                    g()
                }
            },
            onFailure: function(j) {
                delete j.returnValue;
                if (typeof h === "function") {
                    e(j, "PSDW", "Power.setDPMWakeup returns failure.");
                    h(j)
                }
            }
        })
    };
    c.prototype.getDPMWakeup = function(g, h) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "getDPMWakeup",
            parameters: {},
            onSuccess: function(i) {
                delete i.returnValue;
                if (typeof g === "function") {
                    g(i)
                }
            },
            onFailure: function(i) {
                delete i.returnValue;
                if (typeof h === "function") {
                    e(i, "PGDW", "Power.getDPMWakeup returns failure.");
                    h(i)
                }
            }
        })
    };
    c.prototype.setPMMode = function(g, h, i) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "setPMMode",
            parameters: i,
            onSuccess: function(j) {
                delete j.returnValue;
                if (typeof g === "function") {
                    g()
                }
            },
            onFailure: function(j) {
                delete j.returnValue;
                if (typeof h === "function") {
                    e(j, "PSPM", "Power.setPMMode returns failure.");
                    h(j)
                }
            }
        })
    };
    c.prototype.getPMMode = function(g, h) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "getPMMode",
            parameters: {},
            onSuccess: function(i) {
                delete i.returnValue;
                if (typeof g === "function") {
                    g(i)
                }
            },
            onFailure: function(i) {
                delete i.returnValue;
                if (typeof h === "function") {
                    e(i, "PGPM", "Power.getPMMode returns failure.");
                    h(i)
                }
            }
        })
    };
    c.prototype.setPowerOnDelay = function(g, h, i) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "setPowerOnDelay",
            parameters: i,
            onSuccess: function(j) {
                delete j.returnValue;
                if (typeof g === "function") {
                    g()
                }
            },
            onFailure: function(j) {
                delete j.returnValue;
                if (typeof h === "function") {
                    e(j, "PSPD", "Power.setPowerOnDelay returns failure.");
                    h(j)
                }
            }
        })
    };
    c.prototype.getPowerOnDelay = function(g, h) {
        b.Request("luna://com.webos.service.commercial.scapadapter/power/", {
            method: "getPowerOnDelay",
            parameters: {},
            onSuccess: function(i) {
                delete i.returnValue;
                if (typeof g === "function") {
                    g(i)
                }
            },
            onFailure: function(i) {
                delete i.returnValue;
                if (typeof h === "function") {
                    e(i, "PGPD", "Power.getPowerOnDelay returns failure.");
                    h(i)
                }
            }
        })
    };
    c.prototype.getOnOffTimeSchedule = function(g, h) {
        var i = {};
        e(i, "DEPRECATED_API", "This function is deprecated.");
        h(i)
    };
    c.prototype.setOnOffTimeSchedule = function(g, h, j) {
        var i = {};
        e(i, "DEPRECATED_API", "This function is deprecated.");
        h(i)
    };
    c.prototype.unsetOnOffTimeSchedule = function(g, h) {
        var i = {};
        e(i, "DEPRECATED_API", "This function is deprecated.");
        h(i)
    };
    return c
}());