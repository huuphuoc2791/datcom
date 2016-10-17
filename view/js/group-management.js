var dsMonAn = [];
var dsUsers = [];

var groupCode = GROUP_CODE;
var hash = GROUP_HASH;

$(document).ready(function() {
    //event
    $("input[name=selectGroup]").on('click', function(event) {
        $("form")[0].submit();
    });

    $("#resetOrdered").on('click', resetOrderEvent);
    $("#showSmsPopup").on('click', showSmsPopup_Click);


    // createTableForGroup();

    $('#smsPopup').modal({show: false});

});

//event
function resetOrderEvent(event) {
    var control = $(this);

    //send request to clear by group code
    DC.Data.Menu.ClearAllOderByGroupCode({groupCode: groupCode}, function(result) {
        console.log('done');
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
    sms = sms.substr(0, sms.length - 2);
    sms = sms + '. Them: ';
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
    sms = sms.substr(0, sms.length - 2);
    sms = sms + '. \n';
    sms = sms + 'Tong cong: ' + countTotal + ' phan';
    if (countExtraTotal > 0) {
        sms = sms + ' + ' + countExtraTotal + ' phan them';
    }
    sms = sms + '. Thanks chi!';
    sms = sms.ReplaceAll('\n', '<br/>');

    //set the text
    $("#sms_content").html(sms);

    //set the qr code with phone number = empty

    $('#smsPopup').modal('show');
}

//callback get the base64image
function getSmsQrCode(smsData, callback) {
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
        PMCommonFunction.RunCallback(callback,xmlhttp.responseText);
    };
    // xmlhttp.send('message=' + encodeURIComponent(url));
    xmlhttp.send('phoneNumber=' + encodeURIComponent(smsData.phoneNumber) + '&message=' + encodeURIComponent(smsData.message));
}

function setImageBase64(base64,qrCodeImage) {
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

function getCheckboxByMenuIdAndUsername(menuId, username) {
    return $("tr.detail_order_menu[menu_id='" + menuId + "'] td.detail_order_user_item[username='" + username + "'] input[type=checkbox]");
}
function getCheckboxByMenuIdAndUserId(menuId, userId) {
    return $("tr.detail_order_menu[menu_id='" + menuId + "'] td.detail_order_user_item[user_id='" + userId + "'] input[type=checkbox]");
}
function createTableForGroup() {
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
            })
        });
    });
}

function createDsMonAn(callback) {
    var itemString = '';
    //template for one row
    var userTemplate = "<td class='detail_order_user_item' user_id='${userId}' username='${username}' style='text-align: center'><input class='userCheckOrder'  type='checkbox'></td>";
    var rowtemplate = "<tr class='detail_order_menu' menu_id='${menuId}'>"
        + "<td class='table_order_monan'>${monan}</td>"
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
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_amount' style='min-width: 115px;'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_count_ordered_cell'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_amount_ordered_cell'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_extra_count_ordered_cell'></td>"
        + "<td class='summary_order_menu_total_cell summary_order_menu_total_extra_amount_ordered_cell'></td>"
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
                $(".message_no_user div").html('Nhóm chưa có thành viên. Xin vui lòng cập nhật.')
                $(".message_no_user").show();
            }
        }
        else if (result.data.code == 1) {
            //has no group
            $(".message_no_user div").html('Nhóm chưa được tạo, xin liên hệ người quản trị.')
            $(".message_no_user").show();
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

            //check this checkbox
            $(checkbox).attr('checked', 'checked');

            //set main or sub
            if (isMainItem) {
                setMainItemByCheckbox(checkbox);
            }
            else {
                setSubItemByCheckbox(checkbox);
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
    var answer = document.getElementById("copyAnswer");
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    var successful = document.execCommand("copy");
    if (successful) answer.innerHTML = 'Copied!';
    else answer.innerHTML = 'Unable to copy!';
    $temp.remove();
}