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


    <script src="js/DC.Config.js"></script>
    <script src="js/DC.Data.Common.js"></script>
    <script src="js/DC.Data.js"></script>
    <script src="js/RequestMessage.js"></script>

    <style type="text/css">
        .sbzoff {
            display: none;
            visibility: hidden;
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
                <a class="navbar-brand" href="http://localhost/menu.php" style="font-weight: bold; font-size: 25px;">Trang đặt cơm</a>
            </div>
<!--            <ul class="nav navbar-nav">-->
<!--                <li class="active"><a href="#">Home</a></li>-->
<!--                <li><a href="#">Page 1</a></li>-->
<!--                <li><a href="#">Page 2</a></li>-->
<!--                <li><a href="#">Page 3</a></li>-->
<!--            </ul>-->
        </div>
    </nav>
    <div style="display: none">
        <?= $content ?>
    </div>
<h1 class="text-center">Menu</h1>

<div class="col-sm-10" id="menu" style="text-align: center">

</div>
    <table class="table table-striped">
        <thead>
        <tr>
            <th>Thực đơn</th>
            <th>Giá</th>
            <th>Sơn 1</th>
            <th>Sơn 2</th>
            <th>Tảo</th>
            <th>Phúc</th>
            <th>Dũng</th>
            <th>Minh</th>
            <th>Phú</th>
            <th>Phước</th>
            <th>Hân</th>
            <th>Tauj</th>
            <th>Lộc</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>John</td>
            <td>Doe</td>
            <td></td>
        </tr>
        <tr>
            <td>Mary</td>
            <td>Moe</td>
            <td></td>
        </tr>
        <tr>
            <td>July</td>
            <td>Dooley</td>
            <td></td>
        </tr>
        </tbody>
    </table>

</div>

<script>
    var dsMonAn = [];
    $(document).ready(function () {
        var text = '';
        $.each($(".monan [data-name=thuc-don]"), function (index, item) {
            var monan1 = $(item).attr('data-title');

            var monan2 = monan1.toLowerCase();
            var monan = monan2.substr(0, 1).toUpperCase() + monan2.substr(1, monan2.length);

            text += monan + '<br/>';

            dsMonAn.push(monan);
        });
        $('#menu').html(text);
    });
    
    function createDsMonAn() {
        
    }
    
    
    function createHeaderByGroupCode() {
        
    }

    function test() {

    }
</script>

</body>
</html>