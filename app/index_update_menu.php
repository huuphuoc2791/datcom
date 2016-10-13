<!DOCTYPE html>
<?php
$page = "http://comnhaviet.net/";
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


    <style type="text/css">
        .sbzoff {
            display: none;
            visibility: hidden;
        }

        div.sbzoff, div.sbzon, #sbzstorage_frame {
            display: none !important;
        }

        #order_menu.table-striped > tbody > tr:nth-of-type(odd) {
            background-color: rgba(43, 222, 65, 0.26);
        }
    </style>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.js"></script>
    <!-- Bootstrap JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>

    <script src="/common/common.js"></script>
    <script src="/view/js/DC.Config.js"></script>
    <script src="/view/js/DC.Data.Common.js"></script>
    <script src="/view/js/DC.Data.js"></script>
    <script src="/view/js/RequestMessage.js"></script>
</head>
<body>
<div class="container">
    <div id="comnhaviet_page" style="display: none">
        <?= $content ?>
    </div>
    <div class="message">

    </div>
</div>

<script>
    var dsMonAn = [];

    $(document).ready(function() {
        var text = '';
        var monanElements = $(".monan [data-name=thuc-don]");
        $.each(monanElements, function(index, item) {
            var monan1 = $(item).attr('data-title');

            var monan2 = monan1.toLowerCase();
            var monan = monan2.substr(0, 1).toUpperCase() + monan2.substr(1, monan2.length);

            dsMonAn.push({menuName: monan, price: 30000});
        });

        //update menu of today
        DC.Data.Menu.UpdateMenuByDate({
            menuDate: new Date(),
            menuItems: dsMonAn
        }, function(result) {
            $(".message").html('Đã cập nhật thành công');
        });
    });
</script>
</body>
</html>