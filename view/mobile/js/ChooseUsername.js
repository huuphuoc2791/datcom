var DC = DC || {};
DC.ChooseUsername = function(options, callback) {
    var THIS = this;

    THIS.Buttons = {};
    THIS.Elements = {};

    THIS.Functions = {};
    THIS.Functions.Initialize = function() {
        //options
        if (typeof (options.userSelected) == 'function') {
            THIS.Events.userSelected = options.userSelected;
        }
        //event


        //fill data
        //get user list from server. So far, use the function get menu
        DC.Data.Menu.GetUsersByGroupCode({groupCode: Context.Group.code}, function(result) {
            if (result.data.code == 0) {
                THIS.Users = result.data.users;
                Context.Users = THIS.Users;
                var template = $("#chooseUsername_user_template").html();
                console.log(THIS.Users);

                var itemString = '';

                $.each(THIS.Users, function(index, user) {
                    itemString = template.ReplaceAll('${username}',user.username).ReplaceAll('${fullname}',user.fullname);

                    $(".chooseUsername .chooseUsername_userList tbody").append(itemString);

                    //change
                    $(".chooseUsername").append(itemString);
                });

                //add event for username click here
                $(".chooseUsername tr.chooseUsername_user_item_wrapper").on('click',THIS.Events.UserRow_Click);

                $(".chooseUsername_userItem_wrapper").on('click',THIS.Events.UserRow_Click);
            }
            else if (result.data.code == 1) {
                //has no group (show the message if groupCode has data
            }
            PMCommonFunction.RunCallback(callback, THIS);
        });
    };



    THIS.Events = {};
    THIS.Events.userSelected = function(user) {
        //this function will be overriden
    };


    THIS.Events.UserRow_Click = function(event) {
        var row = $(this);

        var username = row.attr('user_name');
        var fullname = '';

        var user = {
            username:username,
            fullname:fullname,
        };

        //fire the event
        PMCommonFunction.RunCallback(THIS.Events.userSelected, user);
    };

    THIS.Functions.Initialize();
};
