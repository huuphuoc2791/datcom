<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include '../common/autoload.php';
$controller = new GroupController('ViewLog');
$controller->doAction();

$devices = array();

if (!empty($controller->data->logs)) {
    foreach ($controller->data->logs as $log) {
        if (array_key_exists($log['device_guid'], $devices) == false) $devices["{$log['device_guid']}"] = 0;
        $devices["{$log['device_guid']}"]++;
    }
}

?>
<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Quản lí nhóm - Xem log</title>

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

    <!-- js of page(s) -->
    <script>
        //assign group code here
        GROUP_CODE = '<?= $controller->data->group['code'] ?>';
        GROUP_HASH = '<?= $controller->data->group['hash'] ?>';
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
                <a class="navbar-brand"
                   style="font-weight: bold; font-size: 25px;">Lịch sử đặt cơm - <?= $controller->data->group['name'] ?></a>
            </div>
        </div>
    </nav>
    <div style="clear: both"></div>
    <?php if (!empty($controller->data->code)): ?>
        <div class="row">
            <div class="col-sm-12">
                <p class="bg-warning"><?= $controller->data->message ?></p>
            </div>
        </div>
    <?php else: ?>
        <?php if (empty($controller->data->logs)): ?>
            <div class="row">
                <div class="col-sm-12">
                    <p class="bg-warning">Chưa có ghi nhận đặt cơm trong ngày</p>
                </div>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table id="logs" class="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>Thiết bị</th>
                        <th>Giờ đặt</th>
                        <th>Tài khoản</th>
                        <th>Món chính</th>
                        <th>Món phụ</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php
                    $currentDevice = '';
                    foreach ($controller->data->logs as $log): ?>
                        <tr>
                            <?php if ($log['device_guid'] != $currentDevice):
                                $currentDevice = $log['device_guid'];
                                ?>
                                <td rowspan="<?= $devices["{$log['device_guid']}"] ?>"><?= $log['device_guid'] ?></td>
                            <?php endif; ?>
                            <td><?= $log['order_time'] ?></td>
                            <td><?= $log['user_name'] ?></td>
                            <td><?= $log['main_menu_name'] ?></td>
                            <td><?= $log['sub_menu_names'] ?></td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>
</body>
</html>