/*-- THIS is for add method for prototype--*/
var UNDEFINED = "undefined";

//this function from http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
Number.prototype.FormatNumber = function(c, decimal, thousand) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        decimal = decimal == undefined ? "." : decimal,
        thousand = thousand == undefined ? "," : thousand,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (c ? decimal + Math.abs(n - i).toFixed(c).slice(2) : "");
};

String.prototype.ReplaceAll = function(search, replace) {
    if (typeof (replace) === typeof (undefined)) replace = "";
    return PMCommonFunction.ReplaceAll(this, search, replace);
};
String.prototype.ToNumber = function() {
    return parseFloat(this.ReplaceAll(","));
};
String.prototype.PMToDate = function() {
    //convert from a string with a format following the _shortDateFormat to the Date object
    //support the format below:
    //	"MM/dd/yyyy":
    //	"MM/dd/yy":
    //	"MM/d/yyyy":
    //	"MM/d/yy":

    //	"M/dd/yyyy":
    //	"M/dd/yy":
    //	"M/d/yyyy":
    //	"M/d/yy":

    //	"dd/MM/yyyy":
    //	"dd/MM/yy":
    //	"dd/M/yyyy":
    //	"dd/M/yy":

    //	"d/MM/yyyy":
    //	"d/MM/yy":
    //	"d/M/yyyy":
    //	"d/M/yy":

    var dateString = this;
    var arrDate = dateString.split("/");

    //check the right format
    if (arrDate.length != 3) return new Date();

    var year, month, day;

    $.each(arrDate, function(index, value) {
        arrDate[index] = parseFloat(arrDate[index]);
    });

    switch (_shortDateFormat) {
        case "MM/dd/yyyy":
        case "MM/dd/yy":
        case "MM/d/yyyy":
        case "MM/d/yy":
        case "M/dd/yyyy":
        case "M/dd/yy":
        case "M/d/yyyy":
        case "M/d/yy":
            day = arrDate[1];
            month = arrDate[0];
            year = arrDate[2];
            break;
        case "dd/MM/yyyy":
        case "dd/MM/yy":
        case "dd/M/yyyy":
        case "dd/M/yy":

        case "d/MM/yyyy":
        case "d/MM/yy":
        case "d/M/yyyy":
        case "d/M/yy":
            day = arrDate[0];
            month = arrDate[1];
            year = arrDate[2];
            break;
        default:
            break;
    }

    if (year < 100) {
        //year += 2000; //for this 1000 year
    }

    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setFullYear(year, month - 1, day);

    return date;
};

String.prototype.PMCompareDate = function(date) {
    //0 = equal
    //-1 = less than
    //1 = greater than

    var thisDate = (this).PMToDate();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    if (thisDate < date) return -1;
    if (thisDate == date) return 0;
    if (thisDate > date) return 1;
};

String.prototype.PMCompareTime = function(date) {
    //0 = equal
    //-1 = less than
    //1 = greater than

    var thisDate = (this).PMToDate();

    if (thisDate < date) return -1;
    if (thisDate == date) return 0;
    if (thisDate > date) return 1;
};

String.prototype.PMConvertToDate = function() {
    //the PM date format is one of:
    //yyyy-MM-dd
    //yyyy-MM-ddTHH:mm:ss
    //yyyy-MM-ddTHH:mm:ss.fff

    var date = new Date();
    var dateString = this;

    //default
    var year = 1099;
    var month = 1;
    var day = 1;

    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    var miliseconds = 0;

    var arrDateTime = dateString.split("T");

    //validate the array: 0 item --> invalid
    //1 item --> date only
    //2 items --> date,time


    //0 item --> invalid --> return now
    if (arrDateTime.length === 0 || arrDateTime.length > 2) return new Date();

    //to here, --> 1 item or 2 items

    //calculate the date first
    var arrDate = arrDateTime[0].split("-");
    //only valid if arrDate has 3 item, invalid --> return now
    if (arrDate.length !== 3) return new Date();

    year = parseInt(arrDate[0]);
    month = parseInt(arrDate[1]);
    day = parseInt(arrDate[2]);

    //1 item --> date only --> round the date
    if (arrDateTime.length === 1) {
        date.setFullYear(year);
        date.setMonth(month - 1);//month is from 0
        date.setDate(day);
        date.RoundDate();

        return date;
    }

    //2 items --> date,time
    var arrTimeAndMilisecond = arrDateTime[1].split(".");

    //arrTimeAndMilisecond valid = 1 or 2 item
    if (arrTimeAndMilisecond.length === 0 || arrTimeAndMilisecond.length > 2) {
        //invalid --> return date only
        date.setFullYear(year);
        date.setMonth(month - 1);//month is from 0
        date.setDate(day);
        date.RoundDate();

        return date;
    }

    //arrTimeAndMilisecond 1 item --> time only
    var arrTime = arrTimeAndMilisecond[0].split(":");

    //check time is valid or not
    if (arrTime.length !== 3) {
        //not valid --> return date only
        date.setFullYear(year);
        date.setMonth(month - 1);//month is from 0
        date.setDate(day);
        date.RoundDate();

        return date;
    }


    hours = parseInt(arrTime[0]);
    minutes = parseInt(arrTime[1]);
    seconds = parseInt(arrTime[2]);

    if (arrTimeAndMilisecond.length === 1) {
        //time without milisecond
        date.setFullYear(year);
        date.setMonth(month - 1);//month is from 0
        date.setDate(day);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        date.setMilliseconds(0);

        return date;
    }

    if (arrTimeAndMilisecond.length === 2) {
        //time and milisecond
        miliseconds = parseInt(arrTimeAndMilisecond[1]);

        date.setFullYear(year);
        date.setMonth(month - 1);//month is from 0
        date.setDate(day);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        date.setMilliseconds(miliseconds);
        return date;
    }
};

//this function is the same with PMConvertToDate but the input is UTC and the output date is local
String.prototype.PMConvertUTCToDate = function() {
    var utcTime = this.PMConvertToDate();

    var localTime = utcTime.UtcToLocal();

    return localTime;
};


/// <summary>
/// Create by: Cuong Nguyen Minh 
/// Create date: 2014/01/22
/// Description: format date as the sharepoint system
/// </summary>
Date.prototype.PMDateFormat = function(format) {
    if (typeof(format) === UNDEFINED) format = "dd mmm yyyy";
    var date = this;
    var yearNumber = date.getFullYear();
    var monthNumber = date.getMonth() + 1; //javascript return month from 0
    var monthIndex = date.getMonth(); //this is the index to get the month text from array (start from 0 instead of 1 as month number does)
    var dayNumber = date.getDate();

    //calculate the year month day for format
    //yearFull = yyyy
    //year = yy
    //monthTextFull = mmmm
    //monthText = mmm
    //monthFull = mm
    //month = m
    //dayFull = dd
    //day = d

    //year
    var year = (yearNumber + "").substr(2, 2);
    var yearFull = yearNumber + "";

    //month
    var monthText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex];
    var monthTextFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];
    var month = monthNumber + "";
    var monthFull = monthNumber;
    if (monthFull < 10) monthFull = "0" + monthFull;

    //day
    var day = dayNumber + "";
    var dayFull = dayNumber;
    if (dayFull < 10) dayFull = "0" + dayFull;

    //update the format
    //this is some support format
    format = format.ReplaceAll("yyyy", "${Full_Year}");
    format = format.ReplaceAll("yy", "${Year}");
    format = format.ReplaceAll("mmmm", "${Month_Full_Text}");
    format = format.ReplaceAll("mmm", "${Month_Text}");
    format = format.ReplaceAll("mm", "${Month_Full}");
    format = format.ReplaceAll("m", "${Month}");
    format = format.ReplaceAll("dd", "${Day_Full}");
    format = format.ReplaceAll("d", "${Day}");

    var result = format;
    result = result.ReplaceAll("${Full_Year}", yearFull);
    result = result.ReplaceAll("${Year}", year);
    result = result.ReplaceAll("${Month_Full_Text}", monthTextFull);
    result = result.ReplaceAll("${Month_Text}", monthText);
    result = result.ReplaceAll("${Month_Full}", monthFull);
    result = result.ReplaceAll("${Month}", month);
    result = result.ReplaceAll("${Day_Full}", dayFull);
    result = result.ReplaceAll("${Day}", day);

    return result;

};

Date.prototype.PMDateFormatFullMonthYear = function() {
    var date = this;
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var day = date.getDate();

    var monthText = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];

    var result = monthText + "-" + year;
    return result;

};
Date.prototype.PMDateJapaneseFormatFullMonthYear = function() {
    var date = this;
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var month = monthIndex + 1;
    var day = date.getDate();

    year = year + '年';
    var monthText = (month) + '月';

    var result = year + monthText;
    return result;

};

/// <summary>
/// Create by: Loc Doan
/// Create date: 2014-Mar-25
/// Description: remove the hours, minute, second
/// </summary>
Date.prototype.RoundDate = function() {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);

    this.setMilliseconds(0);

    return this;
};

Date.prototype.UtcToLocal = function() {

    var utcDate = new Date(this);

    var localDate = new Date();
    localDate.setUTCFullYear(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());

    localDate.setUTCHours(utcDate.getHours());
    localDate.setUTCMinutes(utcDate.getMinutes());
    localDate.setUTCSeconds(utcDate.getSeconds());

    localDate.setUTCMilliseconds(utcDate.getMilliseconds());

    this.setFullYear(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());

    this.setHours(localDate.getHours());
    this.setMinutes(localDate.getMinutes());
    this.setSeconds(localDate.getSeconds());

    this.setMilliseconds(localDate.getMilliseconds());

    return this;
};

Date.prototype.LocalToUtc = function() {
    var localDate = new Date(this);

    var utcDate = new Date();
    utcDate.setFullYear(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate());

    utcDate.setHours(localDate.getUTCHours());
    utcDate.setMinutes(localDate.getUTCMinutes());
    utcDate.setSeconds(localDate.getUTCSeconds());

    utcDate.setMilliseconds(localDate.getUTCMilliseconds());

    this.setFullYear(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());

    this.setHours(utcDate.getHours());
    this.setMinutes(utcDate.getMinutes());
    this.setSeconds(utcDate.getSeconds());

    this.setMilliseconds(utcDate.getMilliseconds());

    return this;
};

/// <summary>
/// Get current month short name
/// </summary>
Date.prototype.getMonthShortName = function() {
    var month_ShortName = new Array(12);
    month_ShortName = new Array(12);
    month_ShortName[0] = 'Jan';
    month_ShortName[1] = 'Feb';
    month_ShortName[2] = 'Mar';
    month_ShortName[3] = 'Apr';
    month_ShortName[4] = 'May';
    month_ShortName[5] = 'Jun';
    month_ShortName[6] = 'Jul';
    month_ShortName[7] = 'Aug';
    month_ShortName[8] = 'Sep';
    month_ShortName[9] = 'Oct';
    month_ShortName[10] = 'Nov';
    month_ShortName[11] = 'Dec';
    return month_ShortName[this.getMonth()];
};

Date.prototype.toYYYYMMMDDString = function() {
    return isNaN(this) ? '' : [this.getFullYear(), this.getMonthShortName(), this.getDate() > 9 ? this.getDate() : '0' + this.getDate()].join('/');
};

Date.prototype.PMConvertToString = function(format) {
    //the PM date format is one of:
    //yyyy-MM-dd
    //yyyy-MM-ddTHH:mm:ss (default)
    //yyyy-MM-ddTHH:mm:ss.fff

    if (typeof (format) === "undefined") {
        format = "yyyy-MM-ddTHH:mm:ss";
    }

    var date = this;

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var miliseconds = date.getMilliseconds();

    //padding with 0

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    if (miliseconds < 10) {
        miliseconds = "00" + miliseconds;
    } else if ((miliseconds < 100)) {
        miliseconds = "0" + miliseconds;
    }

    switch (format) {
        case "yyyy-MM-dd":
            return year + "-" + month + "-" + day;
        case "yyyy-MM-ddTHH:mm:ss":
            return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
        case "yyyy-MM-ddTHH:mm:ss.fff":
            return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + miliseconds;
        default:
            break;
    }

    return "";//invalid format
};


//IE8 Support method
//==================================================================================
// Add ECMA262-5 string trim if not supported natively
//
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += this.length;
        if (i < 0) i = 0;
        for (var n = this.length; i < n; i++)
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(find, i /*opt*/) {
        if (i === undefined) i = this.length - 1;
        if (i < 0) i += this.length;
        if (i > this.length - 1) i = this.length - 1;
        for (i++; i-- > 0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function(mapper, that /*opt*/) {
        var other = new Array(this.length);
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                other[i] = mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisArg */) {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}
if (!Array.prototype.every) {
    Array.prototype.every = function(tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function(tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}
//IE8 Support method
//==================================================================================


Array.prototype.CustomSort = function(options) {
    "use strict";

    var field = "";
    var type = "asc";

    if (this === void 0 || this === null)
        throw new TypeError();

    //if (typeof options != "object")
    //	throw new TypeError();

    if (typeof (options) === typeof ("")) {
        field = options;
    }

    if (typeof (options) === typeof ({})) {
        if (typeof (options.field) !== typeof (undefined)) {
            field = options.field;
        }

        if (typeof (options.type) !== typeof (undefined)) {
            type = options.type;
        }
    }

    this.sort(function(a, b) {
        if (type.toLowerCase() == 'asc') {
            //return a[field] > b[field];
            return (a[field] == b[field]) ? 0 : (a[field] > b[field]) ? 1 : -1;
        }
        else {
            //return a[field] < b[field];
            return (a[field] == b[field]) ? 0 : (a[field] < b[field]) ? 1 : -1;
        }
    });
};

Array.prototype.CustomFilter = function(conditionFunction) {
    "use strict";

    var field = "";
    var type = "asc";

    if (this === void 0 || this === null)
        throw new TypeError();

    //if (typeof options != "object")
    //	throw new TypeError();

    if (typeof (conditionFunction) !== "function") {
        conditionFunction = function(item, index) {
            return true;
        };
    }

    //this = $.grep(this, conditionFunction);

    return $.grep(this, conditionFunction);
};


//This method only shadow copy data of object
Array.prototype.shadowCopy = function() {
    var cloneArray = [];
    try {
        for (var idx = 0; idx < this.length; idx++) {
            cloneArray.push(JSON.parse(JSON.stringify(this[idx])));
        }
    } catch (ex) {
    }
    return cloneArray;
};


//overide or add function of jquery

//http://stackoverflow.com/questions/14645806/get-all-attributes-of-an-element-using-jquery
(function(old) {
    $.fn.attr = function() {
        if (arguments.length === 0) {
            if (this.length === 0) {
                return null;
            }

            var obj = {};
            $.each(this[0].attributes, function() {
                if (this.specified) {
                    obj[this.name] = this.value;
                }
            });
            return obj;
        }

        return old.apply(this, arguments);
    };
})($.fn.attr);

$.fn.hasScrollBar = function() {
    if (this.length == 0) return false;
    return this.get(0).scrollHeight > this.height();
};

//this function is set the the selector of the input to allow to input the number only
$.fn.PMInputNumberOnly = function(options) {
    //now have AllowNegative

    var Options = {
        AllowNegative: true,
        AllowEmpty: true
    };


    $.extend(Options, options);


    $.each(this, function(index, input) {
        if ($(input).is("input") === false) return;

        input.AllowNegative = Options.AllowNegative;
        input.AllowEmpty = Options.AllowEmpty;

        input.previousValue = $(input).val();

        $(input).off("keyup", PMHelper.InputChange_PreventInvalidNumber);
        $(input).on("keyup", PMHelper.InputChange_PreventInvalidNumber);

        $(input).off("change", PMHelper.InputChangeSupport_PreventInvalidNumber);
        $(input).on("change", PMHelper.InputChangeSupport_PreventInvalidNumber);
    });
};

//this function is allow the input to filter following the list items
$.fn.PMInputTextFilter = function(options) {

    //
    var Options = {
        Items: [],
        Function_Selected: function(value) {
            console.log(value);
        }
    };

    $.extend(Options, options);


    $.each(this, function(index, input) {
        if ($(input).is("input") === false) return;

        input.Items = Options.Items;
        input.Function_Selected = Options.Function_Selected;
        input.item_Click = function(event) {
            var control = $(this);
            var value = control.html();
            PMCommonFunction.RunCallback(input.Function_Selected, value);

            //remove the dom of the hint (items list)
            $(input).next(".MUSIC_MARVEL_TextFilter").remove();
        };

        input.lostfocus = function(event) {
            var control = $(this);
            //remove the dom of the hint (items list)

            //to set timeout because other event need this to set the value
            setTimeout(function() {
                //hide first, remove after then
                $(input).next(".MUSIC_MARVEL_TextFilter").hide();

                setTimeout(function() {
                    $(input).next(".MUSIC_MARVEL_TextFilter").remove();
                }, 300);
            }, 300);

        };

        $(input).off("keyup", PMHelper.InputChange_TextFilter).on("keyup", PMHelper.InputChange_TextFilter);

        //this is only keep the previous value (do not need)
        $(input).off("change", PMHelper.InputChangeSupport_PreventInvalidNumber).on("change", PMHelper.InputChangeSupport_PreventInvalidNumber);

        $(input).off("blur", input.lostfocus).on("blur", input.lostfocus);
    });
};


$.fn.PMKeyFunctionsForGrid = function(options) {
    //options temporary not use

    var Options = {};

    $.extend(Options, options);


    $.each(this, function(index, grid) {
        var control = $(grid);

        //this time, only support for class Grid_content
        if (control.is(".Grid_content") === false) return;

        //only assign this once time for all the time using
        if (this.hasKeyFunctionsForGrid === true) return;

        this.hasKeyFunctionsForGrid = true;
        control.addClass("Grid_NormalHover");

        this.interval = null;

        var keyup = function(event) {
            if (this.interval !== null) {
                //clear interval
                clearInterval(this.interval);
                this.interval = null;
            }

            control.addClass("Grid_NormalHover");

            switch (event.which) {
                case KEYCODE.Home:
                    PMHelper.MCustomScrollbarKeySupport_ScrollHome(control, event);
                    break;
                case KEYCODE.End:
                    PMHelper.MCustomScrollbarKeySupport_ScrollEnd(control, event);
                    break;
                case KEYCODE.ArrowUp:
                    PMHelper.MCustomScrollbarKeySupport_ScrollDown(control, event);
                    break;
                case KEYCODE.ArrowDown:
                    PMHelper.MCustomScrollbarKeySupport_ScrollUp(control, event);
                    break;
                case KEYCODE.PageUp:
                    PMHelper.MCustomScrollbarKeySupport_ScrollPageUp(control, event);
                    break;
                case KEYCODE.PageDown:
                    PMHelper.MCustomScrollbarKeySupport_ScrollPageDown(control, event);
                    break;
                case KEYCODE.Escape:
                    PMHelper.IsDebug = true;
                    break;
                default:
                    break;

            }

        };


        var keydown = function(event) {
            control.addClass("Grid_NormalHover");

            if (this.interval !== null) return;

            switch (event.which) {
                case KEYCODE.Home:
                case KEYCODE.End:
                case KEYCODE.ArrowUp:
                case KEYCODE.ArrowDown:
                case KEYCODE.PageUp:
                case KEYCODE.PageDown:
                    this.interval = setInterval(function() {
                        repeat(control, event);
                    }, 300);
                    break;
                default:
                    break;
            }

        };

        var repeat = function(control, event) {
            switch (event.which) {
                case KEYCODE.Home:
                    PMHelper.MCustomScrollbarKeySupport_ScrollHome(control, event);
                    break;
                case KEYCODE.End:
                    PMHelper.MCustomScrollbarKeySupport_ScrollEnd(control, event);
                    break;
                case KEYCODE.ArrowUp:
                    PMHelper.MCustomScrollbarKeySupport_ScrollDown(control, event);
                    break;
                case KEYCODE.ArrowDown:
                    PMHelper.MCustomScrollbarKeySupport_ScrollUp(control, event);
                    break;
                case KEYCODE.PageUp:
                    PMHelper.MCustomScrollbarKeySupport_ScrollPageUp(control, event);
                    break;
                case KEYCODE.PageDown:
                    PMHelper.MCustomScrollbarKeySupport_ScrollPageDown(control, event);
                    break;
                default:
                    break;
            }
        };

        var mouse_enter = function(event) {
            $(window).off("keyup", keyup);
            $(window).on("keyup", keyup);

            $(window).off("keydown", keydown);
            $(window).on("keydown", keydown);
        };

        var mourse_leave = function(event) {
            $(window).off("keyup", keyup);
            $(window).off("keydown", keydown);

            if (this.interval !== null) {
                //clear interval
                clearInterval(this.interval);
                this.interval = null;
            }
        };

        var mourse_move = function(event) {
            if (this.interval !== null) {
                //clear interval
                clearInterval(this.interval);
                this.interval = null;
            }

            control.removeClass("Grid_NormalHover");
            $(".Grid_IsHover", control).removeClass("Grid_IsHover");

            //this is to remove class for normal selected
            $(".Grid_SelectedRow", control).removeClass("Grid_SelectedRow");

            //this is to remove the normal selected cell
            $(".Grid_SelectedCell", control).removeClass("Grid_SelectedCell");

            control.mouseOffsetY = event.pageY;
        };

        control.off("mouseenter mouseleave mousemove");
        control.on("mouseenter", mouse_enter);
        control.on("mouseleave", mourse_leave);
        control.on("mousemove", mourse_move);

    });
};

//thi function is to disable the element, set property disabled and also remove the attrib
$.fn.Disabled = function(disabled) {
    if (typeof (disabled) === "undefined") disabled = true;

    $.each(this, function(index, element) {
        element.disabled = disabled;
        if (disabled) {
            $(element).attr("disabled", "disabled");
        }
        else {
            $(element).removeAttr("disabled");
        }
    });
};

$.fn.Enabled = function(enabled) {
    if (typeof (enabled) === "undefined") enabled = true;

    $.each(this, function(index, element) {
        element.disabled = !enabled;
        if (enabled) {
            $(element).removeAttr("disabled");
        }
        else {
            $(element).attr("disabled", "disabled");
        }
    });
};


//this function is to add the feature input with instruction (the initial text in the input box)
//this function is base on the attr hint-value to get the value of the hint
$.fn.InputWithInstruction = function(options) {
    //now have AllowNegative

    var HINT_VALUE_KEY = "hint-value";
    var hintValueIfNotSet = "test";

    var Options = {};

    $.extend(Options, options);

    var events = {};

    //when focus, if the input is not yet --> set empty, change class
    events.focusin = function(event) {
        var input = $(this);

        if (PMCommonFunction.IsInputNotFilledYet(input) === true) {
            //set empty
            input.val("");

            //clear the class
            PMCommonFunction.ChangeInputToFilledYet(input);
        }
    };

    //if lost focus, if value = empty --> set value = default value
    events.focusout = function(event) {
        var input = $(this);

        if (input.val() === "") {
            //set default value
            var hintValue = input.attr(HINT_VALUE_KEY) || hintValueIfNotSet;

            //change class
            PMCommonFunction.ChangeInputToNotFilledYet(input);

            //change to default value
            input.val(hintValue);
        }
    };

    var unbind = function() {
        var input = $(this);
        $(input).off("focusin", events.focusin);
        $(input).off("focusout", events.focusout);
    };

    $.each(this, function(index, input) {
        if ($(input).is("input") === false) return;

        var hintValue = $(input).attr(HINT_VALUE_KEY) || hintValueIfNotSet;
        if ($(input).val() !== hintValue) {
            $(input).val(hintValue);
        }

        if (hintValue) {
            if ($(input).is("[title]") === false) {
                $(input).attr("title", hintValue);
            }
        }

        $(input).off("focusin", events.focusin).on("focusin", events.focusin);
        $(input).off("focusout", events.focusout).on("focusout", events.focusout);

        input.unbind = unbind;
    });
};

$.fn.InputWithInstruction_Unbind = function() {

    $.each(this, function(index, input) {
        if ($(input).is("input") === false) return;

        if (typeof(input.unbind) === "function") {
            PMCommonFunction.RunCallback(input.unbind);
        }
    });
};

$.fn.fastClickDevice = function(clickFunction) {
    var events = {};
    var SAFE_DELAY = 200;

    //when focus, if the input is not yet --> set empty, change class
    events.touchStart = function(event) {
        var button = $(this);

        event.preventDefault();
        setTimeout(function() {
            PMCommonFunction.RunCallback(clickFunction, event, button);
        }, SAFE_DELAY);
    };

    var unbind = function() {
        var button = $(this);
        $(button).off("touchstart", events.touchStart);
    };

    //travel all the item and bind event
    $.each(this, function(index, button) {

        $(button).off("touchstart", events.touchStart).on("touchstart", events.touchStart);

        button.unbind = unbind;
    });
};

$.fn.fastClickDevice_Unbind = function() {
    $.each(this, function(index, button) {
        if (typeof(button.unbind) === "function") {
            PMCommonFunction.RunCallback(button.unbind);
        }
    });
};


//this function is to use the div as the checkbox with image
//options is now not used
$.fn.InputCheckboxWithImage = function(options) {
    var Options = {};

    $.extend(Options, options);

    $.each(this, function(index, input) {
        if ($(input).is("div") === false) return;

        input.on_click = function(event) {
            var control = $(this);
            var allow;
            if (control.is(".checked")) {
                //fire the change event. before change the check the event run the function, if function return false, do not change
                if (typeof (input.changed) == 'function') {
                    allow = input.changed(false);
                    if (typeof(allow) === UNDEFINED) allow = true;
                }
                else {
                    allow = true;
                }

                if (allow) {
                    control.removeClass('checked').addClass('unchecked');
                }
            }
            else {
                //fire the change event. before change the check the event run the function, if function return false, do not change
                if (typeof (input.changed) == 'function') {
                    allow = input.changed(true);
                    if (typeof(allow) === UNDEFINED) allow = true;
                }
                else {
                    allow = true;
                }

                if (allow) {
                    control.removeClass('unchecked').addClass('checked');
                }
            }
        };

        $(input).off("click", input.on_click);
        $(input).on("click", input.on_click);

        if (typeof (Options.checkChanged) == 'function') {
            input.changed = function(checked) {
                PMCommonFunction.RunCallback(Options.checkChanged, checked);
            };
        }
        ;

        input.unbind = function() {
            $(input).off("click", input.on_click);
        };
    });
};

$.fn.InputCheckboxWithImage_Unbind = function() {
    $.each(this, function(index, input) {
        if (typeof(input.unbind) === "function") {
            PMCommonFunction.RunCallback(input.unbind);
        }
    });
};


/*-- END THIS is for add method for prototype--*/


var windowHeight = window.innerHeight;
if (typeof (PM) != 'undefined') {
    if (!PM.Config.IS_MOBILE) {
        try {
            windowHeight = $(document).height();
        } catch (err) {
        }
    }
}
$(window).resize(function() {
    if (typeof (PM) != 'undefined') {
        if (PM.Config.IS_MOBILE) {
            return;
        }
    } else {
        return;
    }
    windowHeight = window.innerHeight;

    try {
        windowHeight = $(document).height();
    } catch (err) {
    }

    var body = $();

    if ($('body').length > 0) {
        body = $($('body')[0]);
    }

    $(body).css("overflow", "hidden");
    // modal background
    $('.modal-background').each(function(index, item) {
        if ($(item).css("display") == "block") {
            try {
                $(item).width(body.width());
                $(item).height(windowHeight);
                $(item).css("top", $(item).position().top - ($(item).offset().top) + "px");
                $(item).css("left", $(item).position().left - ($(item).offset().left) + "px");
            } catch (err) {
            }
        }
    });

    //'PM-modal-background'
    $('.PM-modal-background').each(function(index, item) {
        if ($(item).css("display") == "block") {
            try {
                $(item).width(body.width());
                $(item).height(windowHeight);
                $(item).css("top", $(item).position().top - ($(item).offset().top) + "px");
                $(item).css("left", $(item).position().left - ($(item).offset().left) + "px");
            } catch (err) {
            }
        }
    });

    // modal-background-myFiles
    $('.modal-background-myFiles').each(function(index, item) {
        if ($(item).css("display") == "block") {
            try {
                $(item).width(body.width());
                $(item).height(windowHeight);
                $(item).css("top", $(item).position().top - ($(item).offset().top) + "px");
                $(item).css("left", $(item).position().left - ($(item).offset().left) + "px");
            } catch (err) {
            }
        }
    });

    //$(body).css("overflow", "auto");

    // current window
    try {
        $(".PM-Popup-OuterDiv_W8").not('.NotCenter').each(function(index, item) {
            if ($(item).css("display") == "block") {
                //$(item).css("top", ($(item).position().top - ($(item).offset().top)) + ($(window).height() - $(item).outerHeight()) / 2 + "px");
                //$(item).css("left", $(item).position().left - ($(item).offset().left) + ($(window).width() - $(item).outerWidth()) / 2 + "px");
                SetWindowCenter($(item));
            }
        });
    } catch (err) {
    }
    try {
        $(".PM-Popup-OuterDiv").not('.NotCenter').each(function(index, item) {
            if ($(item).css("display") == "block") {
                //$(item).css("top", ($(item).position().top - ($(item).offset().top)) + ($(window).height() - $(item).outerHeight()) / 2 + "px");
                //$(item).css("left", $(item).position().left - ($(item).offset().left) + ($(window).width() - $(item).outerWidth()) / 2 + "px");
                SetWindowCenter($(item));
            }
        });
    } catch (err) {
    }

    try {
        $(".Popup_OuterDiv1").not('.NotCenter').each(function(index, item) {
            if ($(item).css("display") == "block") {
                //$(item).css("top", ($(item).position().top - ($(item).offset().top)) + ($(window).height() - $(item).outerHeight()) / 2 + "px");
                //$(item).css("left", $(item).position().left - ($(item).offset().left) + ($(window).width() - $(item).outerWidth()) / 2 + "px");
                SetWindowCenter($(item));
            }
        });
    } catch (err) {
    }

    KendoHelper.SetScrollbarForAllGrid();
});
showCommonMessage = function(_type, _msg) {
    var msg = {};
    if (_msg == undefined) {
        msg = {
            Title: "",
            Text: "",
            Icon: (new ConfirmDialog_Icon()).ERROR
        };
    } else {
        msg = _msg;
    }
    switch (_type) {
        case SaveValueError.NotPermission:
            msg.Title = "No permission";
            msg.Text = "You do not have permission to do this task.";
            break;
        case SaveValueError.Error_Data:
            msg.Title = "Data is error";
            msg.Text = "Data is invalid, please check it again.";
            break;
        default:
            break;
    }
    showErrorMessage(msg.Text, msg.Title, false, msg.Icon);
};
///------------------------------------------------------------------------------------------------------------------------------------
/// <summary>
//  20090731 mkwan - add loading URL to the target URL
//  20090814 mkwan - check double /
/// </summary>
function addLoadingURL(value) {
    try {
        if (SLGwebserverURL != '') {
            if (value.toLowerCase().indexOf('//') > -1) {

                if (value.toLowerCase().indexOf('global/webpages/loading.aspx') == -1) {
                    if (value.toLowerCase().indexOf('http') == -1) {
                        value = SLGwebserverURL + value;
                    }

                    if (SLGwebserverURL == 'http://localhost/') {
                        //Testing on Development Machine
                        return SLGwebserverURL + 'global/global/webpages/loading.aspx?LoadingTargetURL=' + value.replace(/&/g, '[$]');
                    }
                    else {
                        return SLGwebserverURL + 'global/webpages/loading.aspx?LoadingTargetURL=' + value.replace(/&/g, '[$]');
                    }
                }
                else {
                    return value;
                }

            }
            else {
                //No Loading - Eg some PopupResizableWindow just pass in filename
                return value;
            }
        }
        else {
            //Testing on Development Machine
            return 'http://localhost/global/global/webpages/loading.aspx?LoadingTargetURL=' + value.replace(/&/g, '[$]');
        }
    }
    catch (e) {
        alert("addLoadingURL: " + e.message);
    }
}


///----------------------------------------------------------------------------
/// <summary>
///   20081021 mkwan - Opens Obout Window
///   20081027 mkwan - Make it able to popup multiple Windows using 1 Obout Window Control
///   20081217 ffazio - Removed parameter ParentWinID
/// </summary>
function winOpen(Title, URL, Width, Height, Project, WinID, ParentPath, showCloseButton) {
    try {
        if (typeof (showCloseButton) == 'undefined') {
            showCloseButton = true;
        }

        //20081217 ffazio - Get the opening windows id from its iframe id
        var ParentWinID = null, isResizable = false, isMax = false;
        try {
            if (window) {
                if (window.frameElement) {
                    if (window.frameElement.id) {
                        //Make sure it is an obout window by checking for the existence of the '_window_ct' suffix in the id
                        if (window.frameElement.id.toString().toLowerCase().indexOf('_window_ct') != -1) {
                            var _split = window.frameElement.id.toString().split('_');
                            //Further check this by making shure there a 3 strings after split
                            if (_split.length == 3) {
                                //Get the first string from the split 
                                ParentWinID = _split[0];
                                //alert(ParentWinID + '_open'); //For Testing
                            }
                        }
                    }
                }
            }
        } catch (e) {
        }

        var _URL;
        var _WinID;
        var _ParentPath;
        var _ParentWinID;

        //20081212 ffazio - Normalise ParentWinID Parameter
        if (!ParentWinID || ParentWinID == '') {
            _ParentWinID = '';
        }
        else {
            _ParentWinID = ParentWinID;
        }

        if (URL.indexOf('http') > -1) {
            _URL = URL;
        }
        else {
            _URL = slgWebserverURL(Project + '/webpages/' + URL);
        }

        if (!WinID) {
            _WinID = 'myWin';
        }
        else {
            _WinID = WinID;
        }

        if (!ParentPath || ParentPath == '') {
            _ParentPath = window.parent;
        }
        else {
            _ParentPath = ParentPath;
        }

        //var showCloseButton = true;

        /*
         if (WinID == 'winImpersonate') {
         showCloseButton = false;
         }
         else
         */

        if ((WinID == 'winReport') &&
            (Project.toString().toLowerCase() == 'global') &&
            (URL.toString().toLowerCase().indexOf('attendancereporttype') >= 0)) {
            //Attendance Reports
            isResizable = true;
            isMax = true;
        }

        //        //Added By ssoh 20090417 - If height is greater than 600px, allow window to be resizable and enabled maximize button.
        //        if (Height > 600) {
        //            isResizable = true;
        //            isMax = true;
        //        }

        //Added By ssoh 20090416 - resize window if is larger than the screen size
        //Check if the height/width is larger than the screen height/width window.screen.availHeight window.screen.availWidth
        var _availableWidth;
        var _availableHeight;
        try {
            _availableHeight = top.document.documentElement.offsetHeight;
            _availableWidth = top.document.documentElement.offsetWidth;
        } catch (e) {
            try {
                _availableHeight = window.screen.availHeight - 149;
                _availableWidth = window.screen.availWidth - 29;
            } catch (e) {
            }
        }

        if (_availableHeight) {
            if (Height > _availableHeight) {
                Height = _availableHeight - 6;
                isResizable = true;
                //isMax = true;
            }
        }
        if (_availableWidth) {
            if (Width > _availableWidth) {
                Width = _availableWidth - 6;
                isResizable = true;
                //isMax = true;
            }
        }

        var oWin = _ParentPath.oWindowManager.getWindowById(_WinID + "_Window");

        if (!oWin) {
            oWin = _ParentPath.oWindowManager.newWindow(_WinID + "_Window", "", showCloseButton, isMax, false, isResizable, true, true);

            if (!oWin) {
                oWin = oWindowManager.newWindow(_WinID + "_Window", "", showCloseButton, isMax, false, isResizable, true, true);
            }
        }

        //20090731 mkwan - use loading page
        _URL = addLoadingURL(_URL);

        //Decrease window size for blue theme
        Width -= Width;
        Height -= Height;

        oWin.setUrl(_URL);
        oWin.setSize(Width, Height);
        oWin.setTitle(Title);
        oWin.screenCenter();
        if ((WinID == 'winReport') &&
            (Project.toString().toLowerCase() == 'global') &&
            (URL.toString().toLowerCase().indexOf('attendancereporttype') >= 0)) {
            oWin.setMode('maximize');
        }

        //oWin.bringToFront();  //DO NOT USE THIS

        //        oWin.pf.OnPreOpen = function() {
        //            oWin.setUrl(slgWebserverURL('Global/webpages/progressbar.aspx'));
        //        }

        //20081212 mkwan - on closing forces all the window to bring to front to avoid window disable problem
        oWin.pf.OnClose = function() {

            //20090729 mkwan - commented it to avoid JS error            
            //20100121 ssoh - throwing js error when callback from server to client
            var _IE = document.all ? true : false;
            if (_IE == true) {
                oWin.setUrl(slgWebserverURL('Global/webpages/progressbar.aspx'));
            }

            //20081212 mkwan - Bring parent window to front
            //var oWindows = _ParentPath.oWindowManager.getWindows();
            //if (!oWindows) {
            //    oWindows = oWindowManager.getWindows();
            //}
            //for (var i = 0; i < oWindows.length; i++)
            //      oWindows[i].bringToFront();

            //20081215 ffazio - Bring parent window to front
            try {
                if (_ParentWinID != '') {
                    winMe(_ParentWinID, _ParentPath).bringToFront();
                    //alert(ParentWinID + '_close'); //For Testing
                }
            } catch (e) {
            }

            //20081212 ffazio - This code will call an event on the currently open window called winOnClose() if it is present
            try {
                var _iframe = _ParentPath.document.getElementById(_WinID + '_Window_ct');
                if (_iframe) {
                    if (typeof _iframe.contentWindow.winOnClose == "function") {
                        _iframe.contentWindow.winOnClose();
                    }
                }
            } catch (e) {
            }
        };

        oWin.Open();


        //20081212 ffazio - This code will ensure that this window is in front
        oWin.bringToFront();
    }
    catch (e) {
        //alert("winOpen: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081021 mkwan - Check Obout Window exists
/// </summary>
function winExists(WinID, ParentPath) {
    try {

        var _ParentPath;
        var _WinID;

        if (!WinID || WinID == '') {
            _WinID = 'myWin';
        }
        else {
            _WinID = WinID;
        }

        if (!ParentPath || ParentPath == '') {
            _ParentPath = window.parent;
        }
        else {
            _ParentPath = ParentPath;
        }

        return _ParentPath.oWindowManager.getWindowById(_WinID + "_Window");
    }
    catch (e) {
        alert("winExists: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081021 mkwan - Closes Obout Window
/// </summary>
function winClose(WinID, ParentPath) {
    try {

        var _ParentPath;
        var _WinID;

        if (!WinID || WinID == '') {
            _WinID = 'myWin';
        }
        else {
            _WinID = WinID;
        }

        if (!ParentPath || ParentPath == '') {
            _ParentPath = window.parent;
        }
        else {
            _ParentPath = ParentPath;
        }

        var oWin = _ParentPath.oWindowManager.getWindowById(_WinID + "_Window");

        if (!oWin) {
            oWin = oWindowManager.getWindowById(_WinID + "_Window");
        }

        try {
            oWin.Close();
        }
        catch (e) {
        }
    }
    catch (e) {
        alert("winClose: " + e.message);
    }
}


//----------------------------------------------------------------------------
/// <summary>
///   20081021 mkwan - Closes Obout Window
/// </summary>
function winActiveClose(ParentPath) {
    try {

        if (!ParentPath || ParentPath == '') {
            ParentPath = window.parent;
        }

        var oWin = ParentPath.oWindowManager.getActiveWindow();

        oWin.Close();
    }
    catch (e) {
        alert("winActiveClose: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081029 mkwan - Refresh Parent Iframe
///   20090121 mkwan - Add a new includeQueryString parameter
/// </summary>
function winRefreshParentIframe(iframeName, includeQueryString, appendQueryString) {
    try {
        if (typeof (includeQueryString) == 'undefined') {
            includeQueryString = true;
        }

        if (typeof (appendQueryString) == 'undefined') {
            appendQueryString = '';
        }

        var Iframe = window.parent.document.getElementById(iframeName);

        if (Iframe) {
            if (includeQueryString) {
                Iframe.contentWindow.location.href = Iframe.contentWindow.location + appendQueryString;
            }
            else {
                if (Iframe.contentWindow.location.toString().indexOf('?') > -1) {
                    var _arrLocation = Iframe.contentWindow.location.toString().split('?');
                    Iframe.contentWindow.location.href = _arrLocation[0] + appendQueryString;
                }
                else {
                    Iframe.contentWindow.location.href = Iframe.contentWindow.location + appendQueryString;
                }
            }
        }
        else {
            if (includeQueryString) {
                window.parent.document.location.href = window.parent.document.location + appendQueryString;
            }
            else {
                if (window.parent.document.location.toString().indexOf('?') > -1) {
                    var _arrLocation = window.parent.document.location.toString().split('?');
                    window.parent.document.location.href = _arrLocation[0] + appendQueryString;
                }
                else {
                    window.parent.document.location.href = window.parent.document.location + appendQueryString;
                }
            }
        }

    }
    catch (e) {
        alert("winRefreshParentIframe: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081029 mkwan - Refresh Parent OboutWindow
/// </summary>
function winRefreshParentOboutWindow(WinID, iframeName) {
    try {
        var oWin = window.parent.document.getElementById(WinID + '_Window_ct');
        if (oWin) {
            oWin.contentWindow.location = window.parent.document.getElementById(WinID + '_Window_ct').contentWindow.location.href;
        }
        else {
            winRefreshParentIframe(iframeName);
        }
    }
    catch (e) {
        alert("winRefreshParentOboutWindow: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081029 mkwan - Refresh Current Window
/// </summary>
function winRefresh() {
    try {
        document.location.href = document.location;
    }
    catch (e) {
        alert("winRefresh: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081103 mkwan - Get current window object
/// </summary>
function winMe(WinID, ParentPath) {
    try {
        if (!WinID || WinID == '') {
            WinID = 'myWin';
        }

        if (!ParentPath || ParentPath == '') {
            ParentPath = window.parent;
        }

        var oWin = ParentPath.oWindowManager.getWindowById(WinID + "_Window");

        if (!oWin) {
            oWin = oWindowManager.getWindowById(WinID + "_Window");
        }

        return oWin;
    }
    catch (e) {
        alert("winMe: " + e.message);
    }
}

//----------------------------------------------------------------------------
/// <summary>
///   20081103 mkwan - Get window iframe object
///   20081110 ssoh- got rid of the contentWindow
/// </summary>
function winIframe(WinID, ParentPath) {
    try {
        if (!WinID || WinID == '') {
            WinID = 'myWin';
        }

        if (!ParentPath || ParentPath == '') {
            ParentPath = window.parent;
        }
        return ParentPath.document.getElementById(WinID + '_Window_ct');
    }
    catch (e) {
        alert("winIframe: " + e.message);
    }
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Trim the passing string.
/// </summary>
function trim(sString) {
    while (sString.substring(0, 1) == ' ') {
        sString = sString.substring(1, sString.length);
    }

    while (sString.substring(sString.length - 1, sString.length) == ' ') {
        sString = sString.substring(0, sString.length - 1);
    }

    return sString;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Pop up a non resizable window
/// </summary>
function PopupWindow(sURL, sTitle, window_width, window_height) {
    sTitle = supertrim(sTitle);

    if (window_height) {
        if (window_height != 0 || window_height != '') {
            window_height -= 32;
        }
    }

    //20090731 mkwan - use loading page
    sURL = addLoadingURL(sURL);

    openPopup(sURL, sTitle, window_width, window_height, '', '');
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Pop up a resizable window
/// </summary>	
function PopupResizableWindow(sURL, sTitle, window_width, window_height) {
    sTitle = supertrim(sTitle);

    if (window_height) {
        if (window_height != 0 || window_height != '') {
            window_height -= 32;
        }
    }

    //20090731 mkwan - use loading page
    //sURL = addLoadingURL(sURL);

    openResizablePopup(sURL, sTitle, window_width, window_height, false);
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------	
/// <summary>
///   Pop up a resizable window
/// </summary>	
function PopupResizableWindowReturnObject(sURL, sTitle, window_width, window_height) {
    sTitle = supertrim(sTitle);

    if (window_height) {
        if (window_height != 0 || window_height != '') {
            window_height -= 32;
        }
    }

    //20090731 mkwan - use loading page
    //sURL = addLoadingURL(sURL);

    return openResizablePopup(sURL, sTitle, window_width, window_height, false);
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

/// <summary>
///   Pop up a non resizable modal window
///   Note: Doesn't work with firefox
/// </summary>
function openModalPopup(sURL, sTitle, window_width, window_height, iXPos, iYPos) {
    sTitle = supertrim(sTitle);

    //http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/methods/showmodaldialog.asp
    var obj = new Object();
    obj.Title = sTitle;
    if (window.name == '')
        obj.Container = window.parent;
    else
        obj.Container = window;

    var h, w;
    if (window_width == 0 && window_height == 0) {
        h = screen.height; //height of screen
        w = screen.width; //width of the screen
    }
    else {
        h = window_height;
        w = window_width;
    }

    if (iXPos == '' && iYPos == '') {
        window.showModalDialog(sURL, obj, 'center:yes;dialogWidth:' + w + 'px;scroll:yes;dialogHeight:' + h + 'px;help:no;status:yes;unadorned:yes');
    }
    else {
        window.showModalDialog(sURL, obj, 'dialogLeft:' + iXPos + ';dialogTop:' + iYPos + ';dialogWidth:' + w + 'px;scroll:yes;dialogHeight:' + h + 'px;help:no;status:yes;unadorned:yes');
    }
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

/// <summary>
///   Pop up a resizable modal window
///   Note: Doesn't work with firefox
/// </summary>
function openResizableModalPopup(sURL, sTitle, window_width, window_height) {
    sTitle = supertrim(sTitle);

    var obj = new Object();
    obj.Title = sTitle;
    if (window.name == '')
        obj.Container = window.parent;
    else
        obj.Container = window;

    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        window_height = screen.height; //height of screen
        window_width = screen.width; //width of the screen		
    }

    window.showModalDialog(sURL, obj, 'center:yes;dialogWidth:' + window_width + 'px;scroll:yes;dialogHeight:' + window_height + 'px;help:no;status:yes;resizable:yes');
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

function openMenuPopup(sURL, sTitle, window_width, window_height) {
    sTitle = supertrim(sTitle);

    var h, w;
    var l, t;
    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        h = screen.availHeight; //height of screen
        w = screen.availWidth; //width of the screen
        l = 0;
        t = 0;
    }
    else {
        h = screen.height; //height of screen, not just the parent window
        w = screen.width; //width of the screen, not just the parent window
        l = parseInt((w - window_width) / 2);
        t = parseInt((h - window_height) / 2);
    }

    popupWin = window.open(sURL, sTitle, 'status=yes,resizable=no,menubar=yes,location=no,scrollbars=yes,dependent,width=' + w + ',height=' + h + ',left=' + l + ',top=' + t);

    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        try {
            popupWin.resizeTo(screen.availWidth, screen.availHeight);
        } catch (e) {
        }
    }

    if (window.focus) {
        popupWin.focus();
    }
}
//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Pop up a non resizable window
/// </summary>
function openPopup(sURL, sTitle, window_width, window_height, iXPos, iYPos) {
    sTitle = supertrim(sTitle);

    var l, t;

    if ((iXPos == 0 && iYPos == 0) || (iXPos == '' && iYPos == '')) {
        l = parseInt((screen.width - window_width) / 2);
        t = parseInt((screen.height - window_height) / 2);
    }
    else {
        l = iXPos;
        t = iYPos;
    }

    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        window_width = screen.availHeight;
        window_height = screen.availWidth;
    }

    popupWin = window.open(sURL, sTitle, 'status,resizable=no,menubar=no,location=no,scrollbars=no,dependent,width=' + window_width + ',height=' + window_height + ',left=' + l + ',top=' + t);

    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        try {
            popupWin.resizeTo(screen.availWidth, screen.availHeight);
        } catch (e) {
        }
    }

    if (window.focus) {
        popupWin.focus();
    }
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Pop up a resizable window
/// </summary>
function openResizablePopup(sURL, sTitle, window_width, window_height, show_loading_page) {
    sTitle = supertrim(sTitle);

    var h, w;
    var l, t;

    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        h = screen.availHeight; //height of screen
        w = screen.availWidth; //width of the screen
        l = 0;
        t = 0;
    }
    else {
        h = window_height; //height of screen, not just the parent window
        w = window_width; //width of the screen, not just the parent window			
        l = parseInt((screen.width - window_width) / 2);
        t = parseInt((screen.height - window_height) / 2);
    }

    if (show_loading_page == true) {
        //20090731 mkwan - use loading page
        sURL = addLoadingURL(sURL);
    }
    popupWin = window.open(sURL, sTitle, 'status=yes,resizable=yes,menubar=no,location=no,scrollbars=yes,dependent,width=' + w + ',height=' + h + ',left=' + l + ',top=' + t);

    if ((window_width == 0 && window_height == 0) || (window_width == '' && window_height == '')) {
        try {
            popupWin.resizeTo(screen.availWidth, screen.availHeight);
        } catch (e) {
        }
    }

    if (window.focus) {
        popupWin.focus();
    }

    return popupWin;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Pop up a non resizable modal window
///   Note: Doesn't work with firefox
/// </summary>
function openPopupModal(sURL, window_width, window_height) {
    showModelessDialog(sURL, window, 'resizable:no;scroll:no;unadorned:no;dialogWidth:' + window_width + 'px;dialogHeight:' + window_height + 'px');
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Validate date
/// </summary>
function checkvdate(d, m, yyr) {
    var today = new Date();
    var isLeapYear = "";
    var errorlist = "";

    var selectdate = new Date(yyr, m, d);

    if (isNaN(d) || isNaN(yyr)) {
        errorlist += "  " + translateFromKey('__DATE_CAN_ONLY_CONTAIN_NUMBERS', '-  Date can only contain numbers') + " \n\n";
    }

    // check that if month is Feb, Apr, Jun, Sep, Nov then day does not exceed 30
    if (m == "04" || m == "06" || m == "09" || m == "11") {
        if (d > 30) {
            errorlist += translateFromKey('SORRY_THE_NUMBER_OF_DAYS_IS_NOT_VALID_FOR_THE_GIVEN_MONTH_01__30_ONLY', 'Sorry the number of days is not valid for the given month 01 - 30 only') + " \n\n";
        }
    }
    if (m == "02") {
        //check ifyear is leapyear that day doesn't exceed 29
        if (yyr % 400 == 0) {
            isLeapYear = true;
        }
        if ((yyr % 4 == 0) && (yyr % 100 != 0)) {
            isLeapYear = true;
        }
        if ((isLeapYear) && (d > 29)) {
            errorlist += " " + translateFromKey('__FEBRUARY_DATE_IS_NOT_VALID_FOR_THE_GIVEN_YEAR', '-  February date is not valid for the given year') + " \n\n";
            // else check that value doesn't exceed 28
        }
        if (!(isLeapYear) && (d > 28)) {
            errorlist += " " + translateFromKey('__FEBRUARY_DATE_IS_NOT_VALID_FOR_THE_GIVEN_YEAR', '-  February date is not valid for the given year') + " \n\n";
        }
    }


    if (errorlist != "") {
        alert(errorlist);
        return false;
    } else {
        return true;
    }


}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   A better string trimming method
/// </summary>
function supertrim(s) {
    return s.replace(/\s/g, "");
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Trim the passing string.
/// </summary>
function trim(inputString) {

    if (typeof inputString != "string") {
        return inputString;
    }

    var retValue = inputString;
    var ch = retValue.substring(0, 1);

    // remove leading spaces.
    while (ch == " ") {
        retValue = retValue.substring(1, retValue.length);
        ch = retValue.substring(0, 1);
    }

    // remove trailing spaces.
    ch = retValue.substring(retValue.length - 1, retValue.length);
    while (ch == " ") {
        retValue = retValue.substring(0, retValue.length - 1);
        ch = retValue.substring(retValue.length - 1, retValue.length);
    }

    /*
     // replaces double spaces with single space.
     while (retValue.indexOf("  ") != -1) {
     retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length);
     }
     */

    return retValue; // Return the trimmed string back to the user
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Used to verify a string contains a specific sequence of characters
/// </summary>
function contains(fullString, testString) {
    // used to verify a string contains a specific sequence of characters
    // examples:
    // email : if (!contains(form.email_addr.value, "@"))
    istrue = false;
    fullLength = fullString.length;
    testLength = testString.length;
    //alert(fullLength);
    //alert(testLength);
    for (i = 0; i <= fullLength; i++) {
        comp = fullString.substring(i - 1, fullLength);
        comp = comp.substring(0, testLength);
        //alert(comp);
        if (comp == testString) {
            istrue = true;
            return istrue;
        }
    }
    return istrue;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Convert value to money type with 2 decimal places
/// </summary>
function parseMoney(cValue) {
    return Math.round(cValue * 100) / 100;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Round the value to 2 decimal places
/// </summary>
function roundAmount(n) {
    var s = "" + Math.round(n * 100) / 100;
    var i = s.indexOf('.');
    if (i < 0) return s + ".00";
    var t = s.substring(0, i + 1) +
        s.substring(i + 1, i + 3);
    if (i + 2 == s.length) t += "0";
    return t;
}


/// <summary>
///   Check whether the passing value is a digit
/// </summary>
function isDigit(theDigit) {
    var digitArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], j;

    for (j = 0; j < digitArray.length; j++) {
        if (theDigit == digitArray[j])
            return true;
    }
    return false;

}

/// <summary>
///   Check whether the passing value is a positive integer
/// </summary>
function isPositiveInteger(theString) {
    var theData = new String(theString);

    if (!isDigit(theData.charAt(0)))
        if (!(theData.charAt(0) == '+'))
            return false;

    for (var i = 1; i < theData.length; i++)
        if (!isDigit(theData.charAt(i)))
            return false;
    return true;
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

/// <summary>
///   Check if the parameter is a date value
/// </summary>
function checkDate(theField) {
    dPart = theField.split('/');
    if (dPart.length == 3) {
        theDate = new Date(theField);
        dPart = theField.split('/');
        return isDate(dPart[0], dPart[1], dPart[2]);
    } else {
        return false;
    }
}

/// <summary>
///   Check for Y2K year
/// </summary>
function y2k(number) {
    return (number < 1000) ? number + 1900 : number;
}

/// <summary>
///   Check if the value pass is a valid date
///   Note: Use checkDate as the caller function
/// </summary>
function isDate(day, month, year) {
    return !!(IsValidString(day, 'Numeric') && IsValidString(month, 'Numeric') && IsValidString(year, 'Numeric'));
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Goes through the inputString and replaces every occurrence 
///   of fromString with toString
/// </summary>
function replaceSubstring(inputString, fromString, toString) {
    var temp = inputString;
    if (fromString == "") {
        return inputString;
    }
    if (toString.indexOf(fromString) == -1) { // If the string being replaced is not a part of the replacement string (normal situation)
        while (temp.indexOf(fromString) != -1) {
            var toTheLeft = temp.substring(0, temp.indexOf(fromString));
            var toTheRight = temp.substring(temp.indexOf(fromString) + fromString.length, temp.length);
            temp = toTheLeft + toString + toTheRight;
        }
    } else { // String being replaced is part of replacement string (like "+" being replaced with "++") - prevent an infinite loop
        var midStrings = ["~", "`", "_", "^", "#"];
        var midStringLen = 1;
        var midString = "";
        // Find a string that doesn't exist in the inputString to be used
        // as an "inbetween" string
        while (midString == "") {
            for (var i = 0; i < midStrings.length; i++) {
                var tempMidString = "";
                for (var j = 0; j < midStringLen; j++) {
                    tempMidString += midStrings[i];
                }
                if (fromString.indexOf(tempMidString) == -1) {
                    midString = tempMidString;
                    i = midStrings.length + 1;
                }
            }
        } // Keep on going until we build an "inbetween" string that doesn't exist
        // Now go through and do two replaces - first, replace the "fromString" with the "inbetween" string
        while (temp.indexOf(fromString) != -1) {
            var toTheLeft = temp.substring(0, temp.indexOf(fromString));
            var toTheRight = temp.substring(temp.indexOf(fromString) + fromString.length, temp.length);
            temp = toTheLeft + midString + toTheRight;
        }
        // Next, replace the "inbetween" string with the "toString"
        while (temp.indexOf(midString) != -1) {
            var toTheLeft = temp.substring(0, temp.indexOf(midString));
            var toTheRight = temp.substring(temp.indexOf(midString) + midString.length, temp.length);
            temp = toTheLeft + toString + toTheRight;
        }
    } // Ends the check to see if the string being replaced is part of the replacement string or not
    return temp; // Send the updated string back to the user
} // Ends the "replaceSubstring" function


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
///   Goes through the inputString and replaces every occurrence 
///   of fromString with toString
/// </summary>
function IsFieldEmpty(fieldname) {
    var fieldvalue;

    fieldvalue = trim(eval("document.myForm.elements['" + fieldname + "'].value"));

    return fieldvalue == "";

}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

/// <summary>
/// Checks if time is in HH:MM:SS AM/PM format.
/// The seconds and AM/PM are optional.
/// </summary>
function IsValidTime(timeStr) {

    var timePat = /^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/;

    var matchArray = timeStr.match(timePat);
    if (matchArray == null) {
        alert(translateFromKey('TIME_IS_NOT_IN_A_VALID_FORMAT_', 'Time is not in a valid format.'));
        return false;
    }
    else {
        return true;
    }

    hour = matchArray[1];
    minute = matchArray[2];
    second = matchArray[4];
    ampm = matchArray[6];

    if (second == "") {
        second = null;
    }
    if (ampm == "") {
        ampm = null;
    }

    if (hour < 0 || hour > 23) {
        alert(translateFromKey('HOUR_MUST_BE_BETWEEN_1_AND_12__OR_0_AND_23_FOR_MILITARY_TIME_', 'Hour must be between 1 and 12. (or 0 and 23 for military time)'));
        return false;
    }
    else {
        return true;
    }

    if (hour <= 12 && ampm == null) {
        if (confirm(translateFromKey('PLEASE_INDICATE_WHICH_TIME_FORMAT_YOU_ARE_USING__OK__STANDARD_TIME_CANCEL__MILITARY_TIME', 'Please indicate which time format you are using.  OK = Standard Time, CANCEL = Military Time'))) {
            alert(translateFromKey('YOU_MUST_SPECIFY_AM_OR_PM_', 'You must specify AM or PM.'));
            return false;
        }
    }
    else {
        return true;
    }

    if (hour > 12 && ampm != null) {
        alert(translateFromKey('YOU_CAN_NOT_SPECIFY_AM_OR_PM_FOR_MILITARY_TIME_', 'You can not specify AM or PM for military time.'));
        return false;
    }
    else {
        return true;
    }

    if (minute < 0 || minute > 59) {
        alert(translateFromKey('MINUTE_MUST_BE_BETWEEN_0_AND_59_', 'Minute must be between 0 and 59.'));
        return false;
    }
    else {
        return true;
    }

    if (second != null && (second < 0 || second > 59)) {
        alert(translateFromKey('SECOND_MUST_BE_BETWEEN_0_AND_59_', 'Second must be between 0 and 59.'));
        return false;
    }
    else {
        return true;
    }

}

/// <summary>
/// Confirm delete process message
/// </summary>
function confirmDelete() {
    if (deletevalidation()) {
        return !!confirm(translateFromKey('ARE_YOU_SURE_YOU_WANT_TO_PROCEED_', 'Are you sure you want to proceed?'));
    } else {
        return false;
    }
}

/// <summary>
/// Get time in HH:MM:SS format.
/// </summary>
function getTimeNow() {
    nw = new Date(); //Now !		
    hr = nw.getHours();
    hr = (hr < 10) ? "0" + hr : hr;
    mn = nw.getMinutes();
    mn = (mn < 10) ? "0" + mn : mn;
    sc = nw.getSeconds();
    sc = (sc < 10) ? "0" + sc : sc;

    ret = hr + ":" + mn + ":" + sc;

    return ret;
}

/// <summary>
/// Get date in dd/MM/yyyy format.
/// </summar>
function getDateNow() {
    nw = new Date(); //Now !
    mt = nw.getMonth() + 1; //getMonth() is zero based !
    mt = (mt < 10) ? "0" + mt : mt;
    dy = nw.getDate();
    dy = (dy < 10) ? "0" + dy : dy;
    yr = nw.getFullYear();

    ret = dy + "/" + mt;
    ret += "/" + yr;

    return ret;
}

/// <summary>
/// Get datetime in dd/MM/yyyy HH:MM:SS format.
/// </summar>
function getDateTimeNow() {
    nw = new Date(); //Now !
    mt = nw.getMonth() + 1; //getMonth() is zero based !
    mt = (mt < 10) ? "0" + mt : mt;
    dy = nw.getDate();
    dy = (dy < 10) ? "0" + dy : dy;
    yr = nw.getFullYear();
    hr = nw.getHours();
    hr = (hr < 10) ? "0" + hr : hr;
    mn = nw.getMinutes();
    mn = (mn < 10) ? "0" + mn : mn;
    sc = nw.getSeconds();
    sc = (sc < 10) ? "0" + sc : sc;

    ret = dy + "/" + mt;
    ret += "/" + yr + " " + hr + ":" + mn + ":" + sc;

    return ret;
}

/// <summary>
/// Compare if is a valid date range.
/// </summar>
function CompareFromDateAgainstToDate(FromDateValue, ToDateValue) {
    return true;

    var FromDate = new Date();
    var ToDate = new Date();

    //--------------------------------
    //SELECTED DATE AND CURRENT TIME
    //--------------------------------
    var FromDatetemp = new Date('01/01/1900 00:00:00');
    var dPart1 = FromDateValue.split('/');
    FromDatetemp.setDate(dPart1[0]);
    FromDatetemp.setMonth(dPart1[1] - 1);
    FromDatetemp.setYear(dPart1[2]);
    FromDatetemp.setHours(FromDatetemp.getHours());
    FromDatetemp.setMinutes(FromDatetemp.getMinutes());
    FromDatetemp.setSeconds(FromDatetemp.getSeconds());
    FromDate.setTime(FromDatetemp.getTime());

    //--------------------------------
    //SELECTED DATE AND CURRENT TIME
    //--------------------------------
    var ToDatetemp = new Date('01/01/1900 00:00:00');
    var dPart2 = ToDateValue.split('/');
    //alert(dPart2);
    //alert(dPart2[0]);
    //alert(dPart2[1]);
    //alert(dPart2[2]);
    ToDatetemp.setDate(dPart2[0]);
    ToDatetemp.setMonth(dPart2[1] - 1);
    ToDatetemp.setYear(dPart2[2]);
    ToDatetemp.setHours(FromDatetemp.getHours());
    ToDatetemp.setMinutes(FromDatetemp.getMinutes());
    ToDatetemp.setSeconds(FromDatetemp.getSeconds());
    ToDate.setTime(ToDatetemp.getTime());


    // From Date cannot be larger than To Date
    return FromDate.getTime() <= ToDate.getTime();
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
/// Set the element to be visible.
/// </summar>
function show(arg) {
    var divElem = document.getElementById(arg);

    //divElem.style.display = (divElem.style.display == "block") ? "none" : "block";
    divElem.style.visibility = "visible";

    return false;

}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
/// Set the element to be hidden.
/// </summar>
function hide(arg) {
    var divElem = document.getElementById(arg);

    //divElem.style.display = "none";
    divElem.style.visibility = "hidden";

    return false;

}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
/// Set the element to be disabled.
/// </summar>
function disable(arg) {
    var divElem = document.getElementById(arg);
    divElem.disabled = true;
    return false;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
/// Set the element to be enabled.
/// </summar>
function enable(arg) {
    var divElem = document.getElementById(arg);
    divElem.disabled = false;
    return false;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

//======================================
//	Listbox Sort Functions	
//======================================
/// <summary>
/// Listbox sort function
/// </summar>
function sortSelect(select, compareFunction) {
    if (!compareFunction)
        compareFunction = compareText;
    var options = new Array(select.options.length);
    for (var i = 0; i < options.length; i++)
        options[i] =
            new Option(
                select.options[i].text,
                select.options[i].value,
                select.options[i].defaultSelected,
                select.options[i].selected
            );
    options.sort(compareFunction);
    select.options = [];
    for (var i = 0; i < options.length; i++)
        select.options[i] = options[i];
}

/// <summary>
/// Listbox text sort function
/// Note: Use sortSelect method and set compareFunction to "compareText"
/// </summar>
function compareText(option1, option2) {
    return option1.text < option2.text ? -1 :
        option1.text > option2.text ? 1 : 0;
}
/// <summary>
/// Listbox value sort function
/// Note: Use sortSelect method and set compareFunction to "compareValue"
/// </summar>
function compareValue(option1, option2) {
    return option1.value < option2.value ? -1 :
        option1.value > option2.value ? 1 : 0;
}
/// <summary>
/// Listbox float sort function
/// Note: Use sortSelect method and set compareFunction to "compareFloat"
/// </summar>
function compareTextAsFloat(option1, option2) {
    var value1 = parseFloat(option1.text);
    var value2 = parseFloat(option2.text);
    return value1 < value2 ? -1 :
        value1 > value2 ? 1 : 0;
}
/// <summary>
/// Listbox value as Float sort function
/// Note: Use sortSelect method and set compareFunction to "compareValueAsFloat"
/// </summar>
function compareValueAsFloat(option1, option2) {
    var value1 = parseFloat(option1.value);
    var value2 = parseFloat(option2.value);
    return value1 < value2 ? -1 :
        value1 > value2 ? 1 : 0;
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/// <summary>
/// Check if current window is a pop up modal window
/// </summar>
function IsCurrentWindowDialog() {
    return window.dialogArguments != null;
}

/// <summary>
/// Check value validity depending on the data type
/// </summar>
function IsValidString(DataString, DataType) {

    var RegExpression;

    if (DataString == '') {

        return true;

    }

    switch (DataType) {

        case 'Numeric': // This will allow only digits from 0-9

            RegExpression = /[a-zA-Z:_\\\/"|<>{';.+)(&%^$#@!~`,*?}]/;

            break;

        case 'Decimal': // This will allow only digits from 0-9 with Decimal Point(.)

            RegExpression = /[a-zA-Z:_\\\/"|<>{';+)(&%^$#@!~`,*?}]/;

            break;

        case 'Alphabatic': // This will allow only Alphabatic characters from a-z and A-Z

            RegExpression = /[0-9:_\\\/"|<>{';.+)(&%^$#@!~`,*?}]/;


            break;

        case 'AlphaNumeric': // This will allow only digits from 0-9 , Alphabatic characters from a-z and A-Z

            RegExpression = /[:_\\\/"|<>{';.+)(&%^$#@!~`,*?}]/;


            break;

        case 'AlphaDecimal': // This will allow only digits from 0-9 , Alphabatic characters from a-z,A-Z with Decimal Point(.)

            //Example : for "Version" informations

            RegExpression = /[:_\\\/"|<>{';+)(&%^$#@!~`,*?}]/;


            break;

        case 'AlphaDecimalSlash': // This will allow only digits from 0-9 , Alphabatic characters from a-z,A-Z , Decimal Point(.) with Slash

            //Example : for "Address" fields

            RegExpression = /[:_"|<>{';+)(&%^$#@!~`,*?}]/;


            break;

        case 'InvalidCharacers': // This will not allow to enter ~,!,@,#,$,^,&,*,(,),+,|,},{,",:,?,>,<,,,.,/,;,',\,` characters

            RegExpression = /[\\\/\:\{';.+)(&%^$#@!~`,*?}\"\<\>|]/;

            break;
        case 'Custom': // Still not implemented

            //RegExpression = eval('/[' + CustomList + ']/')

            break;

        case 'Email': //This will only check some type of Email address formats 

            //Example : 123_abc_ABC@abc123ABC.aB.Ab

            return IsEmail(DataString);

            break;

        case 'URL': //This will only check whether the URL is in correct http://www.ABC.ccc or www.ABC.ccc format.

            RegExpression = /^http:{1}[\/]{2}[a-zA-Z]{3}[.]{1}[a-zA-Z0-9_]{1,}[.]{1}[a-zA-Z]{1,}[a-zA-Z.]*[a-zA-Z]$/;


            if (RegExpression.test(DataString)) {

                return true;

            }

            else {

                RegExpression = /^[a-zA-Z]{3}[.]{1}[a-zA-Z0-9_]{1,}[.]{1}[a-zA-Z]{1,}[a-zA-Z.]*[a-zA-Z]$/;

                if (RegExpression.test(DataString)) {

                    return true;

                }

            }

            return false;

            break;

        case 'Scripts': // This will not allow to enter Script Tags like "<aaaa> , <aaaa/>, </aaaaa>


            return !(/<\S[^>]*>/.test(DataString) || /<\S[^>]*\/>/.test(DataString));

            break;

        default:

            return false;

            break;

    }

    return DataString.search(RegExpression) == -1;


}
/// <summary>
/// Fix admin screen breadcrumb link
/// </summar>
function fixNavigation(sCurrentScreenTitle, sPrevScreenTitle, sPrevScreenURL, sFrameToRefresh, Breadcrumb) {

    try {
        if (Breadcrumb) {
            if (Breadcrumb != '') {
                var sPlaceHolderTitleBreadcrumb_ContentMap1 = "ctl00_PlaceHolderTitleBreadcrumb_ContentMap";
                var oTitleBarBreadCrumb1 = window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap1);
                var sMSOWebPart_Header1 = "MSOWebPart_Header";
                var FinalBreadcrumb = '';
                var TITLE = '';
                var URL = '';
                var prevTitle = '';
                //Seperate (Title URL) Pairs by '#' and then seperate the (Title) and (URL) by a '|'
                //                   "[Title          ]|[URL                                                     ]#[Title             ]|[URL                                                               ]#[Current pages title  ]|[Empty URL for current page so that its not a link]
                //example BreadCrumb="System Management|/Admin/WebPages/SystemManagement/MenuSystemManagement.aspx#System Configuration|/Admin/WebPages/SystemManagement/SystemParameterMaintenanceList.aspx#Other System Parameters|"


                //=================================================================
                var spUrlTitles = Breadcrumb.split("#");
                if (spUrlTitles.length > 0) {
                    //--------------------------------------------------
                    for (var i = 0; i < spUrlTitles.length; i++) {
                        //===========================================
                        try {
                            var spUrlTitlesSplit = spUrlTitles[i].split('|');
                            if (spUrlTitlesSplit.length == 2) {
                                //-----------------------------------------------
                                TITLE = spUrlTitlesSplit[0];
                                URL = spUrlTitlesSplit[1];
                                if (i != spUrlTitles.length - 1) {
                                    FinalBreadcrumb = FinalBreadcrumb + "<span><a href=\"javascript:var nav = document.getElementById('" + sFrameToRefresh + "').src=\'" + URL + "\';\">" + TITLE + "</a></span><span>&nbsp;&gt;&nbsp;</span>";
                                    prevTitle = TITLE;
                                }
                                else {
                                    FinalBreadcrumb = FinalBreadcrumb + "<span>" + TITLE + "</span>";
                                }

                                //-----------------------------------------------
                            }
                        } catch (e) {
                        }
                        //============================================
                    }
                    while (window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap1).childNodes.length > 4) {
                        oTitleBarBreadCrumb1.removeChild(oTitleBarBreadCrumb1.lastChild);
                    }
                    oTitleBarBreadCrumb1.innerHTML += FinalBreadcrumb;

                    try {
                        var oTitle1 = window.parent.document.getElementById(sMSOWebPart_Header1).getElementsByTagName('SPAN')[0];
                        if (prevTitle != TITLE) {
                            if (prevTitle != '') {
                                oTitle1.innerHTML = prevTitle + " : " + TITLE;
                            }
                            else {
                                oTitle1.innerHTML = TITLE;
                            }
                        }
                        else {
                            oTitle1.innerHTML = TITLE;
                        }
                    } catch (e) {
                    }
                    //--------------------------------------------------
                }
                return;
                //================================================================= 
            }
        }
    } catch (e) {
    }
    //If breadcrumb property is empty do the following
    try {
        var sPlaceHolderTitleBreadcrumb_ContentMap = "ctl00_PlaceHolderTitleBreadcrumb_ContentMap";
        var sMSOWebPart_Header = "MSOWebPart_Header";

        if (sPrevScreenTitle != '') {
            //BREAD CRUMB FOR ADMIN PAGES
            try {
                var oTitleBarBreadCrumb = window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap);
                if (window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap).childNodes.length == 5) {
                    oTitleBarBreadCrumb.removeChild(oTitleBarBreadCrumb.lastChild);
                    oTitleBarBreadCrumb.innerHTML = oTitleBarBreadCrumb.innerHTML + "<span><a href=\"javascript:var nav = document.getElementById('" + sFrameToRefresh + "').src=\'" + sPrevScreenURL + "\';\">" + sPrevScreenTitle + "</a></span><span>&nbsp;&gt;&nbsp;</span><span>" + sCurrentScreenTitle + "</span>";
                }
                else if (window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap).childNodes.length == 7) {
                    oTitleBarBreadCrumb.removeChild(oTitleBarBreadCrumb.lastChild);
                    oTitleBarBreadCrumb.innerHTML = oTitleBarBreadCrumb.innerHTML + "<span>" + sCurrentScreenTitle + "</span>";
                }
            } catch (e) {
            }

            //PAGE TITLE FOR ADMIN PAGES
            try {
                var oTitle = window.parent.document.getElementById(sMSOWebPart_Header).getElementsByTagName('SPAN')[0];
                oTitle.innerHTML = sPrevScreenTitle + " : " + sCurrentScreenTitle;
            } catch (e) {
            }
        }
        else {
            //BREAD CRUMB FOR MENU PAGES
            try {
                var oTitleBarBreadCrumb = window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap);
                if (window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap).childNodes.length == 7) {
                    for (var i = 0; i <= 2; i++) {
                        oTitleBarBreadCrumb.removeChild(oTitleBarBreadCrumb.lastChild);
                    }
                    oTitleBarBreadCrumb.innerHTML = oTitleBarBreadCrumb.innerHTML + "<span>" + sCurrentScreenTitle + "</span>";
                }
            } catch (e) {
            }

            //PAGE TITLE FOR MENU PAGES
            try {
                var oTitle = window.parent.document.getElementById(sMSOWebPart_Header).getElementsByTagName('SPAN')[0];
                oTitle.innerHTML = sCurrentScreenTitle;
            } catch (e) {
            }
        }
    } catch (e) {
    }
}

/// <summary>
/// Clear Breadcrumb
/// </summar>
function clearNavigation() {
    var sPlaceHolderTitleBreadcrumb_ContentMap = "ctl00_PlaceHolderTitleBreadcrumb_ContentMap";

    //Clear BREAD CRUMB
    try {
        var oTitleBarBreadCrumb = window.parent.document.getElementById(sPlaceHolderTitleBreadcrumb_ContentMap);
        oTitleBarBreadCrumb.innerHTML = '';
    } catch (e) {
    }
}


///------------------------------------------------------------------------------------------------------------------------------------
/// <summary>
//  20081009 mkwan - construct correct URL for localhost and production servers      
//  20091031 mkwan - add loading URL     
/// </summary>
function slgWebserverURL(value, disable_loading_page) {
    var isLocalHost = false;

    if (SLGwebserverURL.indexOf('localhost') > -1) {
        isLocalHost = true;
    }

    var project = '';

    if (value.indexOf('/') > -1) {
        var arr = value.split("/");
        project = arr[0];
    }

    if ((project.toLowerCase() == 'admin') && (isLocalHost == true)) {
        value = value.toLowerCase().replace('admin', 'administration');
        project = 'administration';
    }

    var URL = '';

    if (URL.toLowerCase().indexOf('http') == -1) {
        if (isLocalHost) {
            URL = SLGwebserverURL + project + '/' + value;
        }
        else {
            URL = SLGwebserverURL + value;
        }
    }
    else {
        URL = value;
    }

    if (!disable_loading_page) {
        URL = addLoadingURL(URL);
    }
    return URL;
}

//=====================================================================

//=====================================================================
//      Close current window
//=====================================================================
/// <summary>
/// Close current window
/// </summar>
function CloseWindow() {
    window.close();
}
//=====================================================================

//=====================================================================
//      Close current window and reload parent window
//=====================================================================
/// <summary>
/// Reload parent window and close current window
/// </summar>
function CloseWindowReloadParent(page, qs) {
    var windialog = window.dialogArguments;

    if (windialog) {
        windialog.Container.location.href = page + '?' + qs;
        self.close();
    }
    else {
        opener.location.href = page + '?' + qs;
        self.close();
    }
}


//=====================================================================
//      Close current window and reload parent window
//=====================================================================
/// <summary>
/// Reload parent window and close current window
/// </summary>
function CloseWindowReloadParent() {
    opener.location.href = opener.location.href;
    self.close();
}

//=====================================================================
//      Close current window and sub parent window
//=====================================================================
/// <summary>
/// Close current window and sub parent window
/// </summary>
function CloseWindowReloadParent() {
    opener.document.forms[0].submit();
    self.close();
}


//=====================================================================
/// <summary>
/// Reload parent tab
/// </summar>
function RefreshParentTabs() {
    parent.RefreshParentTabs();
}

//=======================================================================
//  *** Report Common JS File Functions
//=======================================================================

// ***************************************************************
// Report data type control render script
// used by Common component to validate the report data type 
// Common Javascript 
// Anuj Ivor McFarland  / SolutionsIT Pty Ltd.
// ***************************************************************

//**************************************************************
// Function: ValidateFields(ReportDataTypeParamGridName,GridTotalRows,InTab,TabPrefix)
// Purpose: common call to validate rendered controls on screen
// Notes    : ReportDataTypeParamGridName -> Control Name used.
//                GridTotalRows -> hidden field containing the Total No. of rows in the Grid
//                InTab -> If the Grid was placed in a tab (true/false)
//                TabPrefix -> the Tab Prefix (TabSubmitReport_ctl01_ctl) -00,01 Add at runtime
//                returns false if validation fails
//                returns true if validation fails
//                IMP: in case of controls rendered in tabs, provide complete 
//                client side ID
//**************************************************************
/// <summary>
/// Report data type control render script
/// </summar>
function ValidateFields(ReportDataTypeParamGridName, GridTotalRows, InTab, TabPrefix) {
    var TotalRowsInGrid;
    var Counter;
    var RowType;
    var ControlName;

    TotalRowsInGrid = 0;
    TotalRowsInGrid = document.getElementById(GridTotalRows).value;


    if (TotalRowsInGrid > 0) {
        for (Counter = 0; Counter < TotalRowsInGrid; Counter++) {
            if (!InTab)
                ControlName = "cntl_" + ReportDataTypeParamGridName + "_" + Counter;
            else
                ControlName = CreateControlNameWithTab(TabPrefix, Counter, ReportDataTypeParamGridName);

            RowType = "";
            RowType = document.getElementById(ControlName + "_data").value;

            if (RowType == "STRING")
                if (!ValidateStrings(ControlName))
                    return false;
            if (RowType == "BOOLEAN")
                if (!ValidateBoolean(ControlName))
                    return false;
            if (RowType == "INTEGER")
                if (!ValidateInteger(ControlName))
                    return false;

            if (RowType == "DATE")
                if (!ValidateDate(ControlName))
                    return false;

        }
    }

    return true;
}
/// <summary>
/// Replace passing value with the char "_" to "x"
/// </summar>
function CustomReplace(str) {
    var strold;
    var newstr;
    var strchar;
    var counter;
    strold = str;
    newstr = "";
    for (counter = 0; counter < strold.length; counter++) {
        strchar = strold.substr(counter, 1);
        if (strchar == "_")
            strchar = "x";

        newstr += strchar;
    }
    return newstr;
}
//**************************************************************
// Function: CreateControlNameWithTab(TabPrefix,Counter,ReportDataGridName)
// Purpose: Called By ValidateFields to create the controls name 
// Notes    :TabPrefix -> the Tab Prefix (TabSubmitReport_ctl01_ctl) -00,01 Add at runtime  
//                Counter 
//                ReportDataGridName -> Name of Grid
//**************************************************************
/// <summary>
/// Called By ValidateFields to create the controls name 
/// </summar>
function CreateControlNameWithTab(TabPrefix, Counter, ReportDataGridName) {
    var ControlName;
    ControlName = TabPrefix;

    if (Counter <= 9)
        ControlName = ControlName + "0" + Counter;
    else
        ControlName += Counter;

    ControlName = ControlName + "_cntl_" + ReportDataGridName + "_" + Counter;

    return ControlName;
}

//**************************************************************
// Function: ValidateDate(RowDataParamName)
// Purpose: Validates a Date Value
// Notes    :RowDataParamName - Name of controller to validate of type Date
//**************************************************************
/// <summary>
/// Validates a Date Value
/// </summar>
function ValidateDate(RowDataParamName) {
    var DateControllerName;
    var EnteredValue;
    var LabelName;
    var MaxValue;
    var MinValue;
    DateControllerName = RowDataParamName;
    DateControllerName = CustomReplace(DateControllerName);
    DateControllerName += "_input";
    LabelName = document.getElementById(RowDataParamName + "_data").getAttribute("LabelName");
    EnteredValue = (document.getElementById(DateControllerName).value);
    MaxValue = (document.getElementById(RowDataParamName + "_data").getAttribute("MaxValue"));
    MinValue = (document.getElementById(RowDataParamName + "_data").getAttribute("MinValue"));

    return true;

}


//**************************************************************
// Function: ValidateInteger(RowDataParamName)
// Purpose: Validates a Boolean Value
// Notes    :RowDataParamName - Name of controller to validate of type Boolean
//**************************************************************
/// <summary>
/// Validates a Integer Value
/// </summar>
function ValidateInteger(RowDataParamName) {
    var EnteredValue;
    var LabelName;
    var MaxValue;
    var MinValue;

    MaxValue = 0;
    MinValue = 0;
    LabelName = document.getElementById(RowDataParamName + "_data").getAttribute("LabelName");
    MaxValue = parseInt(document.getElementById(RowDataParamName + "_data").getAttribute("MaxValue"));
    MinValue = parseInt(document.getElementById(RowDataParamName + "_data").getAttribute("MinValue"));
    //EnteredValue  = parseInt(document.getElementById(RowDataParamName).value);
    if (document.getElementById(RowDataParamName).value != "") {
        if (!isNaN(document.getElementById(RowDataParamName).value)) {
            EnteredValue = parseInt(document.getElementById(RowDataParamName).value);
        }
        else {
            alert(translateFromKey('PLEASE_ENTER_A_NUMBER_FOR', 'Please enter a number for') + " " + LabelName);
            return false;
        }
    }
    else {
        EnteredValue = 0;
    }

    if ((EnteredValue > MaxValue) || (EnteredValue < MinValue)) {
        alert(LabelName + " " + translateFromKey('REQUIRES_NUMBERS_TO_BE_BETWEEN_THE_RANGE_OF', 'requires numbers to be between the range of') + " " + MaxValue + " " + translateFromKey('_TO', 'to') + " " + MinValue);
        return false;
    }

    return true;
}


//**************************************************************
// Function: ValidateBoolean(RowDataParamName)
// Purpose: Validates a Boolean Value
// Notes    :RowDataParamName - Name of controller to validate of type Boolean
//**************************************************************

function ValidateBoolean(RowDataParamName) {
    var SelectedTrue;
    var SelectedFalse;
    var LabelName;
    var ListTrue;
    var ListFalse;


    SelectedTrue = false;
    SelectedFalse = false;

    LabelName = document.getElementById(RowDataParamName + "_data").getAttribute("LabelName");
    ListTrue = document.getElementById(RowDataParamName + "_data").getAttribute("ListTrue");
    ListFalse = document.getElementById(RowDataParamName + "_data").getAttribute("ListFalse");

    if (document.getElementById(RowDataParamName + "_0").checked)
        SelectedTrue = true;

    if (document.getElementById(RowDataParamName + "_1").checked)
        SelectedFalse = true;

    if ((!SelectedFalse) && (!SelectedTrue)) {
        alert(translateFromKey('PLEASE_SELECT_EITHER', 'Please select either') + " " + ListTrue + " " + translateFromKey('OR', 'or') + " " + ListFalse + " " + translateFromKey('FOR', 'for') + " " + LabelName);
        return false;
    }

    return true;
}

//**************************************************************
// Function: ValidateStrings(RowDataParamName)
// Purpose: Validates a String control
// Notes    :RowDataParamName - Name of controller to validate of type string
//**************************************************************
/// <summary>
/// Validates a boolean Value
/// </summa
function ValidateStrings(RowDataParamName) {
    var MaxLength;
    var MinLength;
    var EnteredValue;
    var EnteredValueLen;
    var LabelName;

    MaxLength = 0;
    MinLength = 0;

    MaxLength = parseInt(document.getElementById(RowDataParamName + "_data").getAttribute("MaxLength"));
    MinLength = parseInt(document.getElementById(RowDataParamName + "_data").getAttribute("MinLength"));
    EnteredValue = document.getElementById(RowDataParamName).value;
    LabelName = document.getElementById(RowDataParamName + "_data").getAttribute("LabelName");
    EnteredValueLen = EnteredValue.length;

    if (EnteredValueLen < MinLength) {
        alert(translateFromKey('THE_VALUE_ENTERED_FOR', 'The value entered for') + " " + LabelName + " " + translateFromKey('SHOULD_HAVE_A_MINIMUM_LENGTH_OF', 'should have a minimum length of') + " " + MinLength + " " + translateFromKey('CHARACTERS', 'characters'));
        return false;
    }

    if (EnteredValueLen > MaxLength) {
        alert(translateFromKey('THE_VALUE_ENTERED_FOR', 'The value entered for') + " " + LabelName + " " + translateFromKey('SHOULD_HAVE_A_MAXIMUM_LENGTH_OF', 'should have a maximum length of') + " " + MaxLength + " " + translateFromKey('CHARACTERS', 'characters'));
        return false;
    }
    return true;
}

/// <summary>
/// Validates a date Value
/// <summary>
function isValidDate(dateStr) {
    // Date validation function courtesty of 
    // Sandeep V. Tamhankar (stamhankar@hotmail.com) -->

    // Checks for the following valid date formats:
    // MM/DD/YY   MM/DD/YYYY   MM-DD-YY   MM-DD-YYYY

    var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/; // requires 4 digit year

    var matchArray = dateStr.match(datePat); // is the format ok?
    if (matchArray == null) {
        alert(dateStr + " " + translateFromKey('DATE_IS_NOT_IN_A_VALID_FORMAT_', 'Date is not in a valid format.'));
        return false;
    }
    month = matchArray[1]; // parse date into variables
    day = matchArray[3];
    year = matchArray[4];
    if (month < 1 || month > 12) { // check month range
        alert(translateFromKey('MONTH_MUST_BE_BETWEEN_1_AND_12_', 'Month must be between 1 and 12.'));
        return false;
    }
    if (day < 1 || day > 31) {
        alert(translateFromKey('DAY_MUST_BE_BETWEEN_1_AND_31_', 'Day must be between 1 and 31.'));
        return false;
    }
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        alert(translateFromKey('MONTH', 'Month') + " " + month + " " + translateFromKey('DOES_NOT_HAVE_31_DAYS_', 'does not have 31 days!'));
        return false;
    }
    if (month == 2) { // check for february 29th
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            alert(translateFromKey('FEBRUARY', 'February') + " " + year + " " + translateFromKey('DOES_NOT_HAVE', 'does not have') + " " + day + " " + translateFromKey('DAYS_', 'days!'));
            return false;
        }
    }
    return true;
}

//=======================================================================

//=======================================================================
//  *** ClassManager Common JS File Functions
//=======================================================================

// ====================================================================
//        Max length property of Textbox is not working when      
//        TexMode=Multiline. So Use following functions to validate Max 
//        Lenght.
//        
//        To use this functions 'Max Length' Property should be manually
//        added client side
// =====================================================================

/// <summary>
/// Stop user from entering more than maxLength characters
/// <summary>
function doKeypress(control) {

    value = control.value;
    if (value.length > control.maxLength - 1) {
        event.returnValue = false;
    }
}
/// <summary>
/// Cancel default behavior
/// <summary>
function doBeforePaste(control) {
    if (control.maxLength) {
        event.returnValue = false;
    }
}
/// <summary>
/// Cancel default behavior and create a new paste routine
/// <summary>
function doPaste(control) {
    var maxLength = control.maxLength;
    value = control.value;
    if (maxLength) {
        event.returnValue = false;
        maxLength = parseInt(maxLength);
        var oTR = control.document.selection.createRange();
        var iInsertLength = maxLength - value.length + oTR.text.length;
        oTR.text = window.clipboardData.getData("Text").substr(0, iInsertLength);
    }
}
//=======================================================================

//------------------------------------------------------
//  Closing Window
//------------------------------------------------------
try {
    //------------------------------------------------------
    //	DISPLAY ALERT MESSAGE
    //------------------------------------------------------
    if (sAlertMessage != '') {
        alert(sAlertMessage);
        sAlertMessage = '';
    }
}
catch (e) {
}

/// <summary>
/// Cross-browser implementation of addEventListener
/// </summary>
function addListener(element, type, expression, bubbling) {
    //expression = function name
    bubbling = bubbling || false;
    if (window.addEventListener) { // Standard
        element.addEventListener(type, expression, bubbling);
        return true;
    }
    else if (window.attachEvent) { // IE
        element.attachEvent('on' + type, expression);
        return true;
    }
    else return false;
}

/// <summary>
/// Custom Modal Dialog
/// </summary>
var messageObj = null;
function displayCustomModalDialog(message, YesButtonOnclickFunction, NoButtonOnclickFunction, width, height) {
    messageObj = new DHTML_modalMessage();
    if (messageObj) {
        var messageContent = '<div id="tt">' +
            '<div class="topDiv">' +
            '<div class="topLabel">' +
            translateFromKey('WINDOWS_INTERNET_EXPLORER', 'Windows Internet Explorer') +
            '</div>' +
            '<img src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\' class="closeButtonImage" ' +
            'onmouseover="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_hover.gif\'" ' +
            'onmouseout="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\'" ' +
            'onmouseup="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\'" ' +
            'onmousedown="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_selected.gif\'" ' +
            'onclick="displayCustomModalDialogCloseWindow();" />' +
            '</div>' +
            '<div class="middleDiv">' +
            '<div class="contentDiv">' +
            '<span class="dialogBoxImage">' +
            '<img src=\'../../SharedResources/Controls/CustomModalDialog/images/ieconfirm.gif\' />' +
            '</span>' +
            '<span style="padding-right: 5px; height: 100%;" class="ms-input">' +
            message +
            '</span>' +
            '<br clear="both" />' +
            '<div class="dialogButton">' +
            '<input type="button" class="ms-input" id="btnCustomModalDialogYes" value="' + translateFromKey('YES', 'Yes') + '" style="width: 70px;" onclick="' + YesButtonOnclickFunction + '" />&nbsp;' +
            '<input type="button" class="ms-input" id="btnCustomModalDialogNo" value="' + translateFromKey('NO', 'No') + '" style="width: 70px;" onclick="' + NoButtonOnclickFunction + '" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        messageObj.setHtmlContent(messageContent);
        messageObj.setSize(width, height);
        messageObj.setCssClassMessageBox(false);
        messageObj.setSource(false); // no html source since we want to use a static message here.
        messageObj.setShadowDivVisible(false);
        // Disable shadow for these boxes	
        messageObj.display();

        //alert(document.getElementById("tt").parentNode.id);
        //alert(document.getElementById("tt").parentNode.className);
        //alert(document.getElementById("tt").parentNode.parentNode.parentNode.className);
    }
}

/// <summary>
/// Close Custom Modal Dialog
/// </summary>
function displayCustomModalDialogCloseWindow() {
    if (messageObj) {
        messageObj.close();
    }
}
//<Summary>
// To resize the frame according to system resolutions.
//</Summary>
function Resizelayout(id2, divhight1, divheight2) {


    if (screen.height > 800) {

        document.getElementById(id2).style.height = divhight1 + "px";

    }
    else {

        document.getElementById(id2).style.height = divheight2 + "px";

    }
}

/// <summary>
/// Custom Modal Dialog for Open/Check In Activity 
/// </summary>
var messageObj = null;
function displayCustomModalDialogForAB(message, YesButtonOnclickFunction, NoButtonOnclickFunction, width, height) {
    messageObj = new DHTML_modalMessage();
    if (messageObj) {
        var messageContent = '<div id="tt">' +
            '<div class="topDiv">' +
            '<div class="topLabel">' +
            translateFromKey('CONVERT_TO_ACTIVITY', 'Convert to Activity') +
            '</div>' +
            '<img src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\' class="closeButtonImage" ' +
            'onmouseover="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_hover.gif\'" ' +
            'onmouseout="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\'" ' +
            'onmouseup="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\'" ' +
            'onmousedown="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_selected.gif\'" ' +
            'onclick="displayCustomModalDialogCloseWindow();" />' +
            '</div>' +
            '<div class="middleDiv">' +
            '<div class="contentDiv">' +
            '<span class="dialogBoxImage">' +
            '<img src=\'../../SharedResources/Controls/CustomModalDialog/images/ieconfirm.gif\' />' +
            '</span>' +
            '<span style="padding-right: 5px; height: 100%;" class="ms-input">' +
            message +
            '</span>' +
            '<br  /><br clear="both" />' +
            '<div class="dialogButton">' +
            '<input type="button" class="ms-input" id="btnCustomModalDialogYes" value="' + translateFromKey('CHECK_IN', 'Check In') + '" style="width: 70px;" onclick="' + YesButtonOnclickFunction + '" />&nbsp;' +
            '<input type="button" class="ms-input" id="btnCustomModalDialogNo" value="' + translateFromKey('OPEN', 'Open') + '" style="width: 70px;" onclick="' + NoButtonOnclickFunction + '" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        messageObj.setHtmlContent(messageContent);


        messageObj.setSize(width, height);
        //messageObj.setCssClassMessageBox(false);
        messageObj.setSource(false); // no html source since we want to use a static message here.
        messageObj.setShadowDivVisible(false); // Disable shadow for these boxes	
        messageObj.display();
    }
}
/// <summary>
/// set grid div height for firfox in Pixel
/// <summary>

function gridHeight(divid, height1, height2) {

    if (navigator.userAgent.indexOf("Firefox") != -1) {

        if (screen.height > 800) {

            document.getElementById(divid).style.height = height1 + "px";
            alert(dgStudentList.DisplayLayout.FrameStyle.Height);
        }
        else {

            document.getElementById(divid).style.height = height2 + "px";


        }

    }
}

/// <summary>
/// Custom Modal Dialog for Open/Check In Activity 
/// </summary>
var messageObj = null;
function displayCustomModalDialogwithButtonTitle(message, YesButtonOnclickFunction, NoButtonOnclickFunction, width, height, YesButtonTitle, NoButtonTitle) {
    messageObj = new DHTML_modalMessage();
    if (messageObj) {
        var messageContent = '<div id="tt">' +
            '<div class="topDiv">' +
            '<div class="topLabel">' +
            translateFromKey('CONVERT_TO_ACTIVITY', 'Convert to Activity') +
            '</div>' +
            '<img src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\' class="closeButtonImage" ' +
            'onmouseover="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_hover.gif\'" ' +
            'onmouseout="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\'" ' +
            'onmouseup="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_default.gif\'" ' +
            'onmousedown="this.src=\'../../SharedResources/Controls/CustomModalDialog/images/cross_selected.gif\'" ' +
            'onclick="displayCustomModalDialogCloseWindow();" />' +
            '</div>' +
            '<div class="middleDiv">' +
            '<div class="contentDiv">' +
            '<span class="dialogBoxImage">' +
            '<img src=\'../../SharedResources/Controls/CustomModalDialog/images/ieconfirm.gif\' />' +
            '</span>' +
            '<span style="padding-right: 5px; height: 100%;" class="ms-input">' +
            message +
            '</span>' +
            '<br  /><br clear="both" />' +
            '<div class="dialogButton">' +
            '<input type="button" class="ms-input" id="btnCustomModalDialogYes" value="' + YesButtonTitle + '" style="width: 70px;" onclick="' + YesButtonOnclickFunction + ';" />&nbsp;' +
            '<input type="button" class="ms-input" id="btnCustomModalDialogNo" value="' + NoButtonTitle + '" style="width: 70px;" onclick="' + NoButtonOnclickFunction + ';" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        messageObj.setHtmlContent(messageContent);

        messageObj.setSize(width, height);
        messageObj.setSource(false); // no html source since we want to use a static message here.
        messageObj.setShadowDivVisible(false); // Disable shadow for these boxes	
        messageObj.display();
    }
}


//20080730 better querystring function by Matthew
function requestQueryString(ji) {
    try {
        hu = window.location.search.substring(1);
        gy = hu.split("&");
        for (i = 0; i < gy.length; i++) {
            ft = gy[i].split("=");
            if (ft[0].toLowerCase() == ji.toLowerCase()) {
                return ft[1];
            }
        }

        return '';
    }
    catch (e) {
        return '';
    }
}


// ==================================================================================================================
// ========================
// FIELD VALIDATION - START
// ========================
function isValidString(DataString, DataType) {
    var RegExpression;
    if (DataString == '') {
        return true;
    }
    switch (DataType) {
        case 'Numeric': // This will allow only digits from 0-9
            RegExpression = /[a-zA-Z:_\\\/"|<>{';.+)(&%^$#@!~`,*?}]/;
            break;
        case 'Decimal': // This will allow only digits from 0-9 with Decimal Point(.)
            RegExpression = /[a-zA-Z:_\\\/"|<>{';+)(&%^$#@!~`,*?}]/;
            break;
        case 'Alphabetic': // This will allow only Alphabatic characters from a-z and A-Z
            RegExpression = /[0-9:_\\\/"|<>{';.+)(&%^$#@!~`,*?}]/;
            break;
        case 'AlphaNumeric': // This will allow only digits from 0-9 , Alphabatic characters from a-z and A-Z
            RegExpression = /[:_\\\/"|<>{';.+)(&%^$#@!~`,*?}]/;
            break;
        case 'AlphaDecimal': // This will allow only digits from 0-9 , Alphabatic characters from a-z,A-Z with Decimal Point(.)
            //Example : for "Version" informations
            RegExpression = /[:_\\\/"|<>{';+)(&%^$#@!~`,*?}]/;
            break;
        case 'AlphaDecimalSlash': // This will allow only digits from 0-9 , Alphabatic characters from a-z,A-Z , Decimal Point(.) with Slash
            //Example : for "Address" fields
            RegExpression = /[:_"|<>{';+)(&%^$#@!~`,*?}]/;
            break;
        case 'InvalidCharacers': // This will not allow to enter ~,!,@,#,$,^,&,*,(,),+,|,},{,",:,?,>,<,,,.,/,;,',\,` characters
            RegExpression = /[\\\/\:\{';.+)(&%^$#@!~`,*?}\"\<\>|]/;
            break;
        case 'Email': //This will only check some type of Email address formats 
            //Example : 123_abc_ABC@abc123ABC.aB.Ab
            RegExpression = /^[a-zA-Z0-9_]{1,}[@]{1}[a-zA-Z0-9]{1,}[.]{1}[a-zA-Z]{1,}[a-zA-Z.]*[a-zA-Z]$/;
            return !!RegExpression.test(DataString);

            break;
        case 'URL': //This will only check whether the URL is in correct http://www.ABC.ccc or www.ABC.ccc format.
            RegExpression = /^http:{1}[\/]{2}[a-zA-Z]{3}[.]{1}[a-zA-Z0-9_]{1,}[.]{1}[a-zA-Z]{1,}[a-zA-Z.]*[a-zA-Z]$/;
            if (RegExpression.test(DataString)) {
                return true;
            }
            else {
                RegExpression = /^[a-zA-Z]{3}[.]{1}[a-zA-Z0-9_]{1,}[.]{1}[a-zA-Z]{1,}[a-zA-Z.]*[a-zA-Z]$/;
                if (RegExpression.test(DataString)) {
                    return true;
                }
            }
            return false;
            break;
        case 'Scripts': // This will not allow to enter Script Tags like "<aaaa> , <aaaa/>, </aaaaa>
            return !(/<\S[^>]*>/.test(DataString) || /<\S[^>]*\/>/.test(DataString));
            break;
        default:
            return false;
            break;
    }

    return DataString.search(RegExpression) == -1;

}

function FieldValidation() {
    this.eValidationType = {
        Empty: 0,
        Numeric: 1,
        Decimal: 2,
        Alphabetic: 3,
        AlphaNumeric: 4,
        AlphaDecimal: 5,
        AlphaDecimalSlash: 6,
        InvalidCharacers: 7,
        Email: 8,
        URL: 9,
        Scripts: 10
    };
    this.foundErrors = false;
    this.message = 'Please correct the following information and Save again';  //translateFromKey('FIELD_VALIDATIONS_','Field Validations:');
    this.fieldValid = function(elementID, errorMessage, validationType) {
        var elementValue = document.getElementById(elementID).value;
        return this.validate(elementValue, validationType, errorMessage);
    };
    this.valueValid = function(value, errorMessage, validationType) {
        return this.validate(value, validationType, errorMessage);
    };
    this.isValid = function() {
        if (this.foundErrors == true) {
            alert(this.message);
            this.reset();
            return false;
        }
        this.reset();
        return true;
    };
    this.reset = function() {
        this.foundErrors = false;
        this.message = 'Please correct the following information and Save again';  //translateFromKey('FIELD_VALIDATIONS_','Field Validations:');
    };
    this.appendError = function(errorMessage) {
        this.foundErrors = true;
        this.message = this.message + '\n   * ' + errorMessage;
        return false;
    };
    this.validate = function(elementValue, validationType, errorMessage) {
        var err = false;
        switch (validationType) {
            case this.eValidationType.Empty:
                if (trim(elementValue) == '')
                    err = true;
                break;
            case this.eValidationType.Numeric:
                err = !isValidString(elementValue, 'Numeric');
                break;
            case this.eValidationType.Decimal:
                err = !isValidString(elementValue, 'Decimal');
                break;
            case this.eValidationType.Alphabetic:
                err = !isValidString(elementValue, 'Alphabetic');
                break;
            case this.eValidationType.AlphaNumeric:
                err = !isValidString(elementValue, 'AlphaNumeric');
                break;
            case this.eValidationType.AlphaDecimal:
                err = !isValidString(elementValue, 'AlphaDecimal');
                break;
            case this.eValidationType.AlphaDecimalSlash:
                err = !isValidString(elementValue, 'AlphaDecimalSlash');
                break;
            case this.eValidationType.InvalidCharacers:
                err = !isValidString(elementValue, 'InvalidCharacers');
                break;
            case this.eValidationType.Email:
                err = !isValidString(elementValue, 'Email');
                break;
            case this.eValidationType.URL:
                err = !isValidString(elementValue, 'URL');
                break;
            case this.eValidationType.Scripts:
                err = !isValidString(elementValue, 'Scripts');
                break;
            default:
                err = false;
                break;
        }
        if (err == true) {
            this.foundErrors = true;
            this.message = this.message + '\n   * ' + errorMessage;
            return false;
        }
        return true;

    };

}
// ======================
// FIELD VALIDATION - END
// ======================

function getFieldValue(id, valueAttribute) {
    if (valueAttribute) {
        if (valueAttribute == '') {
            valueAttribute = 'value';
        }
    }
    else {
        valueAttribute = 'value';
    }
    if (document.getElementById(id)) {
        return eval('document.getElementById(\'' + id + '\').' + valueAttribute);
    }
    return '';
}

/// <summary>
/// Created By Sean Soh 5/Aug/2008
/// Used for CFToolDefault.aspx page 
/// get element position
/// </summary>
document.getElementPosition = function(obj) {
    var T = 0, L = 0;
    while (obj) {
        L += obj.offsetLeft;
        T += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return [L, T];
};

/// <summary>
/// Created By Sean Soh 5/Aug/2008
/// Used for CFToolDefault.aspx page 
/// get element available max height on the screen
/// </summary>
document.getElementAvailableMaxHeight = function(obj) {
    //get element position
    var position = document.getElementPosition(obj), result = 0;
    //Firefox height
    var screenHeight = window.innerHeight;
    //IE height
    if (document.body.clientHeight) {
        screenHeight = document.body.clientHeight;
    }
    if (screenHeight == undefined) {
        screenHeight = 0;
    }
    result = screenHeight - position[1];
    if (result < 0) {
        return 0;
    }
    return result;
};

/// <summary>
/// Created By Sean Soh 5/Aug/2008
/// Used for CFToolDefault.aspx page 
/// get element available max width on the screen
/// </summary>
document.getElementAvailableMaxWidth = function(obj) {
    //get element position
    var position = document.getElementPosition(obj);
    //Firefox height
    var screenWidth = window.innerWidth;
    //IE height
    if (document.body.clientWidth) {
        screenWidth = document.body.clientWidth;
    }
    return screenWidth - position[1];
};

/// <summary>
/// 20090108 ssoh - string is numeric
/// </summary>
function isNumeric(str, options) {
    var Options = {
        AllowEmptry: false,
        AllowNegative: true
    };

    $.extend(Options, options);


    //defalut is not allow emptry string

    if (str === "" && Options.AllowEmptry === true) return true;

    var ValidChars = "0123456789.";
    var IsNumber = true;
    var Char;
    for (i = 0; i < str.length && IsNumber == true; i++) {
        Char = str.charAt(i);
        if (Char == '-') {
            if (Options.AllowNegative === false) {
                IsNumber = false;
            }
            else if (i !== 0) {
                IsNumber = false;
            }
        }
        else if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber && (isNaN(parseFloat(str)) == false);
}

/// <summary>
/// 20090108 ssoh - only numeric can be entered
/// </summary>
function allowNumericInput(evt, allowDecimal) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //Check for decimal
    if (allowDecimal) {
        if (String.fromCharCode(charCode) == ".") {
            return true;
        }
    }
    //check for 0-9 key and numpad 0-9 key
    return !(charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105));


}

///<Summaryt>
///20090310 ssoh - fetch help url
///</Summaryt>
function fetchUrl(userRoleTypePriority, hwmID) {
    try {
        if (typeof ob_post == "object") {
            var url = "";
            ob_post.ResetParams();
            ob_post.AddParam("UserRoleTypePriority", userRoleTypePriority);
            ob_post.AddParam("HwmID", hwmID);
            url = ob_post.post(null, "FetchUrl");
            if (url != "") {
                return SLGwebserverURL.replace(/(\/){1}$/, "") + url;
            }
        }
    }
    catch (e) {
        alert("fetchUrl: " + e.message);
    }
    return "";
}

/// <summary>
///   Pops up a email form the outlook web access or the AltEmailForm.aspx
/// </summary>
function mailTo(sMailURL, formName) {
    PopupResizableWindow(sMailURL, formName, '', '');
    //PopupWindow(sMailURL, formName, 800, 600);
}


/// <summary>
///   ffazio Tempoary Fix For Firefox 3.6 Bug
/// </summary>
//var _IE_getBoxObjectFor = document.all ? true : false
//if (!document.getBoxObjectFor && !_IE_getBoxObjectFor) {
//    document.getBoxObjectFor = function(el) {
//        if (!(el instanceof HTMLElement)) {
//            return;
//        } //else:
//        var b = el.getBoundingClientRect(), p = el, x = sx = b.left - el.offsetLeft, y = sy = b.top - el.offsetTop, w = window;
//        while (!(p instanceof HTMLHtmlElement)) {
//            sx += p.scrollLeft;
//            sy += p.scrollTop;
//            p = p.parentNode;
//        }
//        return { x: sx, y: sy, width: Math.round(b.width), height: Math.round(b.height),
//            element: el, firstChild: el, lastChild: el, previousSibling: null, nextSibling: null, parentBox: el.parentNode,
//            screenX: x + w.screenX + (w.outerWidth - w.innerWidth) / 2, screenY: y + w.screenY + (w.outerHeight - w.innerHeight) / 2
//        };
//    };
//}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function getContainer(iframeId) {
    if (top.document.getElementById(iframeId)) {
        return top.document.getElementById(iframeId).contentWindow;
    } else {
        return parent;
    }
}

function isSafari() {
    try {
        if (navigator) {
            if (navigator.userAgent) {
                if (navigator.userAgent.toString().toLowerCase().indexOf('safari') >= 0) {
                    return true;
                }
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function isMacFirefox() {
    try {
        if (navigator) {
            if (navigator.userAgent) {
                if (navigator.userAgent.toString().toLowerCase().indexOf('firefox') >= 0) {
                    if (navigator.userAgent.toString().toLowerCase().indexOf('mac') >= 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

///Alert with kendo UI
function kendoAlert(message) {

    /*-- tma\DDLOC: init now can be called with 1 parameter (object)--*/
    /*
     case 1: message = string
     case 2: message = object
     */

    var Default = {
        Height: 100,
        Width: 400,
        Title: "",
        Message: "",
        OkText: "OK",
        OkFunction: function() {
        }
    };

    var Options = {
        Height: Default.Height,
        Width: Default.Width,
        Title: Default.Title,
        Message: Default.Message,
        OkText: Default.OkText,
        OkFunction: Default.OkFunction
    };

    if (typeof (message) === "string") {
        Options.Message = message;
    }

    if (typeof (message) == "object") {
        if (typeof (message.Height) !== "undefined") {
            Options.Height = message.Height;
        }

        if (typeof (message.Width) !== "undefined") {
            Options.Width = message.Width;
        }

        if (typeof (message.Title) !== "undefined") {
            Options.Title = message.Title;
        }

        if (typeof (message.Message) !== "undefined") {
            Options.Message = message.Message;
        }

        if (typeof (message.OkText) !== "undefined") {
            Options.OkText = message.OkText;
        }

        if (typeof (message.OkFunction) !== "undefined") {
            Options.OkFunction = message.OkFunction;
        }
    }


    //Alert div on default.htm
    alertCommon = $("#divAlertCommon");

    if (!alertCommon.data("kendoWindow")) {
        alertCommon.kendoWindow({
            height: Options.Height,
            width: Options.Width,
            title: Options.Title,
            modal: true,
            animation: false,
            resizable: false
        });
    }
    else {
        $("#divAlertCommon").data("kendoWindow").setOptions({
            height: Options.Height,
            width: Options.Width,
            title: Options.Title
        });
    }

    kendoAlert_OkFunction_string = "";
    if (typeof (Options.OkFunction) == "function") {
        kendoAlert_OkFunction = Options.OkFunction;
        kendoAlert_OkFunction_string = "kendoAlert_OkFunction()";
    }
    else {
        kendoAlert_OkFunction_string = Options.OkFunction + "()";
    }

    var innerHTML = '';
    innerHTML += '<div style="position: relative; height:100%">';
    innerHTML += Options.Message + '<br/>';
    innerHTML += '	<div style="bottom:0;position: absolute;text-align: center; width:100%; height:30px">';
    innerHTML += '		<input id="kendoAlert_btnOK" type="button" value="' + Options.OkText + '" onclick="alertCommon.data(\'kendoWindow\').close();' + kendoAlert_OkFunction_string + '" />';
    innerHTML += '	</div>';
    innerHTML += '</div>';

    alertCommon.data("kendoWindow").content(innerHTML);
    alertCommon.data("kendoWindow").center();
    alertCommon.data("kendoWindow").open();
}


/*-------------*/
/*
 function	:	kendoConfirm
 description	:	Show confirm box to let user choose OK or Cancel (text can be change)
 creator		:	ddloc (TMA)
 create date	:	20130314
 */
/*-------------*/
function kendoConfirm(message, OkText, CancelText, OkFunction, CancelFunction, height, width, title) {
    //Confirm div on default.htm
    var DEFAULT_WIDTH = "400px";
    var DEFAULT_HEIGHT = "200px";
    var DEFAULT_TITLE = "";
    var DEFAULT_OK_BUTTON = "OK";
    var DEFAULT_CANCEL_BUTTON = "Cancel";


    alertCommon = $("#divAlertCommon");
    //	alertCommon.kendoWindow({
    //	    title: (title == null || title === "") ? DEFAULT_TITLE : title,
    //	    width: (width == null || width === 0) ? DEFAULT_WIDTH : width,
    //	    height: (height == null || height === 0) ? DEFAULT_HEIGHT : height,
    //	    modal: true,
    //	    animation: false,
    //	    resizable: false
    //	});

    if (!alertCommon.data("kendoWindow")) {
        alertCommon.kendoWindow({
            title: (title == null || title === "") ? DEFAULT_TITLE : title,
            width: (width == null || width === 0) ? DEFAULT_WIDTH : width,
            height: (height == null || height === 0) ? DEFAULT_HEIGHT : height,
            modal: true,
            animation: false,
            resizable: false
        });
    }
    else {
        alertCommon.data("kendoWindow").setOptions({
            width: (width == null || width === 0) ? DEFAULT_WIDTH : width,
            height: (height == null || height === 0) ? DEFAULT_HEIGHT : height
        });

        alertCommon.data("kendoWindow").center();
    }

    kendoConfirm_CancelFunction_string = "";
    kendoConfirm_OkFunction_string = "";
    if (typeof (CancelFunction) == "function") {
        kendoConfirm_CancelFunction = CancelFunction;
        kendoConfirm_CancelFunction_string = "kendoConfirm_CancelFunction()";
    }
    else {
        kendoConfirm_CancelFunction_string = CancelFunction + "()";
    }
    if (typeof (OkFunction) == "function") {
        kendoConfirm_OkFunction = OkFunction;
        kendoConfirm_OkFunction_string = "kendoConfirm_OkFunction()";
    }
    else {
        kendoConfirm_OkFunction_string = OkFunction + "()";
    }

    var innerHTML = '';
    innerHTML += '<div style="position: relative; height:100%">';
    innerHTML += message + '<br/>';
    innerHTML += '	<div style="bottom:0;position: absolute;text-align: center; width:100%; height:30px">';
    innerHTML += '		<input id="kendoConfirm_btnOK" type="button" value="' + ((OkText == null || OkText === "") ? DEFAULT_OK_BUTTON : OkText) + '" onclick="alertCommon.data(\'kendoWindow\').close();' + kendoConfirm_OkFunction_string + '" />';
    innerHTML += '		&nbsp;&nbsp;&nbsp;';
    innerHTML += '		<input id="kendoConfirm_btnCancel" type="button" value="' + ((CancelText == null || CancelText === "") ? DEFAULT_CANCEL_BUTTON : CancelText) + '" onclick="alertCommon.data(\'kendoWindow\').close();' + kendoConfirm_CancelFunction_string + '" />';
    innerHTML += '		<script type="text/javascript">';
    innerHTML += '			//$("#kendoConfirm_btnOK").unbind("click");';
    innerHTML += '			//$("#kendoConfirm_btnOK").click(function() { alertCommon.data("kendoWindow").close();} );';
    innerHTML += '			//$("#kendoConfirm_btnCancel").unbind("click");';
    innerHTML += '			//$("#kendoConfirm_btnCancel").click(function() { alertCommon.data("kendoWindow").close();} );';
    innerHTML += '		</script>';
    innerHTML += '	</div>';
    innerHTML += '</div>';

    alertCommon.data("kendoWindow").content(innerHTML);
    //alertCommon.data("kendoWindow").content();
    alertCommon.data("kendoWindow").center();
    alertCommon.data("kendoWindow").open();
}

/*-------------*/
/*
 function	:	SetWindowCenter
 description	:	Set the control center the current screen
 creator		:	ddloc (TMA)
 create date	:	20130314
 alter by dhson(TMA)

 DDLOC change: if both top, bottom or left,right = % --> calculate the %
 */
/*-------------*/
function SetWindowCenter(control) {
    if ($(control).length == 0) return;
    if (PM.Config.IS_MOBILE) {
        $(control).css({position: 'absolute'});
    } else {
        $(control).css({position: 'fixed'});
    }
    $('body').css("overflow", "hidden");

    //calculate the top, bottom
    if ($(control)[0].style.top.indexOf("%") >= 0 && $(control)[0].style.bottom.indexOf("%") >= 0) {
        var percentTop = parseFloat($(control)[0].style.top);
        var percentBottom = parseFloat($(control)[0].style.bottom);
        var percent = (percentTop + percentBottom) / 2;

        $(control)[0].style.top = percent + "%";
        $(control)[0].style.bottom = percent + "%";
    }
    else {
        $(control).css("top", ($(control).position().top - ($(control).offset().top)) + (windowHeight - $(control).outerHeight()) / 2 + "px");
    }

    //calculate the left, right
    if ($(control)[0].style.left.indexOf("%") >= 0 && $(control)[0].style.right.indexOf("%") >= 0) {
        var percentLeft = parseFloat($(control)[0].style.left);
        var percentRight = parseFloat($(control)[0].style.right);
        var percent = (percentLeft + percentRight) / 2;

        $(control)[0].style.left = percent + "%";
        $(control)[0].style.right = percent + "%";

    }
    else {
        $(control).css("left", $(control).position().left - ($(control).offset().left) + ($(window).width() - $(control).outerWidth()) / 2 + "px");
    }

    //$('body').css("overflow", "auto");
}


//Download docs and Open with installed app in iPad
function iPadOpenFile(url, uti, authToken, posX, posY) {
    //$.blockUI();
    $("#divblockUI").show();
    PMHelper.PMShowModalWindow("#divblockUI");
    setTimeout(function() {
        ExternalFileUtil.openWith(url, uti, authToken, posX, posY, function(message) {
            //$.unblockUI();
            $("#divblockUI").hide();
            PMHelper.PMCloseModalWindow("#divblockUI");
            if (message != "" && message != "OK") {
                kendoAlert(message);
            }
        });
    }, 200);
}

$(document).mousedown(function(e) {
    _PM_DownloadFileX = e.pageX;
    _PM_DownloadFileY = e.pageY;
});


function openFileInIpad(blobInfoId) {
    iPadOpenFile(PM.Data.File.fetchBlobByBlobInfoID_URL(blobInfoId), '', PM.Data.Common.getBasicAuthenticationToken(), _PM_DownloadFileX, _PM_DownloadFileY);
}

//Openfile in local device
function androidOpenFile(url) {
    $.blockUI();
    setTimeout(function() {
        ExternalFileUtil.androidOpenFile(url, function(message) {
            $.unblockUI();
            if (message != "" && message != "OK") {
                kendoAlert(message);
            }
        });
    }, 200);
}

//Download docs and Open with installed app in iPad
function iPadOpenLocalFile(url) {
    $.blockUI();
    setTimeout(function() {
        ExternalFileUtil.openLocalFileWith(url, function(message) {
            $.unblockUI();
            if (message != "" && message != "OK") {
                kendoAlert(message);
            }
        });
    }, 200);
}

//Download docs and Open with installed app in iPad
function iPadOpenLocalFileWithDeleteOption(url, needToDelete) {
    $.blockUI();
    setTimeout(function() {
        ExternalFileUtil.openLocalFileWithDeleteOption(url, needToDelete, function(message) {
            $.unblockUI();
            if (message != "" && message != "OK") {
                kendoAlert(message);
            }
        });
    }, 200);
}

///----------------------------------------------------------------------------
/// <summary>
/// Function to load js and css dynamically
/// </summary>
function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

/*--Handle resize event and set height 100% for .top-container div--*/
$(function() {
    $(window).resize(function() {
        if ($('.top-container').length > 0) {
            $('.top-container').height($(window).height() - $('.top-container').offset().top);
        }
    });
    $(window).resize();
});
//var intLoopRefreshGrid = 0; 

/// Use to refresh content kendo grid to work around for kendo limitation
var intLoopRefreshGrid = 0;
var intLoopRefreshGridHeight = 1;
var valueChange1 = 0; // height of grid
var valueChange2 = 0; // height of grid
var timeRefresh = 0;
var timeSetPosition = 0;
var interVariable;

//This work around kendo Bug about grid height
function resizeKendoGrid(gridElementId, diffHeight) {
    var dataArea = $(gridElementId).parent();
    var container = dataArea.parent();
    var dataHeight = dataArea.height();

    dataArea.css("position", "absolute");
    dataArea.css("bottom", "0px");
    dataArea.css("top", dataArea.prev(".k-grid-header").height() + "px");
    if (PM.Config.IS_MOBILE) {
        dataArea.height(container.parent().height() - diffHeight);
    }

}
function htmlEscape(str) {
    return String(str)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "");
}
/*--Helper for kendo UI--*/
var KendoHelper =
{
    changeListDropdownlistStatus: function(listId, isEnable) {
        if (listId) {
            for (var i = 0; i < listId.length; i++) {
                var _ddl = $(listId[i]).data("kendoDropDownList");
                if (_ddl != undefined) {
                    _ddl.enable(isEnable);
                }
            }
        }
    },
    createDropdownList: function(_elementID, _parameters) {
        if (typeof ($(_elementID).data("kendoDropDownList")) === typeof (undefined)) {
            $(_elementID).kendoDropDownList(_parameters);
        }
    },
    createNumbericTextbox: function(_elementID, _parameters) {
        if (typeof ($(_elementID).data("kendoNumericTextBox")) === typeof (undefined)) {
            $(_elementID).kendoNumericTextBox(_parameters);
        }
    },
    setDataTimePicker: function(TimePickerIdOrElement, time) {
        var control = $(TimePickerIdOrElement).data("kendoTimePicker");
        if (control != undefined) {
            control.value(time);
        }
    },
    setDataDatePicker: function(DatePickerIdOrElement, date) {
        var control = $(DatePickerIdOrElement).data("kendoDatePicker");
        if (control != undefined) {
            control.value(date);
        }
    },
    setDataSourceList: function(gridIdOrElement, datasource) {
        var control = $(gridIdOrElement).data("kendoListView");
        if (control != undefined) {
            control.dataSource.data(datasource);
            control.dataSource.query();
        }
    },
    setDataSourceDropDown: function(gridIdOrElement, datasource) {
        var control = $(gridIdOrElement).data("kendoDropDownList");
        if (control != undefined) {
            control.setDataSource(datasource);
            control.select(0);
            if (datasource instanceof Array) {
                if (datasource.length == 0) {
                    if ($(gridIdOrElement).data("kendoDropDownList").options.optionLabel === "") {
                        var textField = control.options.dataTextField;
                        var valueField = control.options.dataValueField;
                        var defaultItem = {};
                        defaultItem[textField] = "";
                        defaultItem[valueField] = 0;
                        control.dataSource.data([defaultItem]); // clears dataSource
                        control.select(0);
                    }
                    else {
                    }
                }
            }
        }
    },
    setDataSourceGrid: function(gridIdOrElement, datasource) {
        var control = $(gridIdOrElement).data("kendoGrid");
        if (control != undefined) {
            control.dataSource.data(datasource);
            control.dataSource.query();
        }
        //intLoopRefreshGrid = self.setInterval(function () { resizeKendoGrid(gridIdOrElement, 0); }, 100);        
    },

    //DDLOC: modify add enable,disable for controls
    setEnableKendoControl: function(idArray, isEnable) {
        $.each(idArray, function(index, value) {

            var control = $(value);
            $.each(KendoControlType, function(index1, kendoControlType) {

                if (control.data(kendoControlType) != undefined) {
                    switch (kendoControlType) {
                        case KendoControlType.DropDownList:
                            control.data(kendoControlType).enable(isEnable);
                            break;
                        case KendoControlType.Combobox:
                            break;
                        case KendoControlType.DatePicker:
                            control.data(kendoControlType).enable(isEnable);
                            break;
                        case KendoControlType.TimePicker:
                            if (!isEnable)
                                control.data(kendoControlType).enable(false);
                            else
                                control.data(kendoControlType).enable();
                            break;
                        case KendoControlType.DateTimePicker:
                            control.data(kendoControlType).enable(isEnable);
                            break;
                        case KendoControlType.MultiSelect:
                            break;
                        case KendoControlType.NumbericTextBox:
                            control.data(kendoControlType).enable(isEnable);
                            break;
                        case KendoControlType.UpLoad:
                            if (isEnable) control.data(kendoControlType).enable();
                            else control.data(kendoControlType).disable();
                            break;
                        case KendoControlType.Grid:
                            break;
                        case KendoControlType.ListView:
                            break;
                        default:
                    }
                }
                else {
                    //for normal control
                    if (isEnable === true) {
                        control.removeAttr("disabled");
                    }
                    else {
                        control.attr("disabled", "disabled");
                    }

                }
            });
        });
    },


    ChangeGridRowTemplate: function(gridIdOrElement, rowTemplate, altRowTemplate) {
        var control = $(gridIdOrElement).data("kendoGrid");
        if (control != undefined) {
            if (typeof (rowTemplate) != typeof (undefined)) {
                rowTemplate = $(rowTemplate);
                control.rowTemplate = kendo.template(rowTemplate.html());
            }
            if (typeof (altRowTemplate) != typeof (undefined)) {
                altRowTemplate = $(altRowTemplate);
                control.altRowTemplate = kendo.template(altRowTemplate.html());
            }

            control.dataSource.read();
        }
    },

    getDropDownValue: function(gridIdOrElement, returnDefaultIfEmpty, defaultValue) {
        var ddl = $(gridIdOrElement).data('kendoDropDownList');
        if (ddl != undefined) {

            if (ddl.dataSource.data().length == undefined) {
                return defaultValue ? defaultValue : 0;
            }
            else {
                if (ddl.value() == '' && returnDefaultIfEmpty) {
                    return defaultValue ? defaultValue : 0;
                }
            }
            return ddl.value();
        } else {
            return defaultValue ? defaultValue : 0;
        }
    },
    getDropDownText: function(gridIdOrElement, defaultValue) {
        var ddl = $(gridIdOrElement).data('kendoDropDownList');
        if (ddl != undefined) {

            if (ddl.dataSource.data().length == undefined) {
                return defaultValue ? defaultValue : 0;
            }
            return ddl.text();
        } else {
            return defaultValue ? defaultValue : 0;
        }
    },
    setDropDownValue: function(ddlIdOrElement, value) {
        $.each($(ddlIdOrElement), function(index, dropdown) {

            var ddl = $(dropdown).data('kendoDropDownList');
            if (ddl != undefined) {

                ddl.value(value);
            }

        });
    },
    reloadGrid: function(_isCanEdit, _gv, _source, _btnDelete, _parent, _event, callback) {
        if (_gv == undefined) {
            return;
        }
        _source == undefined ? [] : _source;
        _gv.dataSource.data(_source);
        _gv.dataSource.query();

        if (_isCanEdit) {
            if (_source.length > 0) {
                $(_btnDelete, _parent).on("click", _event);
            }
        }

        //run callback
        PMCommonFunction.RunCallback(callback);

    },
    getCalendarValue: function(datePicker, returnDefaultIfEmpty, defaultValue) {
        var calendar = $(datePicker).data('kendoDatePicker');
        if (typeof (calendar) != "undefined") {
            if (calendar.value() == null && returnDefaultIfEmpty) {
                return defaultValue ? defaultValue : new Date();
            }
            return calendar.value();
        } else {
            return defaultValue ? defaultValue : new Date();
        }
    },
    setCalendarValue: function(datePicker, value) {
        var calendar = $(datePicker).data('kendoDatePicker');
        if (calendar != undefined) {
            calendar.value(value);
        }
    },

    /*-- Functions for Dropdownlist --*/
    RemovePopupWhenScroll: function(container) {
        $(container).on("scroll", function() {
            $("[data-role=popup]").kendoPopup("close");
        });
    },
    /*-- END Functions for Dropdownlist --*/



    /*-- Functions for numeric --*/
    GetNumericValue: function(numericTextBox, returnDefaultIfEmpty, defaultValue) {
        var numeric = $(numericTextBox).data('kendoNumericTextBox');
        if (typeof (numeric) != "undefined") {
            if (numeric.value() == null) {
                if (typeof (returnDefaultIfEmpty) !== typeof (undefined)) {
                    return returnDefaultIfEmpty;
                }
                else {
                    return defaultValue ? defaultValue : 0;
                }
            }
            else {
                return numeric.value();
            }
        } else {
            return defaultValue ? defaultValue : 0;
        }
    },
    SetNumericValue: function(ddlIdOrElement, value) {
        $.each($(ddlIdOrElement), function(index, numeric) {

            var control = $(numeric).data('kendoNumericTextBox');
            if (control != undefined) {

                control.value(value);
            }

        });
    },
    /*-- END Functions for numeric --*/

    /*-- Function use for tree_view --*/
    setCheckBox_TreeNode: function(node, checked) {
        if (checked == true) {
            //$('input', '[data-uid="' + node.uid + '"]').attr('checked', 'checked');
            if ($('input', '[data-uid="' + node.uid + '"]').attr('checked') != 'checked') {
                $('input', '[data-uid="' + node.uid + '"]').click();
            }
        }
        else {
            $('input', '[data-uid="' + node.uid + '"]').removeAttr('checked');
        }
    },

    CheckKendoTreeViewBoxes: function(kendoTreeView, list, listId, callback) {
        //Parameters:
        //kendoTreeView: (one of below)
        // + id string (without #)
        // + id string
        // + DOM element
        // + jquery selector

        //list:
        // + array of int
        // + array of object with id to check is listId parameter

        //listId:
        // + not given
        // + string id of the object in list

        if (typeof (listId) == "undefined") {
            listId = null;
        }

        if ($.isArray(list) == false) {
            return;
        }

        if (list.length == 0) {
            return;
        }

        //check list of object or list of int
        if (typeof (list[0]) == "object") {
            if (listId == null) {
                listId = Object.keys(list[0])[0];
            }

            var newList = [];
            $.each(list, function(index, value) {
                newList.push(value[listId]);
            });

            list = newList;
        }

        //after this, the list is only the list of int;

        if (typeof (kendoTreeView) == "string") {
            if (kendoTreeView.substr(0, 1) == "#") {
                kendoTreeView = $(kendoTreeView);
            }
            else {
                kendoTreeView = $("#" + kendoTreeView);
            }
        }

        kendoTreeView = $(kendoTreeView);

        //check if list is list of int or list of object


        var tree = kendoTreeView.data("kendoTreeView");

        var rootNodes = tree.dataSource.view();
        $.each(rootNodes, function(index, node) {
            KendoHelper.CheckKendoTreeViewBox(node, list);
        });

        PMCommonFunction.RunCallback(callback);
    },

    CheckKendoTreeViewBox: function(node, list) {
        //check current node
        if ($.inArray(node.id, list) >= 0) {
            KendoHelper.setCheckBox_TreeNode(node, true);
        }
        else {
            KendoHelper.setCheckBox_TreeNode(node, false);
        }

        //check children
        if (node.hasChildren == true) {
            var children = node.children.view();
            $.each(children, function(index, node) {
                KendoHelper.CheckKendoTreeViewBox(node, list);
            });
        }
    },

    /*-- Function use for calendar --*/
    Calendar_FromTo: function(from, to, callback) {
        //from, to are require
        if (typeof (from) === "undefined") {
            return;
        }

        if (typeof (to) === "undefined") {
            return;
        }

        var THIS = this;

        //constant
        this.SOME_CONSTANTS = "Constanst";

        //controls - public

        this.Controls = {};
        this.Controls.From = $(from);
        this.Controls.To = $(to);

        //others
        this.Var = null;

        /*-- FUNCTIONS --*/
        this.Functions = {};

        this.Functions.FunctionWithCallBack = function(callback) {
            //a can-callback function
            {
                if (typeof (callback) === "function") {
                    callback();
                }
            }
        };

        this.Functions.GetControlsValue = function() {
            var from_date = KendoHelper.getCalendarValue(THIS.Controls.From, true, new Date());
            var to_date = KendoHelper.getCalendarValue(THIS.Controls.To, true, new Date());

            return {
                FromDate: from_date,
                ToDate: to_date
            };
        };

        this.Functions.removeEvents = function() {
            THIS.Controls.From.unbind("change");
            THIS.Controls.To.unbind("change");
        };

        this.Functions.SetMinMaxDate = function() {
            var fromCalendar = THIS.Controls.From.data('kendoDatePicker');
            var toCalendar = THIS.Controls.To.data('kendoDatePicker');
            if (!PMHelper.IsAvailable(fromCalendar) || !PMHelper.IsAvailable(toCalendar)) {
                return;
            }
            toCalendar.min(fromCalendar.value());
            toCalendar.max(new Date(2099, 11, 31));

            var FromDate = fromCalendar.value();
            var ToDate = toCalendar.value();
            if (ToDate != null && ToDate < FromDate) {
                toCalendar.value(FromDate);
            }
        };

        this.Functions.SetDate = function(fromDate, toDate) {
            var fromCalendar = THIS.Controls.From.data('kendoDatePicker');
            var toCalendar = THIS.Controls.To.data('kendoDatePicker');
            if (!PMHelper.IsAvailable(fromCalendar) || !PMHelper.IsAvailable(toCalendar)) {
                return;
            }
            if (fromDate != null) {
                fromCalendar.value(fromDate);
                THIS.Functions.SetMinMaxDate();
            }
            if (toDate != null) {
                toCalendar.value(toDate);
                THIS.Functions.SetMinMaxDate();
            }


        };

        this.Functions.SetLimitation = function(fromDate, toDate) {
            var fromCalendar = THIS.Controls.From.data('kendoDatePicker');
            var toCalendar = THIS.Controls.To.data('kendoDatePicker');
            if (!PMHelper.IsAvailable(fromCalendar) || !PMHelper.IsAvailable(toCalendar)) {
                return;
            }
            if (fromDate != null) {
                fromCalendar.min(fromDate);
            }
            if (toDate != null) {
                toCalendar.max(toDate);
            }

        };


        /*-- END FUNCTIONS --*/

        /*-- EVENT --*/
        this.Events = {};

        /*-- From_Change --*/
        this.Events.From_Change = function(event) {
            THIS.Functions.SetMinMaxDate();
        };

        /*-- To_Change --*/
        this.Events.To_Change = function(event) {
            THIS.Functions.SetMinMaxDate();
        };

        /*-- END EVENT --*/

        /*-- INIT --*/
        //this function use to assign event for controls
        this.AssignEvent = function() {
            THIS.Functions.removeEvents();

            THIS.Controls.From.change(THIS.Events.From_Change);
            THIS.Controls.To.change(THIS.Events.To_Change);
        };

        this.InitData = function(callback) {
            if (typeof (callback) === "function") {
                callback();
            }
        };

        this.InitControl = function(callback) {
            THIS.Controls.From.kendoDatePicker({
                format: _shortDateFormat
            });
            THIS.Controls.From.attr("readonly", "readonly");
            THIS.Controls.To.kendoDatePicker({
                format: _shortDateFormat
            });
            THIS.Controls.To.attr("readonly", "readonly");
            if (typeof (callback) === "function") {
                callback();
            }
        };

        this.FillData = function(callback) {
            if (typeof (callback) === "function") {
                callback();
            }
        };

        /*-- END INIT --*/

        /*-- Call some init function --*/
        THIS.InitData(
            function() {
                THIS.InitControl(
                    function() {
                        THIS.AssignEvent();

                        THIS.FillData(
                            function() {
                                if (typeof (callback) === "function") {
                                    callback();
                                }

                            });
                    });
            });
    },
    /// Use to refresh content kendo grid to work around for kendo limitation by check parent (k-grid-content class)
    CallRefreshGrid: function(gridElementId) {
        timeRefresh = 0;
        clearInterval(intLoopRefreshGrid);
        intLoopRefreshGrid = setInterval(function() {
            KendoHelper.RefreshKendoGrid(gridElementId);
        }, 100);
    },
    RefreshKendoGrid: function(gridElementId) {
        var _grid = $(gridElementId).data("kendoGrid");
        if (_grid != undefined)
            _grid.refresh();
        if ($(gridElementId).parent().height() > 0 || timeRefresh > 1000) //k-grid-content class
            intLoopRefreshGrid = clearInterval(intLoopRefreshGrid);
        timeRefresh += 100;
    },
    /// Use to refresh content kendo grid to work around for kendo limitation by check Grid height
    CallRefreshGridHeight: function(gridElementId) {
        timeRefresh = 0;
        clearInterval(intLoopRefreshGridHeight);
        intLoopRefreshGridHeight = setInterval(function() {
            KendoHelper.RefreshKendoGridHeight(gridElementId);
        }, 100);
    },
    RefreshKendoGridHeight: function(gridElementId) {
        var _grid = $(gridElementId).data("kendoGrid");
        if (_grid != undefined)
            _grid.refresh();
        valueChange1 = $(gridElementId).height();
        valueChange2 = $(gridElementId).parent().height();

        if (valueChange1 > 100 || valueChange2 > 100 || timeRefresh > 1000) {
            clearInterval(intLoopRefreshGridHeight);
        }
        timeRefresh += 100;
    },
    CallSetPositonGridContent: function(gridElementId) {
        if (PM.Config.IS_MOBILE == false) {
            timeSetPosition = 0;
            interVariable = setInterval(function() {
                KendoHelper.SetPositionGridContent(gridElementId);
            }, 100);
        }
        //DDLOC add this (not to check the device)
        else {
            KendoHelper.CallRefreshGridHeight(gridElementId);
        }
    },
    SetPositionGridContent: function(gridElementId) {
        var kcontent = $(gridElementId).parent();
        $(kcontent).css("position", "absolute");
        $(kcontent).css("height", "auto");
        $(kcontent).css("bottom", "0");
        $(kcontent).css("top", $(kcontent).prev(".k-grid-header").height() + 1 + "px");
        if ($(kcontent).prev(".k-grid-header").height() > 0 || timeSetPosition > 1000)
            clearInterval(interVariable);
        timeSetPosition += 100;
    },

    SetScrollbarForAllGrid: function() {
        //DDLOC add this for resize the scrollbar of the grid
        //TODO: check if it work on mobile --> please input this code to
        setTimeout(function() {
            {
                var grids = $(".k-grid");
                $.each(grids, function(index, grid) {
                    var header = $(grid).find(".k-grid-header:first");
                    var content = $(grid).find(".k-grid-content:first");
                    content.height($(grid).height() - header.height() - 1); //minus the boder size
                });
            }
        }, 100);

    },


    //validator
    ValidateByMessageBox: function(validator, options) {
        //check validate of vadilator and options

        //validator is KendoValidator
        //options is an object has ExternalErrors property
        //ExternalErrors is object of 
        /* if has, it must like this or array of this
         {
         Title: null,
         Errors: []
         }
         */

        //ExternalErrors is an array of objects like above
        var Default = {
            Title: "Missing Required Fields",
            Width: 400,
            Height: 0, /*-- automatically --*/
            ExternalErrors: null
            /* if has, it must like this or array of this
             {
             Title: null,
             Errors: []
             }
             */
        };

        var Options = {
            Title: Default.Title,
            Width: Default.Width,
            Height: Default.Height,
            ExternalErrors: Default.ExternalErrors
        };

        var Functions = {};
        Functions.CheckExistError = function() {
            //if found any error, this flag is turn on
            var found = false;
            if (typeof (validator) === typeof (undefined)) {
                found = false;
            }
            else if (validator.validate() == false) {
                found = true;
            }

            if (found === true) return true;

            //in case of validator is undefind or defined but not error--> continue checking error

            // no external errors --> found is the finaly result
            if (Options.ExternalErrors == null) return found; //found is here = false


            //ExternalErrors is an object not array (this is may not use any more because we convert the object to array)
            if (typeof (Options.ExternalErrors) === "object" && Options.ExternalErrors.constructor !== Array) {
                found = Functions.CheckExternalError(Options.ExternalErrors);
            }
            if (found === true) return true;

            //ExternalErrors is an array object
            if (Options.ExternalErrors.constructor === Array) {
                if (Options.ExternalErrors.length > 0) {
                    $.each(Options.ExternalErrors, function(index, ExternalError) {
                        found = Functions.CheckExternalError(ExternalError);
                        if (found === true) {
                            return; //just return the .each function
                        }
                    });
                }
                else {
                    found = false;
                }
            }
            if (found === true) return true;

            //no error found
            return false;
        };

        Functions.CheckExternalError = function(ExternalError) {
            return ExternalError.Errors.length > 0;

        };

        Functions.GetMessageForExternalError = function(ExternalError) {
            var message = "";
            if (ExternalError != null) {
                if (ExternalError.Errors.length > 0) {
                    message += "<div class=\"ConfirmDialog_MessageGroup\" style=\"padding-left: 20px;text-align: left;\">";
                    //add the title if has
                    if (ExternalError.Title != "") {
                        message += "<span style=\"display:block\">" + ExternalError.Title + (ExternalError.Errors.length == 0 || ExternalError.Errors[0] == "" || ExternalError.Errors[0] == undefined ? "" : ":") + "</span>";
                    }

                    //add errors
                    for (var i = 0; i < ExternalError.Errors.length; i++) {
                        if ($.inArray(ExternalError.Errors[i], list1) == -1) {
                            message += "<p style=\"text-indent: 2em;\">" + ExternalError.Errors[i] + "</p>";
                        }
                    }
                    message += "</div>";
                }
            }

            return message;
        };

        if (typeof (options) == "object") {
            if (typeof (options.Title) !== "undefined") {
                Options.Title = options.Title;
            }

            if (typeof (options.Width) !== "undefined") {
                Options.Width = options.Width;
            }

            if (typeof (options.Height) !== "undefined") {
                Options.Height = options.Height;
            }

            if (typeof (options.ExternalErrors) !== "undefined") {
                Options.ExternalErrors = options.ExternalErrors;

                //if ExternalErrors is object but not array --> convert to array
                if (typeof (Options.ExternalErrors) === "object" && Options.ExternalErrors.constructor !== Array) {
                    var list = [];
                    list.push(Options.ExternalErrors);
                    Options.ExternalErrors = list;
                }
            }
        }

        //no error --> function return true
        if (Functions.CheckExistError() === false) return true;

        //false
        //1.hide message on GUI
        //note the function hideMessages is not release (current release is Q4 2012, the function is in the Q1-2013)
        //validator.hideMessage()
        var list = [];
        if (validator != undefined) {
            $(validator.element).find("span.k-tooltip-validation").hide();
            //2. Get errorList
            list = validator.errors();
        }

        //2.show messagebox
        var message = "";

        var list1 = [];
        if (list.length > 0) {
            message += "<div class=\"ConfirmDialog_MessageGroup\" style=\"padding-left: 20px;text-align: left;\">";
            message += "<span style=\"display:block\">" + "The following required fields are missing:" + "</span>";
            for (var i = 0; i < list.length; i++) {
                if ($.inArray(list[i], list1) == -1) {
                    message += "<p style=\"text-indent: 2em;\">" + list[i] + "</p>";
                    list1.push(list[i]);
                }
            }
            message += "</div>";
        }

        //2. calculate the height
        var height = 0;
        if (Options.Height != 0) {
            height = Options.Height; //default
        }
        else {
            height += 40 + 15;
            /*-- 40 = top 15 = margin--*/
            height += 50 + 15;
            /*-- 35 = bottom 15 = margin--*/

            //for the message wrapper
            //kendo errors
            if (list.length > 0) {
                height += 17 + list1.length * 22; //title = 17 + line = 22 (the list 1 is real lines)
            }

            //extenal error
            if (Options.ExternalErrors !== null) {
                $.each(Options.ExternalErrors, function(index, ExternalError) {
                    if (ExternalError.Title != "") {
                        height += 17;
                    }
                    height += ExternalError.Errors.length * 22;
                    /*-- 22: height of 1 line --*/
                });
            }
        }

        //for external message if has
        if (Options.ExternalErrors !== null) {
            $.each(Options.ExternalErrors, function(index, value) {
                message += Functions.GetMessageForExternalError(value);
            });
        }

        var random_id = (new Date()).getTime();

        $("#" + random_id).remove();
        $("body").append($("<div id='" + random_id + "' style='position: absolute;'></div>"));
        $("#" + random_id).load("../../SharedResources/Controls/PM/Common/ConfirmDialog_Kendo.htm",
            function() {
                ConfirmDialog({
                    Title: Options.Title,
                    Message: message,
                    TitleYes: "OK",
                    TitleNo: "No",
                    ShowYes: true,
                    ShowNo: false,
                    FunctionYes: function() {
                        $("#" + random_id).remove();
                    },
                    FunctionNo: function() {
                    },
                    Width: Options.Width,
                    Height: height,
                    Style: (new ConfirmDialog_Style()).WINDOWS_8,
                    Icon: (new ConfirmDialog_Icon()).ERROR, //from Course, Warming icon will change to Error
                    CloseIcon: true
                });
            });

        return false;
    },
    /*-- Template --*/
    GetTextFromTemplate: function(data, template, separator) {
        //use the function in the new place
        return PMCommonFunction.GetTextFromTemplate(data, template, separator);
    }

    /*-- END Template --*/
};
//Kendo Custom Binder--------------------
//LTDUY - Custom slide => show/hide element by slideup/slidedown
if (typeof (kendo) !== typeof (undefined)) {
    kendo.data.binders.slide = kendo.data.Binder.extend({
        refresh: function() {
            var value = this.bindings["slide"].get();

            if (value == true || value == 'true' || value == 'yes' || value == 'TRUE' || value == 'True' || value == 1) {
                $(this.element).slideDown();
            } else {
                $(this.element).slideUp();
            }
        }
    });
}
//---------------------------------------

/*-- tma/DDLOC: create commonfunction as class --*/
function CommonFunction() {
    var THIS = this;
    THIS.Factory = function() {
        var _factory;

        function PMFactory() {
            this.MODE = {
                SINGLETON: 1,
                REQUEST: 2
            };
            /*{
             name : "PM.MarksbookPlus",
             pointer: {}
             }*/
            var wrapper = function(f, args) {
                return function() {
                    f.apply(this, args);
                };
            };
            var objectArray = [];
            this.create = function(nameSpace, mode, params) {

                if (!params instanceof Array) throw new Error('Params have wrong type');
                var objectNames = nameSpace.split('.');
                try {
                    var object = window[objectNames[0]];
                    for (var i = 1; i < objectNames.length; i++) {
                        object = object[objectNames[i]];
                    }

                    switch (mode) {
                        case this.MODE.SINGLETON:
                            for (var i = 0; i < objectArray.length; i++) {
                                if (objectArray[i].name == nameSpace) return objectArray[i].pointer;
                            }


                            var _object = new (wrapper(object, params));
                            objectArray.push({
                                name: nameSpace,
                                pointer: _object
                            });
                            return _object;
                            break;
                        case this.MODE.REQUEST:
                            return new object(params);
                            break;
                        default:
                            break;
                    }
                } catch (e) {
                    PMHelper.ConsoleLog(e);
                    throw new Error('The name space is not exist');

                }
            };
        }

        if (_factory) {
            return _factory;
        }
        else {
            _factory = new PMFactory();
            return _factory;
        }
    };

    THIS.SynFunction = function() {
        function ConcreteSyn() {
            var THIS = this;
            var index = -1;
            var sequence = [];

            function getParamNames(func) {
                var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
                if (result === null) result = [];
                return result;
            }

            THIS.Next = function(nextFunction) {
                sequence.push(nextFunction);
                return this;
            };
            THIS.Execute = function() {

                THIS.Run();
            };
            THIS.Run = function() {
                var args = Array.prototype.slice.call(arguments);
                if (index < sequence.length) {
                    index++;
                    this.callback = THIS.Run;
                    var argumentsNameArray = getParamNames(sequence[index]);
                    for (var i = 0; i < arguments.length; i++) {
                        if (THIS[argumentsNameArray[i]]) throw new Error('There is exsist property');
                        THIS[argumentsNameArray[i]] = arguments[i];
                    }
                    sequence[index].apply(THIS, args);

                }
            };
        }

        return new ConcreteSyn();
    };

    THIS.RunCallback = function(callback) {
        if (typeof (callback) === "function") {
            var length = arguments.length;
            var new_arguments = [];

            for (var i = 1; i < arguments.length; i++) {
                new_arguments.push(arguments[i]);
            }

            callback.apply(null, new_arguments);
        }
    };

    THIS.CallFunction = function(a_function) {
        if (typeof (a_function) === "function") {
            var length = arguments.length;
            var new_arguments = [];

            for (var i = 1; i < arguments.length; i++) {
                new_arguments.push(arguments[i]);
            }

            a_function.apply(null, new_arguments);
        }
    };

    THIS.ConsoleLog = function(message) {
        try {
            if (PM) {
                if (PM.Data) {
                    if (PM.Data.Common) {
                        if (PM.Data.Common.isDebug == true) {
                            if (console) {
                                // tma\DDLOC change to apply many code
                                try {
                                    console.log.apply(console, arguments);
                                } catch (e) {
                                    console.log(message); //for browser not support
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
        }
    };

    THIS.IsAndroid = function() {
        if (navigator.userAgent.toLowerCase().match(/android/)) {
            return true;
        } else if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {
            return false;
        }
    };
    //TODO: add this to common function and change from above code
    THIS.RemoveSlashForUrl = function(url) {
        var protocall = "";
        if (url.indexOf("://") >= 0) {
            protocall = url.split("://")[0] + "://";
            url = url.split("://")[1];
        }

        while (url.indexOf("//") >= 0) {
            url = PMCommonFunction.ReplaceAll(url, "//", "/");
        }

        url = protocall + url;

        return url;
    };

    THIS.GetRelativePath = function(rootFullPath, sourceFolderFullPath, targetName) {
        var _pathNew = "";
        _pathNew = sourceFolderFullPath.substr(rootFullPath.length + 1, sourceFolderFullPath.length);
        if (_pathNew[_pathNew.length - 1] == "/") {
            _pathNew = _pathNew.substr(0, _pathNew.length - 1);
        }
        var _targetRelativePath = "";
        if (_pathNew) {
            _targetRelativePath = _pathNew + "/" + targetName;
        }
        else {
            _targetRelativePath = targetName;
        }
        return _targetRelativePath;
    };


    THIS.ReplaceSpecialCharacters = function(value) {
        value = THIS.ReplaceAll(value, "%20", " ");
        value = THIS.ReplaceAll(value, "%24", "$");
        value = THIS.ReplaceAll(value, "%23", "#");
        //$%'`-@{}~!#()&_^,.=[]
        //%24%25'%60-%40%7B%7D~!%23()%26_%5E%2C.%3D%5B%5D
        value = THIS.ReplaceAll(value, "%25", "%");
        value = THIS.ReplaceAll(value, "%40", "@");
        value = THIS.ReplaceAll(value, "%7B", "{");
        value = THIS.ReplaceAll(value, "%7D", "}");
        value = THIS.ReplaceAll(value, "%26", "&");
        value = THIS.ReplaceAll(value, "%5E", "^");
        value = THIS.ReplaceAll(value, "%2C", ",");
        value = THIS.ReplaceAll(value, "%3D", "=");
        value = THIS.ReplaceAll(value, "%5B", "[");
        value = THIS.ReplaceAll(value, "%5D", "]");
        value = THIS.ReplaceAll(value, "%60", "`");

        return value;
    };
    //Check attendance module
    THIS.AttendanceModuleChecker = function(event) {
        /*
         event ={
         none : {
         handler: function(){
         },
         params: [arg1,arg2]
         }
         ...
         }
         */
        switch (_PMModules.GetAttendanceModule()) {
            case _PMModules.ATTMODULE.NONE:
                if (event.none) {
                    if (typeof event.none.handler == "function") {
                        event.none.handler.apply(this, event.none.params);
                    }
                }
                break;
            case _PMModules.ATTMODULE.ATTENDANCEMARKING:
                if (event.attendanceMarking) {
                    if (typeof event.attendanceMarking.handler == "function") {
                        event.attendanceMarking.handler.apply(this, event.attendanceMarking.params);
                    }
                }
                break;
            case _PMModules.ATTMODULE.ATTENDENCEMANAGEMENT.STAFF:
                if (event.attendanceManagementStaff) {
                    if (typeof event.attendanceManagementStaff.handler == "function") {
                        event.attendanceManagementStaff.handler.apply(this, event.attendanceManagementStaff.params);
                    }
                }
                break;
            case _PMModules.ATTMODULE.ATTENDENCEMANAGEMENT.MANAGER:
                if (event.attendanceManagementManager) {
                    if (typeof event.attendanceManagementManager.handler == "function") {
                        event.attendanceManagementManager.handler.apply(this, event.attendanceManagementManager.params);
                    }
                }
                break;
            default:
                break;
        }
    };

    //tma/nguyentrunghieu 31/05/2013
    THIS.GetListFormUrlParentChildren = function(urlParent, urlChildren) {
        /* THIS function return array to move from parent to children
         parent = 1/2/3
         children = 1/2/3/4/5/6
         --> [4,5,6]

         parent = 1/2/5
         children = 1/2/3/4/5/6

         --> []
         --*/

        var _itemArray = [];
        var _path;

        urlParent = THIS.RemoveSlashForUrl(urlParent);
        urlChildren = THIS.RemoveSlashForUrl(urlChildren);

        while (urlChildren.substr(urlChildren.length - 1) == "/") {
            urlChildren = urlChildren.substr(0, urlChildren.length - 1);
        }

        while (urlParent.substr(urlParent.length - 1) == "/") {
            urlParent = urlParent.substr(0, urlParent.length - 1);
        }

        urlParent = THIS.ReplaceSpecialCharacters(urlParent);
        urlChildren = THIS.ReplaceSpecialCharacters(urlChildren);

        if (urlChildren.lastIndexOf(urlParent) < 0 || urlParent == urlChildren) {
            return [];
        }


        while ((urlParent != urlChildren) && (urlChildren.lastIndexOf(urlParent) >= 0)) {
            _path = urlChildren.substr(0, urlChildren.lastIndexOf("/"));
            _nameFolder = urlChildren.substr(urlChildren.lastIndexOf("/") + 1);

            _itemArray.push({
                "Path": _path + "/" + _nameFolder + "/",
                "NameFolder": THIS.ReplaceSpecialCharacters(_nameFolder)
            });

            urlChildren = urlChildren.substr(0, urlChildren.lastIndexOf("/"));
        }

        var newArrayItem = [];

        _itemArray[_itemArray.length - 1].Parent = "";

        if (_itemArray.length == 1) {
            _itemArray[0].Parent = $("#MYFILE_FAVOURITE_LEFT_lblResourceNameTop").html();
        }
        else {
            for (var i = _itemArray.length - 2; i >= 0; i--) {
                _itemArray[i].Parent = _itemArray[i + 1].NameFolder;
            }
        }
        for (var i = _itemArray.length - 1; i >= 0; i--) {
            newArrayItem.push(_itemArray[i]);
        }

        return newArrayItem;
    };

    THIS.GetLastUrlName = function(url) {
        //get the last url to name (remove %20) with ' ' (

        //remove last /
        while (url.substr(url.length - 1, 1) == "/") {
            url = url.substr(0, url.length - 1);
        }

        //get name
        var list = url.split("/");
        var name = list[list.length - 1];

        if (name.indexOf(" ") < 0) {
            name = THIS.ReplaceAll(name, "%20", " ");
        }
        return name;
    };

    THIS.GetExtensionFromUrl = function(url) {
        //http://path/to/the/filename.extension
        //--> extension

        var fileFullName = THIS.GetLastUrlName(url);
        var Extension = "";
        var _arrayDataFile = fileFullName.split(".");

        if (_arrayDataFile.length > 1) {
            Extension = _arrayDataFile[_arrayDataFile.length - 1];
        }
        return Extension;
    };

    THIS.GetFileNameFromUrl = function(url) {
        //http://path/to/the/filename.extension
        //--> filename
        var fileFullName = THIS.GetLastUrlName(url);
        var Extension = "";
        var FileName = "";
        var _arrayDataFile = fileFullName.split(".");

        if (_arrayDataFile.length > 1) {
            Extension = _arrayDataFile[_arrayDataFile.length - 1];
            FileName = fileFullName.substr(0, fileFullName.length - Extension.length - 1);
        }
        else {
            //no ExtensionType
            FileName = fileFullName;
        }

        return FileName;
    };

    THIS.MergeFileExtension = function(fileName, extension) {
        //filename (without extension)
        //extension (can be empty)

        if (extension == "") return fileName;
        return fileName + "." + extension;

    };

    THIS.ReplaceAll = function(text, search, replace) {
        return text.split(search).join(replace);
    };

    THIS.EncodeUrlFull = function(url) {
        var protocall = "";
        if (url.indexOf("://") >= 0) {
            protocall = url.split("://")[0] + "://";
            url = url.split("://")[1];
        }

        while (url.indexOf("//") >= 0) {
            url = PMCommonFunction.ReplaceAll(url, "//", "/");
        }

        var urls = url.split("/");
        for (var i = 0; i < urls.length; i++) {
            urls[i] = encodeURIComponent(urls[i]);
        }


        url = urls.join("/");
        url = protocall + url;
        return url;
    };

    THIS.CheckWebDavOrDeviceUrlFull = function(url) {
        return !!(url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0);
    };


    THIS.DecodeUrlFull = function(url) {
        var protocall = "";
        if (url.indexOf("://") >= 0) {
            protocall = url.split("://")[0] + "://";
            url = url.split("://")[1];
        }

        while (url.indexOf("//") >= 0) {
            url = PMCommonFunction.ReplaceAll(url, "//", "/");
        }

        var urls = url.split("/");
        for (var i = 0; i < urls.length; i++) {
            urls[i] = decodeURIComponent(urls[i]);
        }


        url = urls.join("/");
        url = protocall + url;
        return url;
    };

    //Hieu Nguyen Trung
    THIS.EncodeLinkFullForPrint = function(url) {
        var _valueFirst = "";

        if (url.indexOf("?") >= 0) {
            _valueFirst = url.split("?")[0];
            url = url.split("?")[1];
        }

        while (url.indexOf("//") >= 0) {
            url = PMCommonFunction.ReplaceAll(url, "//", "/");
        }

        if (!PMCommonFunction.CheckEncodeUrlFull(url)) {

            var urls = url.split("&");
            var urls_chil = [];

            for (var i = 0; i < urls.length; i++) {
                urls_chil[i] = urls[i].split("=")[0] + "=" + encodeURIComponent(urls[i].split("=")[1]);
            }
            url = urls_chil.join("&");

        }

        url = _valueFirst + "?" + url;

        return url;
    };

    //Hieu Add 23/08/2013
    THIS.LoadFolderAndFileForAndroid = function(path, callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) { // success get file system
                root = fileSystem.root;
                var _pathNew = "";
                _pathNew = path.substr(root.fullPath.length + 1, path.length);
                if (!_pathNew) {
                    PMCommonFunction.RunCallback(callback, root);
                }
                else {
                    root.getDirectory(_pathNew, {create: false, exclusive: false}, function(dataDir) {
                        PMCommonFunction.RunCallback(callback, dataDir);

                    }, function(eror) {
                        alert(error);
                    });
                }

            }, function(evt) { // error get file system
                PMCommonFunction.ConsoleLog("File System Error: " + evt.target.error.code);
            }
        );
    };

    THIS.CheckEncodeUrlFull = function(url) {
        var specialCharacters = ["%20", "%24", "%23", "%25", "%40", "%7B", "%7D", "%26", "%5E", "%2C", "%3D", "%5B", "%5D", "%60"];
        var protocall = "";
        var _flag = false;
        if (url.indexOf("://") >= 0) {
            protocall = url.split("://")[0] + "://";
            url = url.split("://")[1];
        }

        while (url.indexOf("//") >= 0) {
            url = PMCommonFunction.ReplaceAll(url, "//", "/");
        }

        var urls = url.split("/");

        for (var i = 0; i < urls.length; i++) {
            if (urls[i].indexOf(specialCharacters[0]) >= 0 || urls[i].indexOf(specialCharacters[1]) >= 0 || urls[i].indexOf(specialCharacters[2]) >= 0 || urls[i].indexOf(specialCharacters[3]) >= 0 ||
                urls[i].indexOf(specialCharacters[4]) >= 0 || urls[i].indexOf(specialCharacters[5]) >= 0 || urls[i].indexOf(specialCharacters[6]) >= 0 || urls[i].indexOf(specialCharacters[7]) >= 0 ||
                urls[i].indexOf(specialCharacters[8]) >= 0 || urls[i].indexOf(specialCharacters[9]) >= 0 ||
                urls[i].indexOf(specialCharacters[10]) >= 0 || urls[i].indexOf(specialCharacters[11]) >= 0 || urls[i].indexOf(specialCharacters[12]) >= 0 || urls[i].indexOf(specialCharacters[13]) >= 0) {
                _flag = true;
                break;
            }
        }

        return !!_flag;

    };

    THIS.CheckEncodeNameFull = function(_name) {
        var specialCharacters = ["%20", "%24", "%23", "%25", "%40", "%7B", "%7D", "%26", "%5E", "%2C", "%3D", "%5B", "%5D", "%60"];

        return !!(_name.indexOf(specialCharacters[0]) >= 0 || _name.indexOf(specialCharacters[1]) >= 0 || _name.indexOf(specialCharacters[2]) >= 0 || _name.indexOf(specialCharacters[3]) >= 0 ||
        _name.indexOf(specialCharacters[4]) >= 0 || _name.indexOf(specialCharacters[5]) >= 0 || _name.indexOf(specialCharacters[6]) >= 0 || _name.indexOf(specialCharacters[7]) >= 0 ||
        _name.indexOf(specialCharacters[8]) >= 0 || _name.indexOf(specialCharacters[9]) >= 0 ||
        _name.indexOf(specialCharacters[10]) >= 0 || _name.indexOf(specialCharacters[11]) >= 0 || _name.indexOf(specialCharacters[12]) >= 0 || _name.indexOf(specialCharacters[13]) >= 0);
    };

    THIS.EncodeUrlSpecialFull = function(url) {
        url = PMCommonFunction.RemoveSlashForUrl(url);
        url = PMCommonFunction.ReplaceAll(url, "\\", "/");
        url = PMCommonFunction.EncodeUrlFull(url);
        return url;
    };

    THIS.ClearTagId = function(div) {
        $(div).find("[id]").attr("id", "" + Math.random(new Date()));
    };

    THIS.ReloadBodyModalIpad = function() {
        $(".height-text-box").bind("blur", function() {
            $("body").height($("body").height() + 1);
            $("body").height($("body").height() - 1);
        });
    };

    //DDLOC 20131029 (css now support multi css)
    THIS.CreateRandomTag = function(control, css, classes) {
        if (typeof (control) === typeof (undefined)) {
            control = $("body");
        }

        control = $(control);

        var random_id = (new Date()).getTime();

        $("#" + random_id).remove();
        $(control).append($("<div id='" + random_id + "' Random_Tag></div>"));

        var new_div = $("#" + random_id);
        if (typeof (css) !== typeof (undefined)) {
            if (css.constructor === Array) {
                $.each(css, function(index, value) {
                    new_div.css(value);
                });
            }
            else {
                new_div.css(css);
            }
        }

        if (typeof (classes) !== typeof (undefined)) {
            if (classes.constructor === Array) {
                $.each(classes, function(index, value) {
                    new_div.addClass(value);
                });
            }
            else {
                new_div.addClass(classes);
            }
        }

        return new_div;
    };

    THIS.LoadPopupRandomTag = function(paraCreateRandomTag, page, callback) {

        var div_random = THIS.CreateRandomTag(paraCreateRandomTag.control, paraCreateRandomTag.css, paraCreateRandomTag.classes);
        div_random.load(page, function() {
            if (status == "error")
                THIS.ConsoleLog("There was an error.");
            else {
                var _formSize = {
                    width: paraCreateRandomTag[1].width,
                    height: paraCreateRandomTag[1].height
                };
                var _currentWindowSize = {
                    height: window.innerHeight,
                    width: window.innerWidth
                };

                var _defaultPopupStyle = {
                    width: _formSize.width,
                    height: _formSize.height,
                    top: (_currentWindowSize.height - _formSize.height) / 2,
                    left: (_currentWindowSize.width - _formSize.width) / 2
                };

                var _currentPopupStyle = {};
                $.extend(_currentPopupStyle, _defaultPopupStyle);
                div_random.css('width', _defaultPopupStyle.width);
                div_random.css('height', _defaultPopupStyle.height);
                div_random.css('top', _defaultPopupStyle.top);
                div_random.css('left', _defaultPopupStyle.left);
            }
            function SetPopupPosition() {
                //_currentPopupStyle.top = 
                _currentPopupStyle.width = window.innerWidth;
                _currentPopupStyle.height = window.innerHeight;
                if (_currentPopupStyle.width <= _formSize.width) {
                    _currentPopupStyle.left = 0;
                    div_random.css('left', _currentPopupStyle.left);
                } else {
                    _currentPopupStyle.left = (_currentPopupStyle.width - _formSize.width) / 2;
                    div_random.css('left', _currentPopupStyle.left);
                }

                if (_currentPopupStyle.height <= _formSize.height) {
                    _currentPopupStyle.top = 0;
                    div_random.css('top', _currentPopupStyle.top);
                } else {
                    _currentPopupStyle.top = (_currentPopupStyle.height - _formSize.height) / 2;
                    div_random.css('top', _currentPopupStyle.top);
                }

                div_random.show();
            }

            window.onresize = SetPopupPosition;
            SetPopupPosition();
            THIS.RunCallback(callback);
        });
    };

    THIS.LoadPopup = function(divcontrol, paraCreateRandomTag, page, callback) {

        divcontrol.load(page, function() {
            if (status == "error")
                THIS.ConsoleLog("There was an error.");
            else {
                var _formSize = {
                    width: paraCreateRandomTag[1].width,
                    height: paraCreateRandomTag[1].height
                };
                var _currentWindowSize = {
                    height: window.innerHeight,
                    width: window.innerWidth
                };

                var _defaultPopupStyle = {
                    width: _formSize.width,
                    height: _formSize.height,
                    top: (_currentWindowSize.height - _formSize.height) / 2,
                    left: (_currentWindowSize.width - _formSize.width) / 2
                };

                var _currentPopupStyle = {};
                $.extend(_currentPopupStyle, _defaultPopupStyle);
                divcontrol.css('width', _defaultPopupStyle.width);
                divcontrol.css('height', _defaultPopupStyle.height);
                divcontrol.css('top', _defaultPopupStyle.top);
                divcontrol.css('left', _defaultPopupStyle.left);
            }
            function SetPopupPosition() {
                //_currentPopupStyle.top = 
                _currentPopupStyle.width = window.innerWidth;
                _currentPopupStyle.height = window.innerHeight;
                if (_currentPopupStyle.width <= _formSize.width) {
                    _currentPopupStyle.left = 0;
                    divcontrol.css('left', _currentPopupStyle.left);
                } else {
                    _currentPopupStyle.left = (_currentPopupStyle.width - _formSize.width) / 2;
                    divcontrol.css('left', _currentPopupStyle.left);
                }

                if (_currentPopupStyle.height <= _formSize.height) {
                    _currentPopupStyle.top = 0;
                    divcontrol.css('top', _currentPopupStyle.top);
                } else {
                    _currentPopupStyle.top = (_currentPopupStyle.height - _formSize.height) / 2;
                    divcontrol.css('top', _currentPopupStyle.top);
                }

                divcontrol.show();
            }

            window.onresize = SetPopupPosition;
            SetPopupPosition();
            THIS.RunCallback(callback);
        });
    };

    THIS.RemoveIfRandomTag = function(control) {
        if ($(control).is("[random_tag]") == true) {
            $(control).remove();
        }
    };

    /*-- FOR LIST --*/
    THIS.SetRowIndex = function(list) {
        for (var i = 0; i < list.length; i++) {
            list[i].RowIndex = i;
        }
        return list;
    };

    /*-- END FOR LIST --*/

    /*-- SELECT --*/
    THIS.GetSelectHtmlTagFromList = function(list, itemObject) {
        //itemObject{display,value}
        //list = array
        //item = {value,display}
        //item co the la text --> value = display

        var html = "";

        if (typeof (list) === "string") {
            html +=
                "<option value='"
                + list.replace("'", "&#39")
                + "'>"
                + list.replace("'", "&#39")
                + "</option>\n";

            return html;
        }

        $.each(list, function(index, value) {
            if (typeof (value) == "string" || typeof (value) == "number") {
                value = value.toString();
                html +=
                    "<option value='"
                    + value.replace("'", "&#39")
                    + "'>"
                    + value.replace("'", "&#39")
                    + "</option>\n";
            }

            var option_value = "";
            var option_display = "";
            var option_selected = false;
            if (typeof (value) == "object") {
                if (typeof (itemObject) === typeof (undefined)) {

                    if (typeof (value.value) !== typeof (undefined)) {
                        option_value = value.value.toString();
                    }

                    if (typeof (value.display) !== typeof (undefined)) {
                        option_display = value.display.toString();
                    }

                }
                else {
                    option_value = value[itemObject.value].toString();
                    option_display = value[itemObject.display].toString();
                }

                html +=
                    "<option value='"
                    + option_value.replace("'", "&#39")
                    + "'>"
                    + option_display.replace("'", "&#39")
                    + "</option>\n";

            }
        });

        return html;
    };

    THIS.SetDataCombobox = function(combobox, data, itemObject) {
        combobox = $(combobox);
        if (combobox.is("select") === false) return;

        combobox.html(THIS.GetSelectHtmlTagFromList(data, itemObject));
    };

    THIS.SetValueCombobox = function(combobox, value) {
        combobox = $(combobox);
        if (combobox.is("select") === false) return;

        var isFound = false;
        $.each(combobox.find("option"), function(index, item_value) {
            if ($(item_value).attr("value") == value) {
                combobox.val(value);
                isFound = true;
            }
        });

        return isFound;
    };

    THIS.GetValueCombobox = function(combobox) {
        combobox = $(combobox);
        if (combobox.is("select") === false) return null;

        if (combobox.length == 0) return null;

        return $(combobox)[0].value;

        //temporary remove below
        var selected = combobox.find("option:selected");

        if (selected.length == 0) return null;

        return selected.attr("value");
    };

    THIS.SetTextCombobox = function(combobox, text) {
        combobox = $(combobox);
        if (combobox.is("select") === false) return;

        var isFound = false;
        $.each(combobox.find("option"), function(index, item_value) {
            if ($(item_value).text() == text) {
                combobox.val($(item_value).attr("value"));
                isFound = true;
            }
        });

        return isFound;
    };

    THIS.GetTextCombobox = function(combobox) {
        combobox = $(combobox);
        if (combobox.is("select") === false) return null;

        return combobox.find("option:selected").text();
    };

    /*-- END SELECT --*/

    THIS.GetTextFromTemplate = function(data, template, separator) {
        /*-- text =
         blabla${column_name1}blabla__
         blabla${column_name2}blabla__
         blabla${column_name1}blabla__
         blabla${column_name3}blabla__
         --*/

        /*--
         data: row or list of row
         template: text with format as above
         separator: only use when data is a list, if not set, it will be empty string
         --*/

        var GetTextFromTemplate_Single = function(row) {
            var START_PATENT = "${";
            var END_PATENT = "}";
            var strReturn = "";
            var strItem = "";
            var strItemReturn = "";

            //each
            var found = true;
            var index1 = 0;
            var index2 = 0;
            var index_start = 0;
            var index_end = 0;
            var column_name = "";
            var index_start_search = 0;
            strItem = template;
            strItemReturn = "";

            while (true) {
                //look for ${
                index1 = strItem.indexOf(START_PATENT);
                if (index1 < 0) {
                    found = false;
                    break;
                }
                index_start = index1 + START_PATENT.length;
                index2 = strItem.substr(index_start).indexOf(END_PATENT);
                if (index2 < 0) {
                    found = false;
                    break;
                }
                index2 += index_start;

                index_end = index2 - 1;

                column_name = strItem.substr(index_start, index_end - index_start + 1);

                //replace column_name = data["column_name"]
                strItemReturn +=
                    strItem.substr(0, index1)
                    + ((typeof (row[column_name]) !== typeof (undefined)) ? row[column_name].toString() : "##" + column_name + "_WRONG_COLUMN_NAME##");
                strItem = strItem.substr(index2 + END_PATENT.length);
            }
            //END each

            strItemReturn += strItem;

            return strItemReturn;
        };

        var GetTextFromTemplate_List = function(list) {
            var text = "";
            $.each(list, function(index, row) {
                text += GetTextFromTemplate_Single(row) + separator;
            });

            text = text.substr(0, text.length - separator.length);

            return text;
        };

        if (typeof (separator) === "undefined") {
            separator = "";
        }

        if ($.isArray(data) === false) {
            return GetTextFromTemplate_Single(data);
        }
        else {
            return GetTextFromTemplate_List(data);
        }
    };

    //this function is the same with GetTextFromTemplate, but return the list of array instead of the text
    THIS.GetListFromTemplate = function(data, template, separator) {

        var ListSeparator = "/*---PIANOMARVEL-LIST-SEARATOR---*/";
        if (typeof (separator) === "undefined") {
            separator = "";
        }

        separator += ListSeparator;
        var fullText = THIS.GetTextFromTemplate(data, template, separator);

        var list = fullText.split(ListSeparator);
        return list;
    };

    THIS.ShowYoutubeVideoWithCode = function(code, title, width, height) {
        //code is look like: UqVv5opcesg
        //code is look like with time: UqVv5opcesg#t=30

        //this is to open on iPad app
        if (Context.isiPad) {
            window.open("http://www.youtube.com/watch?v=${youtube_url}".ReplaceAll("${youtube_url}", code));
            return;
        }

        //this is to fix the relate tag (dont know how but this causes an error
        code = code.ReplaceAll("&feature=related", "");
        code = code.ReplaceAll("&feature=em-upload_owner", "");

        var start_time = "";

        var arrCodeAndTime = code.split("#t=");

        if (arrCodeAndTime.length == 1) {
            start_time = "";
        }
        else {
            start_time = "&start=" + arrCodeAndTime[1];
            code = arrCodeAndTime[0];
        }

        //do not show the related videos for Japanese pages
        var showRelatedVideos = '';
        var showinfo = '';
        //Change: do not hide the title on the youtube but on the nav bar
        /*--
         if (PMHelper.isInJapaneseMode() == true) {
         showRelatedVideos = '&rel=0';
         showinfo = '&showinfo=0';
         }
         --*/

        //change:also apply this to US page
        if (PMHelper.isInJapaneseMode() == true) {
            showRelatedVideos = '&rel=0';
        }
        showRelatedVideos = '&rel=0';

        var embed_link = '<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${code}?autoplay=1${start_time}${showRelatedVideos}${showinfo}" frameborder="0" allowfullscreen></iframe>';
        //default width = 640, height = 480;
        if (typeof (width) === "undefined") width = 640;
        if (typeof (height) === "undefined") height = 480;
        embed_link = embed_link.ReplaceAll("${width}", width);
        embed_link = embed_link.ReplaceAll("${height}", height);
        embed_link = embed_link.ReplaceAll("${code}", code);
        embed_link = embed_link.ReplaceAll("${start_time}", start_time);
        embed_link = embed_link.ReplaceAll("${showRelatedVideos}", showRelatedVideos);
        embed_link = embed_link.ReplaceAll("${showinfo}", showinfo);
        THIS.ShowYoutubeVideo(embed_link, title);
    };

    THIS.ShowYoutubeVideo = function(embed_link, title) {
        if (typeof (title) === typeof (undefined)) {
            title = "Youtube Video";
        }

        //change: with Japanese, hide this title
        if (PMHelper.isInJapaneseMode()) {
            title = '';
        }

        var size = THIS.GetYoutubeEmbedSize(embed_link);
        PMCommonFunction.CreateRandomTag("body").load("SharedResources/Controls/PM/Common/ContentDialog_W8.htm",
            function() {
                var container = $(this);
                new ContentDialog(
                    {
                        Title: title,
                        Height: size.Height + 45,
                        Width: size.Width + 10,
                        ElementContent: embed_link,
                        RemoveParent: true,
                        ClickOutToClose: true,
                        Function_Close: function() {
                        }
                    },
                    function(dialog) {
                    });
            });
    };

    THIS.GetYoutubeEmbedSize = function(embed_link) {
        //embed_link = '<iframe width="640" height="480" src="//www.youtube.com/embed/UqVv5opcesg?autoplay=1" frameborder="0" allowfullscreen></iframe>';

        var width_start = 0;
        var width_end = 0;
        var width = 0;

        if (embed_link.toLowerCase().indexOf('width="') >= 0) {
            width_start = embed_link.toLowerCase().indexOf('width="') + ('width="').length;

            width_end = embed_link.toLowerCase().indexOf('"', width_start);
            width = embed_link.substr(width_start, width_end - width_start);
        }
        else {
            width_start = embed_link.toLowerCase().indexOf('width=') + ('width=').length;
            width_end = embed_link.toLowerCase().indexOf(' ', width_start);
            width = embed_link.substr(width_start, width_end - width_start);
        }

        var height_start = 0;
        var height_end = 0;
        var height = 0;

        if (embed_link.toLowerCase().indexOf('height="') >= 0) {
            height_start = embed_link.toLowerCase().indexOf('height="') + ('height="').length;

            height_end = embed_link.toLowerCase().indexOf('"', height_start);
            height = embed_link.substr(height_start, height_end - height_start);
        }
        else {
            height_start = embed_link.toLowerCase().indexOf('height=') + ('height=').length;
            height_end = embed_link.toLowerCase().indexOf(' ', height_start);
            height = embed_link.substr(height_start, height_end - height_start);
        }

        width = parseInt(width, 10);
        height = parseInt(height, 10);
        return {Width: width, Height: height};
    };

    THIS.SetWindowForControlClass = function(_THIS, options) {
        //get the container (parent) and window first
        if (typeof (options) === "object") {
            //check properties
            if (typeof (options.Container) !== typeof (undefined)) {
                _THIS.Options.Container = options.Container;
            }
            else {
                _THIS.Options.Container = "";
            }
        }
        else {
            _THIS.Options.Container = "";
        }

        if (_THIS.Options.Container !== "") {
            if ($(_THIS.Options.Container).length > 0) {
                _THIS.ParentWindow = $(_THIS.Options.Container);
                _THIS.Window = $(_THIS.WindowId, _THIS.ParentWindow);
            }
            else {
                _THIS.Window = $(_THIS.WindowId);
                _THIS.ParentWindow = _THIS.Window.parent();
            }
        }
        else {
            _THIS.Window = $(_THIS.WindowId);
            _THIS.ParentWindow = _THIS.Window.parent();
        }
    };

    THIS.generateUUID = function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };

    THIS.GetQueryItemsFromUrl = function() {
        var href = window.location.href;
        var parameter = href.split("?");
        if (parameter.length == 1) return {};

        var parameters = parameter[1].split("&");
        var queryItems = [];
        $.each(parameters, function(index, parameter) {
            var itemValue = parameter.split("=");

            if (itemValue.length == 0) return;

            if (itemValue.length == 1) {
                queryItems.push({queryString: itemValue[0]});
                return;
            }

            //currently, the parameter value has not '='
            if (itemValue.length > 1) {
                var queryString = itemValue[0];
                var value = decodeURIComponent(itemValue[1]);
                queryItems.push({queryString: queryString, value: value});

            }
        });

        return queryItems;
    };

    THIS.GetQueryItem = function(queries, key) {
        if (typeof (queries) === "undefined") return "";

        //queries = [{queryString,value}]
        var returnValue = "";
        $.each(queries, function(index, item) {
            if (item.queryString.toLowerCase() === key.toLowerCase()) {
                returnValue = item.value;
                return false;
            }
        });

        return returnValue;
    };

    THIS.CheckExistsKeyInQueryString = function(list, key) {
        var found = false;
        $.each(list, function(index, item) {
            if (item.queryString.toLowerCase() === key.toLowerCase()) {
                found = true;
                return false;
            }
        });

        return found;
    };

    THIS.IsInputNotFilledYet = function(input) {
        var input = $(input);
        if (input.is("input") === false) return false;

        return input.is(".FieldInput_IsNotFilledYet");
    };

    THIS.ChangeInputToFilledYet = function(input) {
        var input = $(input);
        if (input.is("input") === false) return;

        if (THIS.IsInputNotFilledYet(input) === false) return;
        input.removeClass("FieldInput_IsNotFilledYet");
    };

    THIS.ChangeInputToNotFilledYet = function(input) {
        var input = $(input);
        if (input.is("input") === false) return;

        if (THIS.IsInputNotFilledYet(input) === true) return;
        input.addClass("FieldInput_IsNotFilledYet");
    };

    THIS.IsRightMouseClicked = function(event) {
        var rightclick;
        if (!event) var event = window.event;
        if (event.which) rightclick = (event.which == 3);
        else if (event.button) rightclick = (event.button == 2);

        return rightclick;
    };

    //this function is to find the maxzindex, z-index can be negative
    THIS.FindMaxZindex = function(container) {
        if (typeof (container) === UNDEFINED) container = $("body");

        var maxZindex = -Number.MAX_VALUE;
        $.each($(container).children(), function(index, element) {
            var zindex = $(element).css("z-index");
            zindex = parseInt(zindex);
            if (zindex > maxZindex) {
                maxZindex = zindex;
            }
        });

        if (maxZindex < 0) maxZindex = 0;
        return maxZindex;
    }

    //this function is to find the maxzindex, z-index can be negative
    THIS.setZindexForDialogParent = function(parentWindow) {
        var newZindex = PMCommonFunction.FindMaxZindex() + 1;
        parentWindow.css({"z-index": newZindex});
    }

    THIS.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    THIS.describeArc = function(x, y, radius, startAngle, endAngle){

        var start = THIS.polarToCartesian(x, y, radius, endAngle);
        var end = THIS.polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");

        return d;
    }
}

/* -- Assign for common use --*/
PMCommonFunction = new CommonFunction();
/* -- END Assign for common use --*/
//Special show & close modal methods For pastoral management / Classlit /
/* Show window in modal */
function ShowWinDowModal(windowID, BackGroundID) {
    var currentStyle = $(BackGroundID).attr("style");
    if (currentStyle == undefined)
        currentStyle = "";
    else
        currentStyle = currentStyle.replace("display: none;", "");
    //$('body').css("overflow", "hidden");
    if (PM.Config.IS_MOBILE) {
        $(BackGroundID).attr("style", currentStyle + "display: block; width: " + $('body').width() + "px; height: " + windowHeight + "px; z-index: 1000;");
        SetWindowCenter(BackGroundID);
    } else {
        $(BackGroundID).attr("style", currentStyle + "display: block; width: 100%; height: 100%; z-index: 1000; position: fixed; top: 0; left: 0;");
    }
    //$('body').css("overflow", "auto");
    //$("#mnutabDetermit").addClass("modal-background");
    $("#mnutabDetermit").css("z-index", "0");

    //$(BackGroundID).attr("style", $(BackGroundID).attr("style") == undefined ? "" : $(BackGroundID).attr("style") + " z-index: 1000;");
    //DHSon add to set max z-Index for popup window
    PMHelper.SetZindexBackGround(windowID, "modal-background");
    PMHelper.SetZindexPopup(windowID);
    SetWindowCenter(windowID);
}

function CloseModalWindow(BackGroundID) {
    $(BackGroundID).css("display", "none");
    PMHelper.MaxzIndex = parseFloat(PMHelper.MaxzIndex) - 2;
    //$("#mnutabDetermit").removeClass("modal-background");
    $("#mnutabDetermit").css("z-index", "1");
}

function getHtmlNewLines(text) {
    text = encodeURIComponent(text);
    var regexp = /%0A/g;
    text = text.replace(regexp, '<br>');
    text = decodeURIComponent(text);
    return text;
}
