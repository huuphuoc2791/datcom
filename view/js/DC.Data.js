DC = DC || {};
DC.Data = DC.Data || {};
DC.Data.Menu = {
    /*-- GetUsersByGroupCode --*/
    GetUsersByGroupCode: function(groupData, callback) {
        //groupData = {groupCode (string)}
        var request = new RequestMessage();
        request.methodName = 'GetUsersByGroupCode';
        request.data = groupData;

        DC.Data.Common.httpRequest(
            request,
            function(data) {
                if (typeof (callback) === "function") {
                    callback(data);
                }
            },
            function(data) {
                console.log("Error in request:" + "UserListClasses");
            }
        );
    },

    /*-- UpdateMenuByDate --*/
    UpdateMenuByDate: function(menuData, callback) {
        //menuData = {menuDate,menuItems ([menu:{menuName}])}
        var request = new RequestMessage();
        request.methodName = 'UpdateMenuByDate';
        request.data = menuData;

        DC.Data.Common.httpRequest(
            request,
            function(data) {

                if (typeof (data) != UNDEFINED) {
                    if (typeof (data.data) != UNDEFINED) {
                        if (typeof (data.data.menuItems) != UNDEFINED && data.data.menuItems != null) {
                            $.each(data.data.menuItems, function(index,menuItem) {
                                menuItem.menuName = menuItem.food_name;
                                menuItem.price = parseFloat(menuItem.price);
                                menuItem.extra_price = parseFloat(menuItem.extra_price);
                                menuItem.extra_price = parseFloat(menuItem.extra_price);
                            });
                        }
                    }
                }

                if (typeof (callback) === "function") {
                    callback(data);
                }
            },
            function(data) {
                console.log("Error in request:" + "UpdateMenuByDate");
            }
        );
    },

    /*-- OrderForUser --*/
    OrderForUser: function(orderData, callback) {
        //orderData = {userId, menuItems}
        var request = new RequestMessage();
        request.methodName = 'OrderForUser';
        request.data = orderData;

        DC.Data.Common.httpRequest(
            request,
            function(data) {
                if (typeof (callback) === "function") {
                    callback(data);
                }
            },
            function(data) {
                console.log("Error in request:" + "OrderForUser");
            }
        );
    },
    /*-- RemoveOrderForUser --*/
    RemoveOrderForUser: function(orderData, callback) {
        //menuData = {groupCode, username, menuId}
        var request = new RequestMessage();
        request.methodName = 'RemoveOrderForUser';
        request.data = orderData;

        DC.Data.Common.httpRequest(
            request,
            function(data) {
                if (typeof (callback) === "function") {
                    callback(data);
                }
            },
            function(data) {
                console.log("Error in request:" + "RemoveOrderForUser");
            }
        );
    },
};

DC.Data.Menu.GetUsersByGroupCode1 = function(groupData, callback) {
    //groupData = {groupCode}
    var result = {};
    var data = result.data = {code: 0, message: "Message 1"};

    data.users = [];
    for (var i = 0; i <= 10; i++) {
        data.users.push({id: i, username: "User " + i, fullName: 'Ten ' + i});
    }

    //test for korrin
    if (groupData.groupCode == 'korrin') {
        data.users = [];
        data.users.push({id: 1, username: "son1", fullName: 'Sơn 1'});
        data.users.push({id: 2, username: "son2", fullName: 'Sơn 2'});
        data.users.push({id: 3, username: "tao", fullName: 'Tảo'});
        data.users.push({id: 4, username: "dung", fullName: 'Dũng'});
        data.users.push({id: 5, username: "minh", fullName: 'Minh'});
        data.users.push({id: 6, username: "phuc", fullName: 'Phúc'});
        data.users.push({id: 7, username: "phu", fullName: 'Phú'});
        data.users.push({id: 8, username: "phuoc", fullName: 'Phước'});
        data.users.push({id: 9, username: "han", fullName: 'Hân'});
        data.users.push({id: 10, username: "tauj", fullName: 'Tauj'});
        data.users.push({id: 11, username: "loc", fullName: 'Lộc'});
    }
    setTimeout(function() {
        callback(result);
    }, 500);

};
DC.Data.Menu.UpdateMenuByDate1 = function(menuData, callback) {
    //menuData = {menuDate,menuItems ([menu:{menuName,price}])}
    var result = {};
    var data = result.data = {code: 0, message: "Message 1"};

    data.menuItems = [];
    $.each(menuData.menuItems, function(index, menuItem) {
        data.menuItems.push({id: index, menuName: menuItem.menuName, price: menuItem.price, extra_price:25000});
    });

    setTimeout(function() {
        callback(result);
    }, 500);

};
DC.Data.Menu.OrderForUser1 = function(orderData, callback) {
    //menuData = {groupCode, username, menuItems:[{menuId,isMain}]}
    var result = {};
    var data = result.data = {code: 0, message: "Message 1"};

    setTimeout(function() {
        callback(result);
    }, 500);

};

//simulator
if (DC.Config.SIMULATOR) {
}
