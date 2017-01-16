<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include '../common/autoload.php';
$isInvalidLink = false;
if (!isset($_GET['groupCode']) || !isset($_GET['hash'])) {
    $error = 'Invalid link';
} else {
    $groupCode = CommonFunction::getGetValue('groupCode');
    $hash = CommonFunction::getGetValue('hash');

    //check hash and group code
    $groupRows = (new Group())->findByGroupCodeAndHash($groupCode, $hash);

    if (empty($groupRows)) {
        $error = 'Invalid link';
        $isInvalidLink = true;
    } else {
        $group = $groupRows[0];
        $groupId = $group['id'];
        $groupName = $group['name'];

        //check posted data
        if (!empty($_POST)) {
            //create new link
            if (isset($_POST['changeLink'])) {
                //change link -> update database then redirect to new link
                $guid = CommonFunction::guid();
                (new Group())->updateHashByGroupId($groupId, $guid);

                header("Location: " . "/datcom/group-management/$groupCode/$guid");
                exit;
            }

            //update group
            if (isset($_POST['updateGroup'])) {
                $groupName = CommonFunction::getPostValue('groupName');
                $password = CommonFunction::getPostValue('password');
                (new Group())->updateWithoutHash($groupId, $groupName, $groupCode);

                //check if the admin change the password or not
                if (!empty($password)) {
                    $password = Group::EncodePassword($password);
                    (new Group())->updatePasswordByGroupId($groupId,$password);
                }

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
                        (new User())->update($userId, $username, $fullname, $groupId, $email, $phone);
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
                $userRows = (new User())->findByUsernameAndGroupId($username, $groupId);
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

        #groupData .input-group-addon span.fa {
            width: 14px;
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
    <?php if (!empty($error) && $isInvalidLink): ?>
        <div class="row">
            <div class="col-sm-12">
                <p class="bg-warning"><?= $error ?></p>
            </div>
        </div>
    <?php else:
        if (!empty($error)): ?>
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
        <form id="groupData" class="form-horizontal" style="margin-bottom: 10px;" method="post">
            <div class="form-group">
                <label class="col-sm-2 control-label">Mã nhóm:</label>
                <p class="form-control-static"><?= $groupCode ?></p>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Tên nhóm:</label>
                <div class="input-group col-sm-6">
                    <div class="input-group-addon"><span class="fa fa-users"></span></div>
                    <input type="text" class="form-control" name="groupName"
                           placeholder="Đổi tên nhóm" value="<?= $group['name'] ?>">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Mật khẩu:</label>
                <div class="input-group col-sm-6">
                    <div class="input-group-addon"><span class="fa fa-lock"></span></div>
                    <input type="password" class="form-control" name="password"
                           placeholder="Đổi mật khẩu (bỏ trống để bỏ qua)" value="">
                </div>
            </div>

            <div class="form-group">
                <button type="submit" name="updateGroup" value="submit" class="col-sm-offset-2 btn btn-primary"
                        autocomplete="off"><span
                        class="fa fa-floppy-o"></span>&nbsp;Lưu
                </button>

                <button type="submit" name="changeLink" value="submit" class="btn btn-primary"
                        autocomplete="off"><span
                        class="fa fa-link"></span>&nbsp;Tạo link mới
                </button>

                <a class="btn btn-success" href="<?= ROOT_URL ?>/<?= $group['order_code'] ?>"><span
                        class="fa fa-cutlery"></span>&nbsp;Đặt món
                </a>
                <a class="btn btn-success" href="<?= ROOT_URL ?>/addmenu"><span
                        class="fa fa-cutlery"></span>&nbsp;Thêm thực đơn
                </a>
                <a class="btn btn-success" href="<?= ROOT_URL ?>/group-logs/<?= $groupCode ?>/<?= $group['hash'] ?>" target="_blank"><span
                        class="fa fa-pencil-square-o"></span>&nbsp;Xem log
                </a>

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
                                    <input type="text" class="form-control" name="username"
                                           value="<?= $user['username'] ?>"
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
    <?php endif; ?>

</div>

</body>
</html>