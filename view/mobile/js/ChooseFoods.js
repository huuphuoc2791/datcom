var DC = DC || {};
DC.ChooseFoods = function(options, callback) {
    var THIS = this;

    THIS.Buttons = {};
    THIS.Elements = {};

    THIS.Functions = {};
    THIS.Functions.Initialize = function() {
        //options
        if (typeof (options.menuSelected) == 'function') {
            THIS.Events.menuSelected = options.menuSelected;
        }

        //event


        //fill data

        DC.Data.Menu.UpdateMenuByDate({
            menuDate: new Date(),
        }, function(result) {
            if (result.data.code == 0) {
                THIS.DsMonAn = result.data.menuItems;
                Context.DsMonAn = THIS.DsMonAn;
                var template = $("#chooseFoods_menuItem_template").html();
                var itemString = '';

                console.log(template);
                $.each(THIS.DsMonAn, function(index, monan) {
                    itemString = template;

                    itemString = itemString.replace('${menuId}', monan.id);
                    itemString = itemString.replace('${monan}', monan.menuName);
                    itemString = itemString.replace('${gia}', monan.price.FormatNumber(0));
                    $(".chooseFoods .chooseFoods_menuList tbody").append(itemString);
                });

                //add event for username click here
                $(".chooseFoods tr.chooseFoods_menuItem_wrapper").off('click').on('click',THIS.Events.FoodRow_Click);
                $(".chooseFoods tr.chooseFoods_menuItem_wrapper input[type=checkbox].userCheckOrder").off('click').on('click',THIS.Events.FoodCheck_Click);

            }
            else if (result.data.code == 1) {
                //has no group (show the message if groupCode has data
            }
            PMCommonFunction.RunCallback(callback, THIS);
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


    THIS.Events = {};
    THIS.Events.FoodRow_Click = function(event) {
        if ($(event.target).is("input[type=checkbox]") === true) return;

        console.log('FoodRow_Click');
        var menuItem = $(this);

        var menu = {
            menuId:$(menuItem).attr('menu_id')
        };

        //check the checkbox
        var checkbox = $("input[type=checkbox]",menuItem);

        var newChecked = !(checkbox.is(":checked"));
        THIS.Functions.setCheckForCheckbox(checkbox,newChecked);

        PMCommonFunction.RunCallback(THIS.Events.menuSelected, menu);
    };

    THIS.Events.FoodCheck_Click = function(event) {
        console.log('FoodCheck_Click');

        var checkbox = $(this);
        var menuItem = checkbox.parents("tr[menu_id]");

        var menu = {
            menuId:$(menuItem).attr('menu_id')
        };

        PMCommonFunction.RunCallback(THIS.Events.menuSelected, menu);
    };

    THIS.Functions.Initialize();
};
