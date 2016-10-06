DC = DC || {};
DC.Data = DC.Data || {};
DC.Data.Menu = {
    /*-- UserListClasses --*/
    GetUserByGroupCode: function (groupData, callback) {
        //groupData = {groupCode (string)}
        var request = new RequestMessage();
        request.methodName = 'GetUserByGroupCode';
        request.data = {};

        DC.Data.Common.tcpRequest(
            request,
            function (data) {
                if (typeof (callback) === "function") {
                    callback(data);
                }
            },
            function (data) {
                console.log("Error in request:" + "UserListClasses");
            }
        );
    },
};


//simulator
if (DC.Config.SIMULATOR) {
    DC.Data.Menu.GetUserByGroupCode = function(groupData,callback) {
        var result = {};
        var data = result.data = [];

        for (var i = 0; i <= 10; i++) {
            data.push({id: i, username: "User " + i});
        }

        setTimeout(function() {
            callback(result);
        }, 500);

    };
}

