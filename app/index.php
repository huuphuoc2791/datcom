<?php
function getPostValue($name) {
    if (isset($_POST[$name])) return $_POST[$name];
    return "";
}

function getGetValue($name) {
    if (isset($_GET[$name])) return $_GET[$name];
    return "";
}

function GetSessionValue($name) {
    if (isset($_SESSION[$name])) return $_SESSION[$name];
    return NULL;
}

$_POST['groupCode'] = 'korrin';

$groupCode = getPostValue('groupCode');
?>
<!DOCTYPE html>
<?php
//for test, get mon day
$page = "http://comnhaviet.net/thuc-don/danh-muc/thu-hai-577.html";
//$page = "http://comnhaviet.net/";
$content = file_get_contents($page);
?>
<html lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Đặt cơm</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">


    <script src="/view/js/DC.Config.js"></script>
    <script src="/view/js/DC.Data.Common.js"></script>
    <script src="/view/js/DC.Data.js"></script>
    <script src="/view/js/RequestMessage.js"></script>

    <style type="text/css">
        .sbzoff {
            display: none;
            visibility: hidden;
        }

        div.sbzoff, div.sbzon, #sbzstorage_frame {
            display: none !important;
        }
    </style>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.js"></script>
    <!-- Bootstrap JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>
</head>
<body>
<div class="container">
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="/menu.php"
                   style="font-weight: bold; font-size: 25px;">Trang đặt cơm</a>
            </div>
            <!--            <ul class="nav navbar-nav">-->
            <!--                <li class="active"><a href="#">Home</a></li>-->
            <!--                <li><a href="#">Page 1</a></li>-->
            <!--                <li><a href="#">Page 2</a></li>-->
            <!--                <li><a href="#">Page 3</a></li>-->
            <!--            </ul>-->
        </div>
    </nav>
    <div id="comnhaviet_page" style="display: none">
        <?= $content ?>
    </div>


    <!-- do not show here -->
    <div class="col-sm-10" id="menu" style="text-align: center; display: none;">

    </div>
    <div style="clear: both"></div>


    <div style="clear: both"></div>
    <form class="form-inline" style="margin-bottom: 10px; float: right" method="post">
        <div class="form-group">
            <label for="exampleInputName2">Mã nhóm:</label>
            <div class="input-group">
                <div class="input-group-addon"><span class="fa fa-users"></span></div>

                <input type="text" class="form-control" name="groupCode"
                       placeholder="Chọn mã nhóm" value="<?= getPostValue('groupCode') ?>">
            </div>
            <button type="submit" name="selectGroup" value="submit" class="btn btn-primary"
                    autocomplete="off" style="float: right; margin-left: 5px;"><span class="fa fa-check"></span>&nbsp;Chọn
            </button>
        </div>
    </form>

    <div style="clear: both"></div>
    <div class="table-responsive">
        <table id="order_menu" class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Thực đơn</th>
                <th style="text-align: center" class="price_header">Giá</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <div style="clear: both"></div>

    <label for="exampleInputName2" style="font-size: 20px; font-weight: bold">Tổng hợp</label>
    <div style="clear: both"></div>

    <div class="table-responsive">
        <table id="summary_menu" class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Thực đơn</th>
                <th style="text-align: center" class="foodCounter">Phần cơm</th>
                <th style="text-align: center" class="foodCounter">Tổng tiền</th>
                <th style="text-align: center" class="foodCounter">Phần thêm</th>
                <th style="text-align: center" class="foodCounter">Tiền thêm</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
</div>

<script>
    var dsMonAn = [];
    var dsUsers = [];

    var groupCode = '<?= $groupCode ?>';
    var MAIN_ITEM_CLASS = 'menu_detail_item_main';
    var SUB_ITEM_CLASS = 'menu_detail_item_sub';
    var MAIN_SUB_ITEM_ALL_CLASS = MAIN_ITEM_CLASS + ' ' + SUB_ITEM_CLASS;

    $(document).ready(function() {
        //event
        $("input[name=selectGroup]").on('click', function(event) {
            $("form")[0].submit();
        });

        var text = '';
        var monanElements = $(".monan [data-name=thuc-don]");
        $.each(monanElements, function(index, item) {
            var monan1 = $(item).attr('data-title');

            var monan2 = monan1.toLowerCase();
            var monan = monan2.substr(0, 1).toUpperCase() + monan2.substr(1, monan2.length);

            text += monan + '<br/>';

            dsMonAn.push({menuName: monan, price: 30000});
        });

        $('#menu').html(text);

        //clear comnhaviet page
        $("#comnhaviet_page").empty();
        var text = '';
        var monanElements = $(".monan [data-name=thuc-don]");
        $.each(monanElements, function(index, item) {
            var monan1 = $(item).attr('data-title');

            var monan2 = monan1.toLowerCase();
            var monan = monan2.substr(0, 1).toUpperCase() + monan2.substr(1, monan2.length);

            text += monan + '<br/>';

            dsMonAn.push({menuName: monan, price: 30000});
        });

        $('#menu').html(text);

        //update menu of today
        DC.Data.Menu.UpdateMenuByDate({
            menuDate: new Date(),
            menuItems: dsMonAn
        }, function(result) {
            if (groupCode != '') {
                dsMonAn = result.data.menuItems;
                //create table
                createTableForGroup();
            }
        });

    });


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
    //return = [{item:{id,menuName,price,extraPrice},isMainItem:int}]
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
    function createTableForGroup() {
        createHeaderByGroupCode(function() {
            createDsMonAn(function() {
                //add event
                $(".userCheckOrder").on('change', function(event) {
                    var control = $(this);
                    var checked = control.is(":checked");
                    var username = control.parents('td.detail_order_user_item[username]').attr('username');
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
                        groupCode: groupCode,
                        username: username,
                        menuItems: newOrderedItems
                    }, function(result) {
                        calculateAndFillSummaryOrderedMenuItems();
                        console.log(result);
                    });
                });
            });
        });
    }

    function createDsMonAn(callback) {
        var itemString = '';
        //template for one row
        var userTemplate = "<td class='detail_order_user_item' username='${username}' style='text-align: center'><input class='userCheckOrder'  type='checkbox'></td>";
        var rowtemplate = "<tr class='detail_order_menu' menu_id='${menuId}'>"
            + "<td class='table_order_monan'>${monan}</td>"
            + "<td style='text-align: center'>${gia}</td>";

        $.each(dsUsers, function(index, user) {
            var aUserItemTemplate = userTemplate;
            aUserItemTemplate = aUserItemTemplate.replace('${username}', user.username);
            rowtemplate += aUserItemTemplate;
        });

        rowtemplate += "</tr>";

        $.each(dsMonAn, function(index, monan) {
            itemString = rowtemplate;

            itemString = itemString.replace('${menuId}', monan.id);
            itemString = itemString.replace('${monan}', monan.menuName);
            itemString = itemString.replace('${gia}', monan.price);
            $("#order_menu tbody").append(itemString);
        });

        createDsMonAn_Summary(callback);
    }

    function createDsMonAn_Summary(callback) {
        var itemString = '';
        //template for one row
        var rowtemplate = "<tr class='summary_order_menu' menu_id='${menuId}'>"
            + "<td class='table_summary_monan'>${monan}</td>"
            + "<td class='table_summary_count_main' style='text-align: center'>0</td>"
            + "<td class='table_summary_amount_main' style='text-align: center'>0</td>"
            + "<td class='table_summary_count_extra' style='text-align: center'>0</td>"
            + "<td class='table_summary_amount_extra' style='text-align: center'>0</td>"
        rowtemplate += "</tr>";

        $.each(dsMonAn, function(index, monan) {
            itemString = rowtemplate;

            itemString = itemString.replace('${menuId}', monan.id);
            itemString = itemString.replace('${monan}', monan.menuName);
            $("#summary_menu tbody").append(itemString);
        });

        var totalRowTemplate = "<tr class='summary_order_menu_total'>"
        + "<td style='font-size: 15; font-weight: bold'>Tổng cộng</td>"
        + "<td colspan='4' class='summary_order_menu_total_cell'></td>"
        + "</tr>";
        $("#summary_menu tbody").append(totalRowTemplate);


        callback();
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
        $.each(dsMonAn, function(index,monan) {
            summaryOrderedMenuItems.push({
                menuId:monan.id,
                count_main:0,
                amount_main:0,
                count_extra:0,
                amount_extra:0,
            });
        });

        //for each user calculate the data
        $.each(dsUsers, function(index, user) {
            var orderedUserItems = getOrderedItemsByUsername(user.username);

            //return = [{item:{id,menuName,price,extraPrice},isMainItem:int}]
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
                    summaryOrderedMenuItem.amount_extra += orderedUserItem.item.extraPrice;
                }
            });
        });

        return summaryOrderedMenuItems;
    }

    function calculateAndFillSummaryOrderedMenuItems() {

        var summaryOrderedMenuItems = getSummaryOrderedMenuItems();
        var total = 0;
        $.each(summaryOrderedMenuItems, function(index, summaryOrderedMenuItem) {
            var summaryMenuRow = $("tr.summary_order_menu[menu_id='" + summaryOrderedMenuItem.menuId + "']");

            $('.table_summary_count_main',$(summaryMenuRow)).html(summaryOrderedMenuItem.count_main);
            $('.table_summary_amount_main',$(summaryMenuRow)).html(summaryOrderedMenuItem.amount_main);
            $('.table_summary_count_extra',$(summaryMenuRow)).html(summaryOrderedMenuItem.count_extra);
            $('.table_summary_amount_extra',$(summaryMenuRow)).html(summaryOrderedMenuItem.amount_extra);

            total += summaryOrderedMenuItem.amount_main + summaryOrderedMenuItem.amount_extra;
        });


        $(".summary_order_menu_total_cell").html(total);
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
                callback();
            }
        });
    }
    function count() {

    }
</script>

<div class="row">
    <div class="col-lg-12">
        

    </div>
</div>


</body>
</html>