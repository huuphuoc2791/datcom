var dsMonAn = [];
var dsUsers = [];

var groupCode = GROUP_CODE;
var MAIN_ITEM_CLASS = 'menu_detail_item_main';
var SUB_ITEM_CLASS = 'menu_detail_item_sub';
var MAIN_SUB_ITEM_ALL_CLASS = MAIN_ITEM_CLASS + ' ' + SUB_ITEM_CLASS;
var PHONE_NUMBER = '0902702566';
var ADMIN_PHONE_NUMBER = '0907121981';
var Context = Context || {};
//this function is called after some prepare data is already set
var ready = function() {
    //event
    $("input[name=selectGroup]").on('click', function(event) {
        $("form")[0].submit();
    });

    $("#resetOrdered").on('click', resetOrderEvent);
    $("#showSmsPopup").on('click', showSmsPopup_Click);
    $("#confirmPassword_BtnConfirm").on('click', confirmPassword_Click);
    $("#requestGroup_BtnConfirm").on('click', confirmRequestGroup_Click);
    $("button[name=requestGroup]").on('click', requestGroup_Click);


    $("#btnCopyToClipboard").on('mouseout', function() {
        var answer = document.getElementById("btnCopyToClipboard");
        answer.innerHTML = 'Copy';
    });

    $(window).on('keypress', function(event) {
        if (checkConfirmPasswordIsShown()) {
            if (event.which == 13) {
                event.preventDefault();
                confirmPassword_Click(event);
                return false;
            }
        }

        if (checkRequestGroupIsShown()) {
            if (event.which == 13) {
                event.preventDefault();
                confirmRequestGroup_Click(event);
                return false;
            }
        }
    });

    var text = '';
    var monanElements = $(".monan [data-name=thuc-don]");
    $.each(monanElements, function(index, item) {
        var monan1 = $(item).attr('data-title');

        var monan2 = monan1.toLowerCase();
        var monan = monan2.substr(0, 1).toUpperCase() + monan2.substr(1, monan2.length);

        dsMonAn.push({menuName: monan, price: 30000});
    });

    //clear comnhaviet page
    $("#comnhaviet_page").empty();

    //update menu of today
    DC.Data.Menu.UpdateMenuByDate({
        menuDate: new Date(),
        menuItems: dsMonAn
    }, function(result) {
        dsMonAn = result.data.menuItems;
        //create table
        createTableForGroup(function() {
            startAutoSync(5000);
        });
    });

    $('#smsPopup').modal({show: false});

    $('#confirmPasswordPopup').modal({show: false});

    //event to focus the input when the popup is shown
    $('#confirmPasswordPopup').on('shown.bs.modal', function() {
        $("#confirmPassword_Password").focus();
    });

    $('#requestGroupPopup').modal({show: false});
    $('#requestGroupPopup').on('shown.bs.modal', function() {
        $("#requestGroup_GroupCode").focus();
    });
};
$(document).ready(function() {
    checkAndSaveDeviceGuid(ready);
});

function checkConfirmPasswordIsShown() {
    return ($("#confirmPasswordPopup").data('bs.modal') || {isShown: false}).isShown;
}
function checkRequestGroupIsShown() {
    return ($("#requestGroupPopup").data('bs.modal') || {isShown: false}).isShown;
}
//event
//change: call the confirm password
function resetOrderEvent(event) {
    $("#confirmPasswordPopup").modal('show');
}

function requestGroup_Click(event) {
    $("#requestGroupPopup").modal('show');
}

function resetOrderAndRecalculate() {
    //send request to clear by group code
    DC.Data.Menu.ClearAllOderByGroupCode({groupCode: GROUP_CODE}, function(result) {
        if (result.responseCode == 0) {
            //recalculate
            //1. update GUI
            $.each(dsUsers, function(userIndex, user) {
                clearMainAndSubItemByUsername(user.username);
                $("#order_menu .userCheckOrder[type=checkbox]").removeAttr('checked');
            });

            //recalculate the total
            calculateAndFillSummaryOrderedMenuItems();
        }
        else {
            console.log('Error');
        }
    });
}
function confirmRequestGroup_Click(event) {
    var groupCode = $("#requestGroup_GroupCode").val();
    if (groupCode == '') {
        console.log('empty password');
        $("#requestGroupPopup").removeClass('requestGroupPopup_emptyGroup confirmPasswordPopup_existedGroupCode').addClass("requestGroupPopup_emptyGroup");
        return;
    }

    var groupData = {
        groupCode: groupCode
    };

    DC.Data.Group.CheckGroupByGroupCode(groupData, function(result) {
        if (result.data.code == 0) {
            if (result.data.found == false) {
                //generate sms
                $("#requestGroupPopup").removeClass('requestGroupPopup_emptyGroup confirmPasswordPopup_existedGroupCode').addClass('confirmPasswordPopup_validGroupCode');
                var smsMessage = 'Yeu can tao nhom = ' + groupCode;
                getSmsQrCode({phoneNumber: ADMIN_PHONE_NUMBER, message: smsMessage}, function(data) {
                    setImageBase64(data, 'smsQrCode_RequestGroup');
                });

            }
            else {
                //invalid group
                $("#requestGroupPopup").removeClass('requestGroupPopup_emptyGroup confirmPasswordPopup_existedGroupCode').addClass("confirmPasswordPopup_existedGroupCode");
            }
        }
    });
}


function confirmPassword_Click(event) {
    var password = $("#confirmPassword_Password").val();
    if (password == '') {
        console.log('empty password');
        $("#confirmPasswordPopup").removeClass('confirmPasswordPopup_emptyPassword confirmPasswordPopup_invalidPassword').addClass("confirmPasswordPopup_emptyPassword");
        return;
    }

    var groupData = {
        groupCode: GROUP_CODE,
        password: password
    };

    DC.Data.Group.CheckGroupPassword(groupData, function(result) {
        if (result.data.code == 0) {
            if (result.data.passwordMatched) {
                //valid --> reset and close
                $("#confirmPasswordPopup").removeClass('confirmPasswordPopup_emptyPassword confirmPasswordPopup_invalidPassword');

                //clear password
                $("#confirmPassword_Password").val('');

                resetOrderAndRecalculate();

                $("#confirmPasswordPopup").modal('hide');
            }
            else {
                //invalid password
                $("#confirmPasswordPopup").removeClass('confirmPasswordPopup_emptyPassword confirmPasswordPopup_invalidPassword').addClass("confirmPasswordPopup_invalidPassword");
            }
        }
    });
}

function showSmsPopup_Click(event) {
    var orderedItems = getSummarySmsData();
    var sms = '';
    var countTotal = 0;
    var countExtraTotal = 0;

    $.each(orderedItems, function(index, item) {
        var count = item.count;
        if (count > 0) {
            sms += count + ' ' + item.shortFoodName + ', ';
        }
        countTotal = countTotal + count;
    });
    if (countTotal > 0) {
        sms = sms.substr(0, sms.length - 2);
        sms = sms + '. Them: ';
    }
    $.each(orderedItems, function(index, item) {
        var countExtra = item.countExtra;
        if (countExtra > 0) {
            sms += countExtra + ' ' + item.shortFoodName + ', ';
        } else {

        }
        countExtraTotal = countExtraTotal + countExtra;
    });

    if (countExtraTotal == 0) {
        sms = sms.substr(0, sms.length - 6);
    }
    if (countTotal > 0) {
        sms = sms.substr(0, sms.length - 2);
        sms = sms + '. \n';
        sms = sms + 'Tong cong: ' + countTotal + ' phan';

        if (countExtraTotal > 0) {
            sms = sms + ' + ' + countExtraTotal + ' phan them';
        }
        sms = sms + '. Thanks chi!';
    } else {
        sms = 'Bạn chưa chọn món!';
    }
    var smsMessage = sms;
    sms = sms.ReplaceAll('\n', '<br/>');

    //set the text
    $("#sms_content").html(sms);

    //set the qr code with phone number = empty
    if (countTotal > 0) {
        getSmsQrCode({phoneNumber: PHONE_NUMBER, message: smsMessage}, function(data) {
            setImageBase64(data, 'smsQrCode');
        });
        $("#smsQrCode").show();
    } else {
        $("#smsQrCode").hide();
    }
    $('#smsPopup').modal('show');
}

//callback get the base64image
function getSmsQrCode(smsData, callback) {
    //smsData = {phoneNumber,message}
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    // xmlhttp.open("POST", 'http://hosthinh.com/api/smsQrCode/');
    xmlhttp.open("POST", 'http://hosthinh.com/api/qurl_sms');
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xmlhttp.setRequestHeader('Access-Control-Allow-Origin', "*");
    // xmlhttp.setRequestHeader('Access-Control-Allow-Headers', "x-requested-with, x-requested-by");
    xmlhttp.onload = function() {
        callback(xmlhttp);
    };
    // xmlhttp.send('phoneNumber=' + encodeURIComponent(smsData.phoneNumber) + '&message=' + encodeURIComponent(smsData.message));

    // xmlhttp.open("POST", HOST_HINH_API_URL);
    // xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onload = function() {
        PMCommonFunction.RunCallback(callback, xmlhttp.responseText);
    };
    // xmlhttp.send('message=' + encodeURIComponent(url));
    xmlhttp.send('phoneNumber=' + encodeURIComponent(smsData.phoneNumber) + '&message=' + encodeURIComponent(smsData.message));
}

function setImageBase64(base64, qrCodeImage) {
    var img = document.getElementById(qrCodeImage);
    img.src = "data:image/png;base64," + base64;
}

//this is to get the menuItem object via the row of that menu
function getMenuItemByMenuRow(menuRow) {
    var menuId = parseInt($(menuRow).attr('menu_id'));

    return dsMonAn.filter(function(item) {
        return item.id == menuId;
    })[0];
}

function isMainMenuCheckedItem(checkbox) {
    return $(checkbox).is("." + MAIN_ITEM_CLASS);
}
function isSubMenuCheckedItem(checkbox) {
    return $(checkbox).is("." + SUB_ITEM_CLASS);
}

//this function is to get all the item that this user ordered
//return = [{item:{id,menuName,price,extra_price},isMainItem:int}]
//isMainItem = 1: main, 0: sub, -1: not set
function getOrderedItemsByUsername(username) {
    //get all the checked
    var checkedItems = $("[username='" + username + "'] input[type=checkbox]:checked");

    var orderedItems = [];
    //travel all the checked, get the menu then return
    $.each(checkedItems, function(index, checkedItem) {
        var currentItem = {};
        var currentMenuItemRow = $(checkedItem).parents('tr.detail_order_menu[menu_id]');
        currentItem.item = getMenuItemByMenuRow($(currentMenuItemRow));
        if (isMainMenuCheckedItem(checkedItem)) {
            currentItem.isMainItem = 1;
        } else if (isSubMenuCheckedItem(checkedItem)) {
            currentItem.isMainItem = 0;
        }
        else {
            currentItem.isMainItem = -1;
        }

        orderedItems.push(currentItem);
    });

    return orderedItems;
}

function setMainItemByCheckbox(checkbox) {
    $(checkbox).removeClass(MAIN_SUB_ITEM_ALL_CLASS).addClass(MAIN_ITEM_CLASS);
    $(checkbox).parents('td.detail_order_user_item[username]').removeClass('success info').addClass('success');
}
function setSubItemByCheckbox(checkbox) {
    $(checkbox).removeClass(MAIN_SUB_ITEM_ALL_CLASS).addClass(SUB_ITEM_CLASS);
    $(checkbox).parents('td.detail_order_user_item[username]').removeClass('success info').addClass('info');
}
function clearMainAndSubItemByCheckbox(checkbox) {
    $(checkbox).removeClass(MAIN_SUB_ITEM_ALL_CLASS);
    $(checkbox).parents('td.detail_order_user_item[username]').removeClass('success info');
}

function clearMainAndSubItemByUsername(username) {
    //get all the checkbox (no matter if the checkbox is checked or not)
    var checkboxes = $("td[username='" + username + "'] input[type=checkbox]");
    clearMainAndSubItemByCheckbox(checkboxes);
}

function clearMainAndSubItemAndCheckboxByAllUsername(username) {
    //get all the checkbox (no matter if the checkbox is checked or not)
    var checkboxes = $("td[username] input[type=checkbox]");
    checkboxes.removeAttr('checked');

    //make sure the checkbox is off
    $.each(checkboxes, function(index, checkbox) {
        checkbox.checked = false;
    });

    clearMainAndSubItemByCheckbox(checkboxes);
}

function getCheckboxByMenuIdAndUsername(menuId, username) {
    return $("tr.detail_order_menu[menu_id='" + menuId + "'] td.detail_order_user_item[username='" + username + "'] input[type=checkbox]");
}
function getCheckboxByMenuIdAndUserId(menuId, userId) {
    return $("tr.detail_order_menu[menu_id='" + menuId + "'] td.detail_order_user_item[user_id='" + userId + "'] input[type=checkbox]");
}
function createTableForGroup(callback) {
    createHeaderByGroupCode(function() {
        createDsMonAn(function() {
            //add event
            $(".userCheckOrder").on('change', function(event) {
                var control = $(this);
                var checked = control.is(":checked");
                var username = control.parents('td.detail_order_user_item[username]').attr('username');
                var userId = control.parents('td.detail_order_user_item[username]').attr('user_id');
                var monan = control.parents('tr.detail_order_menu').find('td.table_order_monan').html();
                var menuId = control.parents('tr.detail_order_menu').attr('menu_id');


                //process GUI first

                //if this checkbox is uncheck, clear the status first
                if (checked == false) {
                    clearMainAndSubItemByCheckbox(control);
                }

                //if this user has only one checked --> set this to main and clear all others
                var orderedItems = getOrderedItemsByUsername(username);

                //if nothing checked, clear all
                if (orderedItems.length == 0) {
                    clearMainAndSubItemByUsername(username);
                } else if (orderedItems.length == 1) {
                    //still has only one item --> remove others then add main
                    clearMainAndSubItemByUsername(username);

                    var mainCheckedBox = $("tr.detail_order_menu[menu_id] td[username='" + username + "'] input[type=checkbox]:checked");

                    setMainItemByCheckbox(mainCheckedBox);
                } else {
                    //more than one. if this checkbox is checked. this is the sub item
                    if (checked) {
                        setSubItemByCheckbox(control);
                    }
                    else {
                        //this checkbox is unchecked. if no main item, recalculate
                        if (orderedItems.filter(function(orderedItem) {
                                return orderedItem.isMainItem == 1
                            }).length == 0) {
                            //set the first = main, others = sub
                            var firstMenuItem = orderedItems[0].item.id;
                            var firstCheckedBox = getCheckboxByMenuIdAndUsername(orderedItems[0].item.id, username);
                            clearMainAndSubItemByCheckbox(firstCheckedBox);
                            setMainItemByCheckbox(firstCheckedBox);

                            //set others = sub
                            for (var orderedItemIndex = 1; orderedItemIndex < orderedItems.length; orderedItemIndex++) {
                                var subCheckedBox = getCheckboxByMenuIdAndUsername(orderedItems[orderedItemIndex].item.id, username);
                                clearMainAndSubItemByCheckbox(subCheckedBox);
                                setSubItemByCheckbox(subCheckedBox);
                            }

                        }
                        else {
                            //already has main item, do nothing
                        }
                    }
                }

                var newOrderedItems = getOrderedItemsByUsername(username);

                $.each(newOrderedItems, function(index, newOrderedItem) {
                    newOrderedItem.isMainItem = newOrderedItem.isMainItem == 1;
                    newOrderedItem.menuId = newOrderedItem.item.id;
                    newOrderedItem.item = undefined;
                });

                console.log(newOrderedItems);

                //update all the menuItems for this username
                DC.Data.Menu.OrderForUser({
                    groupCode: groupCode, //not use
                    username: username, // not use
                    userId: userId,
                    menuItems: newOrderedItems
                }, function(result) {
                    calculateAndFillSummaryOrderedMenuItems();
                    console.log(result);
                });
            });

            //calculate the data before
            fillOrderedItemForUsers(function() {
                calculateAndFillSummaryOrderedMenuItems();
                PMCommonFunction.RunCallback(callback);
            })
        });
    });
}

function frozenColumn() {
    var $table = $('#order_menu');
    var $fixedColumn = $table.clone().insertBefore($table).addClass('fixed-column');

    $fixedColumn.find('th:not(:first-child),td:not(:first-child)').remove();

    $fixedColumn.find('tr').each(function(i, elem) {
        $(this).height($table.find('tr:eq(' + i + ')').height());
    });
}

function getFavouritesFromLocalStorage() {
    if (typeof (localStorage.favourites) == UNDEFINED) localStorage.favourites = JSON.stringify([{
        foodName: ''
    }]);
    return JSON.parse(localStorage.favourites);
}
function removeFavourite(food) {
    //use splice
    var favourites = getFavouritesFromLocalStorage();

    //find the index
    var index = 0;
    var found = false;
    while (index < favourites.length && !found) {
        if (favourites[index].foodName == food.foodName) {
            //splice here
            found = true;
        }
        else {
            index++;
        }
    }

    if (found) {
        favourites.splice(index,1);
    }

    localStorage.favourites = JSON.stringify(favourites);
}

function addFavourite(food) {
    var favourites = getFavouritesFromLocalStorage();
    var foundFavouriteFood = favourites.filter(function(foodItem) {
        return foodItem.foodName == food.foodName;
    })[0];
    if (!foundFavouriteFood) {
        favourites.push({
            foodName: food.foodName,
        });
    }

    localStorage.favourites = JSON.stringify(favourites);
}

function setFavouriteClassForRowByFoodName(foodName, favourite) {
    if (typeof (favourite) == UNDEFINED) favourite = true;
    var rowMenu = findRowMenuByName(foodName);
    if (favourite) {
        rowMenu.addClass('food_is_favourite');
    }
    else {
        rowMenu.removeClass('food_is_favourite');
    }
}

function resetFavourites() {
    clearFavourites();
    showFavouriteFoods();
}

function clearFavourites() {
    $(".favourite_food").hide();
    $(".food_is_favourite").removeClass('food_is_favourite');
}

function showFavouriteFoods() {
    var favourites = getFavouritesFromLocalStorage();

    $.each(favourites, function(index, food) {
        showFavouriteFoodByFoodObject(food, true);
    });
}

function foodName_click(event) {
    //check if this food is favourite or not
    var foodNameElement = $(this);
    var menuRow = foodNameElement.parents("tr.detail_order_menu");
    var menuId = menuRow.attr('menu_id');
    var foodName = foodNameElement.html();

    var food = {
        foodName:foodName
    };

    if (menuRow.is(".food_is_favourite")) {
        //remove
        removeFavourite(food);
    }
    else {
        //add
        addFavourite(food);
    }

    resetFavourites();
}

function findRowMenuByName(searchFoodName) {
    var rowMenus = $(".detail_order_menu[menu_id]");

    var found = false;
    var foundRow = null;
    var foundMenuId = 0;
    $.each(rowMenus, function(index,rowMenu) {
        var cellFood = $('.table_order_monan', rowMenu);
        var foodName = $('.detail_order_food_name', cellFood).html();
        if (foodName == searchFoodName) {
            foundRow = $(rowMenus[index]);
            foundMenuId = $(rowMenus[index]).attr('menu_id');
            return false;
        }
    });

    return $(".detail_order_menu[menu_id=" + foundMenuId + "]");
};

//food = {id,foodName}
function showFavouriteFoodByFoodObject(food, show) {
    if (typeof (show) == UNDEFINED) show = true;
    var rowMenu = findRowMenuByName(food.foodName);

    var cellFood = $('.table_order_monan', rowMenu);
    var foodName = $('.detail_order_food_name', cellFood).html();
    if (foodName == food.foodName) {
        var favouriteIcon = $(".favourite_food", cellFood);
        if (show) {
            setFavouriteClassForRowByFoodName(food.foodName, true);
            favouriteIcon.show();
        }
        else {
            setFavouriteClassForRowByFoodName(food.foodName, false);
            favouriteIcon.hide();
        }
    }
}

function createDsMonAn(callback) {
    var itemString = '';
    //template for one row
    var userTemplate = "<td class='detail_order_user_item' user_id='${userId}' username='${username}' style='text-align: center'><input class='userCheckOrder'  type='checkbox'></td>";
    var rowtemplate = "<tr class='detail_order_menu' menu_id='${menuId}'>"
        + "<td class='table_order_monan'><span class='detail_order_food_name' style='cursor: pointer'>${monan}</span>&nbsp<span class='favourite_food glyphicon glyphicon-star-empty' style='display: none;'></span></td>"
        + "<td style='text-align: center'>${gia}</td>";

    $.each(dsUsers, function(index, user) {
        var aUserItemTemplate = userTemplate;
        aUserItemTemplate = aUserItemTemplate.replace('${username}', user.username);
        aUserItemTemplate = aUserItemTemplate.replace('${userId}', user.id);
        rowtemplate += aUserItemTemplate;
    });

    rowtemplate += "</tr>";

    $.each(dsMonAn, function(index, monan) {
        itemString = rowtemplate;

        itemString = itemString.replace('${menuId}', monan.id);
        itemString = itemString.replace('${monan}', monan.menuName);
        itemString = itemString.replace('${gia}', monan.price.FormatNumber(0));
        $("#order_menu tbody").append(itemString);
    });

    //show the favourite food
    showFavouriteFoods();

    frozenColumn();

    //set event after render food
    $(".detail_order_food_name").on('click', foodName_click);

    createDsMonAn_Summary(callback);
}

function createDsMonAn_Summary(callback) {
    var itemString = '';
    //template for one row
    var rowtemplate = "<tr class='summary_order_menu' menu_id='${menuId}' short_food_name='${short_food_name}'>"
        + "<td colspan='2' class='table_summary_monan'>${monan}</td>"
        + "<td class='table_summary_count_main' style='text-align: center'>0</td>"
        + "<td class='table_summary_amount_main' style='text-align: center'>0</td>"
        + "<td class='table_summary_count_extra' style='text-align: center'>0</td>"
        + "<td class='table_summary_amount_extra' style='text-align: center'>0</td>"
    rowtemplate += "</tr>";

    $.each(dsMonAn, function(index, monan) {
        itemString = rowtemplate;

        itemString = itemString.replace('${menuId}', monan.id);
        itemString = itemString.replace('${monan}', monan.menuName);
        itemString = itemString.replace('${short_food_name}', monan.short_food_name);

        $("#summary_menu tbody").append(itemString);
    });

    var totalRowTemplate = "<tr class='summary_order_menu_total'>"
        + "<td class='summary_order_menu_total_cell' style='width: 115px;'>Tổng cộng</td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_amount' style='min-width: 115px;text-align: center; font-weight: bold;'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_count_ordered_cell' style='text-align: center; font-weight: bold;'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_amount_ordered_cell' style='text-align: center; font-weight: bold;'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_extra_count_ordered_cell' style='text-align: center; font-weight: bold;'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_extra_amount_ordered_cell' style='text-align: center; font-weight: bold;'></td>"
        + "</tr>";
    $("#summary_menu tbody").append(totalRowTemplate);

    PMCommonFunction.RunCallback(callback);
}

//this is to return the object:
/*--
 menuId
 count_main
 amount_main
 count_extra
 amount_extra
 ---*/
function getSummaryOrderedMenuItems() {
    //first copy from ds monan
    var summaryOrderedMenuItems = [];
    $.each(dsMonAn, function(index, monan) {
        summaryOrderedMenuItems.push({
            menuId: monan.id,
            count_main: 0,
            amount_main: 0,
            count_extra: 0,
            amount_extra: 0,
        });
    });

    //for each user calculate the data
    $.each(dsUsers, function(index, user) {
        var orderedUserItems = getOrderedItemsByUsername(user.username);

        //return = [{item:{id,menuName,price,extra_price},isMainItem:int}]
        //isMainItem = 1: main, 0: sub, -1: not set

        $.each(orderedUserItems, function(indexUser, orderedUserItem) {
            var summaryOrderedMenuItem = summaryOrderedMenuItems.filter(function(item) {
                return item.menuId == orderedUserItem.item.id;
            })[0];

            if (orderedUserItem.isMainItem == 1) {
                summaryOrderedMenuItem.count_main += 1;
                summaryOrderedMenuItem.amount_main += orderedUserItem.item.price;
            }
            else {
                summaryOrderedMenuItem.count_extra += 1;
                summaryOrderedMenuItem.amount_extra += orderedUserItem.item.extra_price;
            }
        });
    });

    return summaryOrderedMenuItems;
}

function calculateAndFillSummaryOrderedMenuItems() {

    var summaryOrderedMenuItems = getSummaryOrderedMenuItems();
    var total = 0;
    var itemCount = 0;
    var itemAmount = 0;
    var itemExtraCount = 0;
    var itemExtraAmount = 0;
    $.each(summaryOrderedMenuItems, function(index, summaryOrderedMenuItem) {
        var summaryMenuRow = $("tr.summary_order_menu[menu_id='" + summaryOrderedMenuItem.menuId + "']");

        itemCount += summaryOrderedMenuItem.count_main
        itemAmount += summaryOrderedMenuItem.amount_main
        itemExtraCount += summaryOrderedMenuItem.count_extra
        itemExtraAmount += summaryOrderedMenuItem.amount_extra
        total += summaryOrderedMenuItem.amount_main + summaryOrderedMenuItem.amount_extra;


        $('.table_summary_count_main', $(summaryMenuRow)).html(summaryOrderedMenuItem.count_main.FormatNumber(0));
        $('.table_summary_amount_main', $(summaryMenuRow)).html(summaryOrderedMenuItem.amount_main.FormatNumber(0));
        $('.table_summary_count_extra', $(summaryMenuRow)).html(summaryOrderedMenuItem.count_extra.FormatNumber(0));
        $('.table_summary_amount_extra', $(summaryMenuRow)).html(summaryOrderedMenuItem.amount_extra.FormatNumber(0));

    });


    $(".summary_order_menu_total_amount").html(total.FormatNumber(0));
    $(".summary_order_menu_total_count_ordered_cell").html(itemCount.FormatNumber(0));
    $(".summary_order_menu_total_amount_ordered_cell").html(itemAmount.FormatNumber(0));
    $(".summary_order_menu_total_amount_ordered_cell").html(itemAmount.FormatNumber(0));
    $(".summary_order_menu_total_extra_count_ordered_cell").html(itemExtraCount.FormatNumber(0));
    $(".summary_order_menu_total_extra_amount_ordered_cell").html(itemExtraAmount.FormatNumber(0));

}

function createHeaderByGroupCode(callback) {
    DC.Data.Menu.GetUsersByGroupCode({groupCode: groupCode}, function(result) {
        if (result.data.code == 0) {
            dsUsers = result.data.users;

            var itemString = '';

            $.each(dsUsers, function(index, user) {
                itemString = '<th style="text-align: center">' + user.fullName + '</th>';
                $("#order_menu thead tr:first-child").append(itemString);
            });

            //in the case the group has no data of user -> show message
            if (dsUsers.length == 0) {
                $(".message_error_data").addClass('message_no_member_mode');
                $(".message_error_data").show();
            }
        }
        else if (result.data.code == 1) {
            //has no group (show the message if groupCode has data
            if (GROUP_CODE != '') {
                $(".message_error_data").addClass('message_no_group_mode');
                $(".message_error_data").show();
            }
        }
        PMCommonFunction.RunCallback(callback);
    });
}

//this function is to travel all the user and check if the item is ordered (main or extra) or not
function fillOrderedItemForUsers(callback) {
    $.each(dsUsers, function(indexUser, user) {
        var userId = user.id;
        $.each(user.menuItems, function(indexItem, item) {
            var menuId = item.menu_id;
            var isMainItem = item.extra_food != '1';
            var checkbox = getCheckboxByMenuIdAndUserId(menuId, userId);

            if (checkbox.length > 0) {
                //check this checkbox
                $(checkbox).attr('checked', 'checked');
                checkbox[0].checked = true;

                //set main or sub
                if (isMainItem) {
                    setMainItemByCheckbox(checkbox);
                }
                else {
                    setSubItemByCheckbox(checkbox);
                }
            }
        });
    });

    PMCommonFunction.RunCallback(callback);
}

//this function get all the summary data then generate the message
function getSummarySmsText() {
    var summaryOrderedMenuItemRows = $('#summary_menu tr.summary_order_menu');

    $.each(summaryOrderedMenuItemRows, function(index, row) {
        var shortFoodName = $(row).attr('short_food_name');
        console.log(shortFoodName);
    });
}

//this return the data of the ordered menu items
//data = [{menuId,shortFoodName,count,extraCount}]
function getSummarySmsData() {
    var summaryOrderedMenuItemRows = $('#summary_menu tr.summary_order_menu');

    var orderedMenuItems = [];
    $.each(summaryOrderedMenuItemRows, function(index, row) {
        var menuId = parseInt($(row).attr('menu_id'));
        var shortFoodName = $(row).attr('short_food_name');
        var count = parseInt($('td.table_summary_count_main', $(row)).html());
        var countExtra = parseInt($('td.table_summary_count_extra', $(row)).html());
        if (count + countExtra > 0) {
            orderedMenuItems.push({
                meniId: menuId,
                shortFoodName: shortFoodName,
                count: count,
                countExtra: countExtra,
            });
        }
    });

    return orderedMenuItems;
}
function copyToClipboard(element) {
    var answer = document.getElementById("btnCopyToClipboard");
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    var successful = document.execCommand("copy");
    if (successful) answer.innerHTML = 'Copied!';
    else answer.innerHTML = 'Unable to copy!';
    $temp.remove();
}

function getUserDataAndFillGrid(callback) {
    DC.Data.Menu.GetUsersByGroupCode({groupCode: groupCode}, function(result) {
        if (result.data.code == 0) {
            clearMainAndSubItemAndCheckboxByAllUsername();
            dsUsers = result.data.users;
            fillOrderedItemForUsers(function() {
                calculateAndFillSummaryOrderedMenuItems();
                PMCommonFunction.RunCallback(callback);
            })
        }
    });
}

function startAutoSync(time) {
    window.autoSyncTimer = setTimeout(function() {
        window.isGettingUserDataAndFillProgress = true;
        getUserDataAndFillGrid(function() {
            window.isGettingUserDataAndFillProgress = false;
            startAutoSync(time);
        });
    }, time);
}

//callback the result of this method
function checkAndSaveDeviceGuid(callback) {
    if (typeof (localStorage.deviceGuid) == UNDEFINED) localStorage.deviceGuid = PMCommonFunction.generateUUID();

    var guid = localStorage.deviceGuid;
    Context.DeviceGuid = guid;
    PMCommonFunction.RunCallback(callback);
}