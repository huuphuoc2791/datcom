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
            (new Group())->updateWithoutHash($groupId, $groupName, $groupCode);

            //get group again
            $groupRows = (new Group())->findByGroupCodeAndHash($groupCode, $hash);
            $group = $groupRows[0];
            $groupId = $group['id'];
            $groupName = $group['name'];

            $success = 'Nhóm được cập nhật';
        }

        //update,remove,insert use the data below:
        $userId = CommonFunction::getPostValue('user_id');
        $username = CommonFunction::getPostValue('username');
        $fullname = CommonFunction::getPostValue('fullname');
        $email = CommonFunction::getPostValue('email');
        $phone = CommonFunction::getPostValue('phone');

        //update user
        if (isset($_POST['save'])) {
            //get this user
            $userRows = (new User())->findById($userId);
            if (empty($userRows)) {
                $error = 'Invalid data';
            } else {
                $user = $userRows[0];
                //check if belong to this group or not
                if ($user['group_id'] != $groupId) {
                    $error = 'Invalid data';
                } else {
                    //update $test =
                    $username = $userRows[0]['username'];
                    (new User())->update($userId,$username,$fullname,$groupId, $email, $phone);
                    $success = 'Tài khoản được cập nhật thành công';
                }
            }
        }

        //remove user
        if (isset($_POST['remove'])) {
            //get this user
            $userRows = (new User())->findById($userId);
            if (empty($userRows)) {
                $error = 'Invalid data';
            } else {
                $user = $userRows[0];
                //check if belong to this group or not
                if ($user['group_id'] != $groupId) {
                    $error = 'Invalid data';
                } else {
                    //remove from order
                    (new Order())->deleteByUserId($userId);

                    //remove from user
                    (new User())->delete($userId);

                    $success = 'Xóa thành công';

                }
            }
        }

        //add user
        if (isset($_POST['add'])) {
            //find if the username is used or not
            $userRows = (new User())->findByUsername($username);
            if (!empty($userRows)) {
                //exists
                $error = 'Tài khoản đã được đăng ký';
            } else {
                //can insert
                (new User())->insert($username, $fullname, $groupId, $email, $phone);
                $success = 'Thêm thành công';
            }
        }
    }

    $users = (new User())->findByGroupId($group['id']);
}

?>
<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Quản lí nhóm</title>

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
    <style>
        #users .btn {
            padding: 2px 5px;
            margin-top: 4px;
        }

    </style>
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
    <?php if (!empty($error)): ?>
        <div class="row">
            <div class="col-sm-12">
                <p class="bg-warning"><?= $error ?></p>
            </div>
        </div>
    <?php else:
        if (!empty($success)): ?>
            <div class="row">
                <div class="col-sm-12">
                    <p class="bg-success"><?= $success ?></p>
                </div>
            </div>

        <?php endif; ?>
    <?php endif; ?>
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
                    autocomplete="off" style="float: right; margin-left: 5px;"><span
                    class="fa fa-pencil-square-o"></span>&nbsp;Sửa
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
            <?php foreach ($users as $user): ?>
                <form method="post" class="form-inline">
                    <input type="hidden" name="user_id" value="<?= $user['id'] ?>"/>
                    <tr>
                        <td>
                            <div class="input-group">
                                <div class="input-group-addon"><span class="fa fa-user"></span></div>
                                <input type="text" class="form-control" name="username" value="<?= $user['username'] ?>"
                                       disabled/>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <div class="input-group-addon"><span class="fa fa-user"></span></div>
                                <input type="text" class="form-control" name="fullname"
                                       value="<?= $user['fullname'] ?>"/>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <div class="input-group-addon"><span class="fa fa-at"></span></div>
                                <input type="text" class="form-control" name="email" value="<?= $user['email'] ?>"/>
                            </div>
                        <td>
                            <div class="input-group">
                                <div class="input-group-addon"><span class="fa fa-phone"></span></div>
                                <input type="text" class="form-control" name="phone" value="<?= $user['phone'] ?>"/>
                            </div>
                        </td>
                        <td>
                            <button type="submit" name="save" class="btn btn-primary"><span
                                    class="fa fa-floppy-o"></span></button>
                            <button type="submit" name="remove" class="btn btn-danger"><span
                                    class="fa fa-trash-o"></span></button>
                        </td>
                    </tr>
                </form>
            <?php endforeach; ?>
            <form method="post" class="form-inline">
                <tr>
                    <td>
                        <div class="input-group">
                            <div class="input-group-addon"><span class="fa fa-user"></span></div>
                            <input type="text" class="form-control" name="username" value=""/>
                        </div>
                    </td>
                    <td>
                        <div class="input-group">
                            <div class="input-group-addon"><span class="fa fa-user"></span></div>
                            <input type="text" class="form-control" name="fullname" value=""/>
                        </div>
                    </td>
                    <td>
                        <div class="input-group">
                            <div class="input-group-addon"><span class="fa fa-at"></span></div>
                            <input type="text" class="form-control" name="email" value=""/>
                        </div>
                    <td>
                        <div class="input-group">
                            <div class="input-group-addon"><span class="fa fa-phone"></span></div>
                            <input type="text" class="form-control" name="phone" value=""/>
                        </div>
                    </td>
                    <td>
                        <button type="submit" name="add" class="btn btn-success"><span
                                class="fa fa-plus"></span></button>
                    </td>
                </tr>
            </form>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>