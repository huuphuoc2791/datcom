<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include 'common/autoload.php';

if (!isset($_GET['groupCode']) || !isset($_GET['hash'])) {
    $error = 'Invalid link';
} else {
    $groupCode = CommonFunction::getGetValue('groupCode');
    $hash = CommonFunction::getGetValue('hash');

    //check hash and group code
    $groupRows = (new Group())->findByGroupCodeAndHash($groupCode, $hash);

    if (count($groupRows) == 0) {
        $error = 'Invalid link';
    }

    $group = $groupRows[0];
    $groupId = $group['id'];
    $groupName = $group['name'];

    //check posted data
    if (!empty($_POST)) {
        //update group
        if (isset($_POST['groupName'])) {
            $groupName = CommonFunction::getPostValue('groupName');
            (new Group())->update($groupId, $groupName, $groupCode);

            //get group again
            $groupRows = (new Group())->findByGroupCodeAndHash($groupCode, $hash);
            $group = $groupRows[0];
            $groupId = $group['id'];
            $groupName = $group['name'];
        }

        //update user

        //add user
    }
    if (empty($error)) {
        $users = (new User())->findByGroupId($group['id']);
    }
}

?>
<!DOCTYPE html>
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
    </style>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.js"></script>
    <!-- Bootstrap JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>

    <script src="/datcom/common/common.js"></script>
    <script src="/datcom/view/js/DC.Config.js"></script>
    <script src="/datcom/view/js/DC.Data.Common.js"></script>
    <script src="/datcom/view/js/DC.Data.js"></script>
    <script src="/datcom/view/js/RequestMessage.js"></script>

    <!-- js of page(s) -->
    <script>
        //assign group code here
        GROUP_CODE = '<?= $groupCode ?>';
        GROUP_HASH = '<?= $hash ?>';
    </script>
    <script src="/datcom/view/js/group-management.js"></script>

</head>
<body>
<div class="container">
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href=""
                   style="font-weight: bold; font-size: 25px;">Trang quản lí nhóm</a>
            </div>
        </div>
    </nav>
    <div style="clear: both"></div>
    <form class="form-inline" style="margin-bottom: 10px;" method="post">
        <div class="form-group">
            <label for="exampleInputName2">Mã nhóm:</label>
            <p class="form-control-static"><?= $groupCode ?></p>
        </div>
        <div class="form-group" style="margin-left: 20px;">
            <label for="exampleInputName2">Tên nhóm:</label>
            <div class="input-group">
                <div class="input-group-addon"><span class="fa fa-users"></span></div>
                <input type="text" class="form-control" name="groupName"
                       placeholder="Đổi tên nhóm" value="<?= $group['name'] ?>">
            </div>

        </div>

        <div class="form-group">
            <button type="submit" name="selectGroup" value="submit" class="btn btn-primary"
                    autocomplete="off" style="float: right; margin-left: 5px;"><span class="fa fa-pencil-square-o"></span>&nbsp;Sửa
            </button>
        </div>
    </form>

    <div style="clear: both"></div>
    <div class="table-responsive">
        <table id="users" class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Tài khoản</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số ĐT</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>