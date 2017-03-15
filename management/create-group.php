<?php
/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/20/16
 * Time: 11:11
 */

ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include_once '../common/autoload.php';

$code = CommonFunction::getPostValue('code');
$name =CommonFunction::getPostValue('name');
$hash =CommonFunction::guid(true,false);
$Group = new Group();
$Group->insert($code,$name,$hash);

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <title>Tạo nhóm</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

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

</head>
<body>
<div class="col-sm-10" style="margin-bottom: 10px;">
    <h4 class="text-center">Nhập nhóm</h4>
</div>
<div class="col-sm-10 col-sm-offset-1">
    <form class="col-sm-6 col-sm-offset-3 form-horizontal" role="form" method="post">

        <div class="form-group">
            <label for="code" class="col-sm-2 control-label">Group Code</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="code" name="code" placeholder="korrin" value="">
            </div>
        </div>

        <div class="form-group">
            <label for="name" class="col-sm-2 control-label">Group Code</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="name" name="name" placeholder="Công ty The Korri" value="">
            </div>
        </div>

        <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
                <input id="submit" name="submit" type="submit" value="Send" class="btn btn-primary">
            </div>
        </div>
    </form>
</div>
</body>
</html>