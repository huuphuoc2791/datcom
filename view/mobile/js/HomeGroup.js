var DC = DC || {};
DC.HomeGroup = function(options, callback) {
    var THIS = this;

    THIS.Buttons = {};
    THIS.Elements = {};

    THIS.Functions = {};
    THIS.Functions.Initialize = function() {
        THIS.Elements.GroupName = $(".homeGroup_GroupName");
        THIS.Elements.Username = $(".homeGroup_Username");
        THIS.Elements.ChooseUsername = $(".homeGroup_ChooseUsername");
        THIS.Elements.ChooseFoods = $(".homeGroup_ChooseFoods");
        THIS.Buttons.Logout = $(".homeGroup_Logout");

        //event
        THIS.Buttons.Logout.on('click', THIS.Events.logout_Click);

        //fill data
        THIS.Elements.GroupName.html(Context.Group.name);

        //load menu (even if the user is not logged)
        THIS.Functions.loadChooseUsername(function() {
            THIS.Functions.loadMenu(function() {
                //check if has username or not, if not, show the list user or menu to choose
                THIS.Functions.checkAndShowMenuOrUsers();
                PMCommonFunction.RunCallback(callback, THIS);

            })
        })
    };

    THIS.Functions.loadMenu = function(callback) {
        THIS.Elements.ChooseFoods.load(Context.MOBILE_URL + "chooseFoods.html", function() {
            new DC.ChooseFoods({
                menuSelected: THIS.Events.menuSelected
            }, function(chooseFoods) {
                console.log(chooseFoods);
                THIS.DsMonAn = chooseFoods.DsMonAn;

                // THIS.DsMonAn = chooseUsername.Users;
                PMCommonFunction.RunCallback(callback);
            });
        });
    };

    THIS.Functions.loadChooseUsername = function(callback) {
        THIS.Elements.ChooseUsername.load(Context.MOBILE_URL + "chooseUsername.html", function() {
            new DC.ChooseUsername({
                userSelected: THIS.Events.userSelected
            }, function(chooseUsername) {
                console.log(chooseUsername);

                THIS.Users = chooseUsername.Users;
                PMCommonFunction.RunCallback(callback);
            });
        });
    };

    //support for all menu from server and ordered menu
    THIS.Functions.setClassForOrderedMenu = function(menuItems) {
        //clear checkbox
        $("input[type=checkbox]").removeAttr('checked');

        //clear mainmenu, sub menu
        $(".isMainMenuItem").removeClass("isMainMenuItem");
        $(".isSubMenuItem").removeClass("isSubMenuItem");
        $.each(menuItems, function(index, menuItem) {
            var id = menuItem.menu_id;
            if (typeof (id) == UNDEFINED) id = menuItem.item.id;
            var menuRow = THIS.Functions.getMenuRowByMenuId(id);
            var checkbox = $("input[type=checkbox]",menuRow);
            var isMainMenu = menuItem.extra_food == '0' || menuItem.isMainItem == true;
            THIS.Functions.setCheckForCheckbox(checkbox);
            if (isMainMenu) {
                menuRow.addClass("isMainMenuItem");
            }
            else {
                menuRow.addClass("isSubMenuItem");
            }
        });
    };

    //login:
    //1. load user data
    //2. set for the menu
    THIS.Functions.login = function(user, callback) {
        console.log('User logins to the system', user);
        localStorage.username = user.username;
        var username = user.username;
        Context.Username = user.username;

        THIS.Elements.Username.html('Tài khoản: ' + user.username);

        //load user data
        DC.Data.Menu.GetUsersByGroupCode({groupCode: Context.Group.code}, function(result) {
            if (result.data.code == 0) {
                THIS.Users = result.data.users;
                Context.Users = THIS.Users;

                var foundUser = Context.Users.filter(function(user) {
                    return user.username == username
                });
                if (foundUser.length>0) {
                    Context.User = foundUser[0];
                    THIS.User = foundUser[0];
                }

                console.log(Context.User);

                THIS.Functions.setClassForOrderedMenu(THIS.User.menuItems);

                //show the menu and hide the user list
                THIS.Functions.showMenu(true);
                THIS.Functions.showUsers(false);
            }
        });
    };


    THIS.Functions.setCheckForCheckbox = function(checkbox, checked) {
        if (typeof (checked) == UNDEFINED) checked = true;

        if (checked) {
            $(checkbox).attr('checked','checked');
            if ($(checkbox).length > 0) {
                $(checkbox)[0].checked = true;
            }
        }
        else {
            $(checkbox).removeAttr('checked','checked');
            if ($(checkbox).length > 0) {
                $(checkbox)[0].checked = false;
            }
        }
    };
    THIS.Functions.getMenuRowByMenuId = function(menuId) {
        return $("tr.chooseFoods_menuItem_wrapper[menu_id=" + menuId + "]");
    };

    THIS.Functions.logout = function() {
        console.log('User out to the system');
        localStorage.username = '';
        Context.Username = '';
        THIS.Elements.Username.html('');

        //show the user and hide the menu list
        THIS.Functions.showMenu(false);
        THIS.Functions.showUsers(true);
    };

    THIS.Functions.showMenu = function(show) {
        if (typeof (show) == UNDEFINED) show = true;

        if (show) {
            THIS.Elements.ChooseFoods.removeClass('hidden');
        }
        else {
            THIS.Elements.ChooseFoods.addClass('hidden');
        }
    };
    THIS.Functions.showUsers = function(show) {
        if (typeof (show) == UNDEFINED) show = true;

        if (show) {
            THIS.Elements.ChooseUsername.removeClass('hidden');
            THIS.Buttons.Logout.addClass('hidden');
        }
        else {
            THIS.Elements.ChooseUsername.addClass('hidden');
            THIS.Buttons.Logout.removeClass('hidden');
        }
    };

    THIS.Functions.checkAndShowMenuOrUsers = function() {
        if (typeof (localStorage.username) == UNDEFINED) localStorage.username = '';
        var username = localStorage.username;
        if (username == '') {
            THIS.Functions.showUsers();
            THIS.Functions.showMenu(false);
        }
        else {
            THIS.Functions.login({username: username}); //this function also set the show hide data
        }
    };

    THIS.Functions.getCheckboxByMenuId = function(menuId) {
        var menuRow = THIS.Functions.getMenuRowByMenuId(menuId);
        if (menuRow.length == 0) return $("");

        return $("input[type=checkbox]",menuRow);
    };

    THIS.Functions.getMenuItemByMenuRow = function(menuRow) {
        var menuId = parseInt($(menuRow).attr('menu_id'));

        return Context.DsMonAn.filter(function(item) {
            return item.id == menuId;
        })[0];
    };

    THIS.Functions.getOrderedItemsForUser = function () {
        //get all the checked
        var checkedItems = $("input[type=checkbox]:checked");

        var orderedItems = [];
        //travel all the checked, get the menu then return
        $.each(checkedItems, function(index, checkedItem) {
            var currentItem = {};
            var currentMenuItemRow = $(checkedItem).parents('tr[menu_id]');
            currentItem.item = THIS.Functions.getMenuItemByMenuRow($(currentMenuItemRow));

            var isMainMenu = $(currentMenuItemRow).is(".isMainMenuItem");
            currentItem.isMainItem = isMainMenu;

            orderedItems.push(currentItem);
        });

        //check if there is main menu or not, if not, the first is the main
        var hasMainMenu = false;
        $.each(orderedItems,function(index,orderedItem) {
            if (orderedItem.isMainItem) {
                hasMainMenu = true;
                return false;
            }
        });

        if (!hasMainMenu && orderedItems.length >0) {
            orderedItems[0].isMainItem = true;
        }


        THIS.Functions.setClassForOrderedMenu(orderedItems);
        return orderedItems;
    }

    THIS.Events = {};

    THIS.Events.userSelected = function(user) {
        //call the method to login this user
        THIS.Functions.login(user);
    };

    THIS.Events.menuSelected = function(menu) {
        //call the method to login this user

        var menuRow = THIS.Functions.getMenuRowByMenuId(menu.menuId);
        if (menuRow.length == 0) return;
        var checkbox = THIS.Functions.getCheckboxByMenuId(menu.menuId);
        if (checkbox.length == 0) return;


        //do not check the checkbox automatically, the menu does
        // var newChecked = !(checkbox.is(":checked"));
        // THIS.Functions.setCheckForCheckbox(checkbox,newChecked);

        var newOrderedItems = THIS.Functions.getOrderedItemsForUser();

        $.each(newOrderedItems, function(index, newOrderedItem) {
            newOrderedItem.isMainItem = newOrderedItem.isMainItem == 1;
            newOrderedItem.menuId = newOrderedItem.item.id;
            newOrderedItem.item = undefined;
        });

        console.log(newOrderedItems);

        //update all the menuItems for this username
        DC.Data.Menu.OrderForUser({
            groupCode: Context.Group.code, //not use
            username: Context.User.username, // not use
            userId: Context.User.id,
            menuItems: newOrderedItems
        }, function(result) {
        });

    };

    THIS.Events.logout_Click = function(event) {
        THIS.Functions.logout();
    };


    THIS.Functions.Initialize();
};
