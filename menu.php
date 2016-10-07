<?php
function getPostValue($name)
{
    if (isset($_POST[$name])) return $_POST[$name];
    return "";
}

function getGetValue($name)
{
    if (isset($_GET[$name])) return $_GET[$name];
    return "";
}

function GetSessionValue($name)
{
    if (isset($_SESSION[$name])) return $_SESSION[$name];
    return NULL;
}

$_POST['groupCode'] = 'korrin';

$groupCode = getPostValue('groupCode');
?>
<!DOCTYPE html>
<?php
$content = file_get_contents("http://comnhaviet.net/");
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


    <script src="js/DC.Config.js"></script>
    <script src="js/DC.Data.Common.js"></script>
    <script src="js/DC.Data.js"></script>
    <script src="js/RequestMessage.js"></script>

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
    <script src="//code.jquery.com/jquery.js"></script>
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
    <form class="form-inline" style="margin-bottom: 10px; float: right">
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
        <table id="count_menu" class="table table-striped table-bordered">
            <tr>
                <th>Thực đơn</th>
                <th style="text-align: center" class="foodCounter">Phần cơm</th>
                <th style="text-align: center" class="foodCounter">Tổng tiền</th>
                <th style="text-align: center" class="foodCounter">Phần thêm</th>
                <th style="text-align: center" class="foodCounter">Tiền thêm</th>
            </tr>

        </table>
    </div>
    <label for="exampleInputName2">Tổng cộng</label>
</div>

<script>
    var dsMonAn = [];
    var dsUsers = [];

    var groupCode = '<?= $groupCode ?>'
    $(document).ready(function () {
        //event
        $("input[name=selectGroup]").on('click', function (event) {
            $("form")[0].submit();
        });

        var text = '';
        var monanElements = $(".monan [data-name=thuc-don]");
        $.each(monanElements, function (index, item) {
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
        $.each(monanElements, function (index, item) {
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
        }, function (result) {
            if (groupCode != '') {
                dsMonAn = result.data.menuItems;
                //create table
                createTableForGroup();
            }
        });

    });

    function createTableForGroup() {
        createHeaderByGroupCode(function () {
            createDsMonAn(function () {
                //add event
                $(".userCheckOrder").on('change', function (event) {
                    var control = $(this);
                    var checked = control.is(":checked");
                    var username = control.parents('td[username]').attr('username');
                    var monan = control.parents('tr').find('td.table_order_monan').html();
                    var menuId = control.parents('tr').attr('menu_id');

                    console.log(username + ' ' + (checked ? 'Them' : 'Huy') + ' mon an ' + monan + "(id='" + menuId + "')");

                    if (checked) {
                        DC.Data.Menu.OrderForUser({
                            groupCode: groupCode,
                            username: username,
                            menuId: menuId
                        }, function (result) {
                            console.log(result);
                        });
                    }
                    else {
                        DC.Data.Menu.RemoveOrderForUser({
                            groupCode: groupCode,
                            username: username,
                            menuId: menuId
                        }, function (result) {
                            console.log(result);
                        });
                    }


                });
            });
        });
    }

    function createDsMonAn(callback) {
        var itemString = '';
        //template for one row
        var userTemplate = "<td username='${username}' style='text-align: center'><input class='userCheckOrder'  type='checkbox'></td>";
        var rowtemplate = "<tr menu_id='${menuId}'>"
            + "<td class='table_order_monan'>${monan}</td>"
            + "<td style='text-align: center'>${gia}</td>";

        $.each(dsUsers, function (index, user) {
            var aUserItemTemplate = userTemplate;
            aUserItemTemplate = aUserItemTemplate.replace('${username}', user.username);
            rowtemplate += aUserItemTemplate;
        });

        rowtemplate += "</tr>";

        $.each(dsMonAn, function (index, monan) {
            itemString = rowtemplate;

            itemString = itemString.replace('${menuId}', monan.id);
            itemString = itemString.replace('${monan}', monan.menuName);
            itemString = itemString.replace('${gia}', monan.price);
            $("#order_menu tbody").append(itemString);
        });

        callback();
    }

    function createHeaderByGroupCode(callback) {
        DC.Data.Menu.GetUsersByGroupCode({groupCode: groupCode}, function (result) {
            if (result.data.code == 0) {
                dsUsers = result.data.users;

                var itemString = '';

                $.each(dsUsers, function (index, user) {
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

</body>
</html>