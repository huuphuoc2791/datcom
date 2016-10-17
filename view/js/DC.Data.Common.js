var DC = DC || {};

DC.Data = {
    Common: {
        LOCAL_NO_OPERATOR: "No operation",
        endPoint: "/basic", // /basic
        userName: "",
        passWord: "",
        clientID: "",
        serverEndPoint: "",
        localWebSocketURL: DC.Config.LOCALSOCKET_URL,
        pendingProcessCount: 0,
        isDebug: true,
        Error: "",
        Protocol: "tcp", // http, tcp
        interval: 600000,

        processResponseData: function(message, data, callback, callbackError) {
            var msg;
            callback(data);
        },
        httpRequest: function(message, callbackSuccess, callbackError, runBackGround, url) {

            if(typeof (url) == UNDEFINED) url = DC.Config.HTTP_URL;
            if (typeof (runBackGround) == UNDEFINED) runBackGround = false;
            var countRetry = 0;
            var maxRetry = 3;
            var defaultTimeout = 10000;
            if (!runBackGround) {
                DC.Data.Common.internalProcessStart();
            }

            $.support.cors = true;
            var me = this;

            var ajaxCalling = function(index) {
                $.ajax({
                    type: "POST",
                    url: url + "?method=" + message.methodName,
                    data: JSON.stringify(message),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(transport) {
                        var data = transport || {};
                        if (typeof(data.data) === UNDEFINED) {
                            data.data = {};
                        }

                        data.methodName = message.methodName;
                        DC.Data.Common.internalProcessEnd(data);

                        DC.Data.Common.processResponseData(message, data, callbackSuccess, callbackError);
                    },
                    error: function(transport, textStatus, errorThrown) {

                        if (countRetry < maxRetry && textStatus == "timeout") {
                            countRetry++;
                            ajaxCalling(countRetry + 1);
                        }
                        else {
                            DC.Data.Common.internalProcessEnd(transport);
                            callbackError(transport);
                        }
                    },
                    crossDomain: true,
                    beforeSend: function(req) {
                        req.setRequestHeader('Access-Control-Allow-Origin', "*");
                        req.setRequestHeader('Access-Control-Allow-Origin', "*");
                        req.setRequestHeader('Access-Control-Allow-Headers', "x-requested-with, x-requested-by");
                    }
                });
            };
            ajaxCalling(0);
        },


        processStart: function() {
            $("#processing_containter").css("display", "block");
        },

        processEnd: function() {
            $("#processing_containter").css("display", "none");
        },

        internalProcessStart: function() {
            if (DC.Data.Common.pendingProcessCount < 0) {
                DC.Data.Common.pendingProcessCount = 0;
            }
            DC.Data.Common.pendingProcessCount += 1;
            if (DC.Data.Common.processStart && DC.Data.Common.pendingProcessCount <= 1) {
                DC.Data.Common.processStart();
            }
        },

        internalProcessEnd: function(transport) {
            DC.Data.Common.pendingProcessCount -= 1;
            if (DC.Data.Common.processEnd && DC.Data.Common.pendingProcessCount <= 0) {
                DC.Data.Common.processEnd(transport);
                if (DC.Data.Common.Error != "") {
                    if (DC.Data.Common.isDebug == false) {
                        alert(DC.Data.Common.Error);
                    }
                    DC.Data.Common.Error = "";
                }
            }
        },

        fromJSONDate: function(dateString) {
            //http://codeasp.net/blogs/raghav_khunger/microsoft-net/1105/convert-json-date-to-javascript-date
            //var substringedDate = dateString.substring(6); //substringedDate= 1291548407008)/
            //var parsedIntDate = parseInt(substringedDate); //parsedIntDate= 1291548407008
            //return new Date(parsedIntDate);  // parsedIntDate passed to date constructor
            //http://sudarshanbhalerao.wordpress.com/2011/08/14/convert-json-date-into-javascript-date/

            var offset = new Date().getTimezoneOffset() * 60000;
            var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(dateString);

            if (parts[2] == undefined)
                parts[2] = 0;

            if (parts[3] == undefined)
                parts[3] = 0;

            return new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);

        },

        toJSONDate: function(dateObject) {
            return '\/Date(' + dateObject.getTime() + (dateObject.getTimezoneOffset() * 60000) + ')\/';
        },

        toSerialDate: function(dateObject) {
            //'yyyy,MM,dd'
            if (dateObject != null && dateObject != '') {
                return dateObject.getFullYear() + ',' + (dateObject.getMonth() + 1) + ',' + dateObject.getDate();
            }
            else {
                return '';
            }
        }
        ,
        toSerialTime: function(dateObject) //locdd - Part the object to string: "yyyy,M,d,HH,mm,ss"
        {
            //'yyyy,MM,dd,HH,mm,ss'
            if (dateObject != null && dateObject != '') {
                return DC.Data.Common.toSerialDate(dateObject) + ',' + dateObject.getHours() + ',' + (dateObject.getMinutes()) + ',' + dateObject.getSeconds();
            }
            else {
                return '';
            }
        },
    }
};