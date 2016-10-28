<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include 'common/autoload.php';
$groupCode = CommonFunction::getGetValue('groupCode');

if (empty($groupCode)) {
    //try post
    $groupCode = CommonFunction::getPostValue('groupCode');
}

$group = null;
if (!empty($groupCode)) {
    $groupRows = (new Group())->findByGroupCode($groupCode);
    if (!empty($groupRows)) {
        $group = $groupRows[0];
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
    <link rel="shortcut icon" type="image/x-icon" href="/datcom/view/images/foods.png"/>
    <link rel="image_src" href="/datcom/view/images/foods.png">

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

        #order_menu.table-striped > tbody > tr:nth-of-type(odd),
        #summary_menu.table-striped > tbody > tr:nth-of-type(odd) {
            background-color: rgb(214, 231, 244);
        }

        #order_menu.table-striped > tbody > tr:nth-of-type(even),
        #summary_menu.table-striped > tbody > tr:nth-of-type(even) {
            background-color: white;
        }

        #summary_menu tr.summary_order_menu_total {
            background-color: white !important;
        }

        .table-responsive > .fixed-column {
            position: absolute;
            display: inline-block;
            width: auto;
            border-right: 1px solid #ddd;
        }

        @media (min-width: 768px) {
            .table-responsive > .fixed-column {
                display: none;
            }
        }

        #order_menu.fixed-column thead tr {
            height: 31px !important;
        }

        .confirmPasswordPopup_emptyPassword .confirmPassword_emptyPasswordMessage,
        .confirmPasswordPopup_invalidPassword .confirmPassword_invalidPasswordMessage {
            display: inherit !important;
        }

        .requestGroupPopup_emptyGroup .confirmPassword_emptyGroupMessage,
        .confirmPasswordPopup_existedGroupCode .confirmPassword_existGroupMessage,
        .confirmPasswordPopup_validGroupCode .confirmPassword_validGroupMessage
        {
            display: inherit !important;
        }

        .message_error_data.message_no_member_mode,
        .message_error_data.message_no_group_mode {
            display: inherit !important;
        }

        .message_error_data.message_no_member_mode .message_no_member {
            display: inherit !important;
        }

        .message_error_data.message_no_group_mode .message_no_group {
            display: inherit !important;
        }
    </style>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.js"></script>
    <!-- Bootstrap JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>

    <script src="common/common.js?<?= Production_Version ?>"></script>
    <script src="view/js/DC.Config.js?<?= Production_Version ?>"></script>
    <script src="view/js/DC.Data.Common.js?<?= Production_Version ?>"></script>
    <script src="view/js/DC.Data.js?<?= Production_Version ?>"></script>
    <script src="view/js/RequestMessage.js?<?= Production_Version ?>"></script>

    <!-- js of page(s) -->
    <script>
        //assign group code here
        GROUP_CODE = '<?= $groupCode ?>';
    </script>
    <script src="view/js/index.js?<?= Production_Version ?>"></script>
</head>
<body>
<div class="container">
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="/"
                   style="font-weight: bold; font-size: 25px;">Trang đặt cơm</a>
            </div>
        </div>
    </nav>

    <div class="col-lg-12" style="clear: both">
        <?php if (!empty($group)): ?>
            <label style="text-align: left; font-size: 22px;"><?= $group["name"] ?></label>
        <?php endif; ?>
        <form class="navbar-form navbar-right" role="search" method="post" action="/datcom/">
            <div class="input-group form-group">
                <div class="input-group-addon"><span class="fa fa-users"></span></div>

                <input type="text" class="form-control" name="groupCode"
                       placeholder="Chọn mã nhóm" value="<?= $groupCode ?>">
                <span class="input-group-btn">
         <button type="submit" name="selectGroup" value="submit" class="btn btn-primary"
                 autocomplete="off" <span class="fa fa-check"></span>&nbsp;Chọn
                    </button>
      </span>
            </div>

        </form>
    </div>
    <div style="clear: both"></div>
    <div class="row message_error_data" style="display: none; margin-bottom: 10px;">
        <div class="col-sm-10 message_no_group" style="display: none;">
            Nhóm chưa được tạo, xin hãy
            <button type="button" name="requestGroup" class="btn btn-link" style="padding: 0;">tạo yêu cầu</button>
        </div>
        <div class="col-sm-10 message_no_member" style="display: none;">
            Nhóm chưa có thành viên. Xin vui lòng cập nhật.
        </div>
    </div>

    <div class="table-responsive">
        <table id="order_menu" class="table table-striped table-bordered table-hover table-condensed">
            <thead>
            <tr>
                <th style="background: white;">Thực đơn</th>
                <th style="text-align: center;" class="price_header">Giá</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>

    <div style="clear: both"></div>

    <div class="row">
        <button id="resetOrdered" type="button" class="btn btn-primary" style="margin-left: 15px">Tạo lại</button>
    </div>
    <div style="clear: both;height: 10px;"></div>
    <label for="exampleInputName2" style="font-size: 20px; font-weight: bold">Tổng hợp</label>
    <div style="clear: both"></div>

    <div class="table-responsive">
        <table id="summary_menu" class="table table-striped table-bordered">
            <thead>
            <tr>
                <th colspan="2">Thực đơn</th>
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
    <div class="row">
        <button id="showSmsPopup" type="button" class="btn btn-primary"
                style="margin-left: 15px;margin-bottom: 15px;">Xem tin nhắn
        </button>
    </div>
</div>

<!-- modal of message -->
<!-- Modal -->
<div id="smsPopup" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Tin nhắn</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <p id="sms_content" style="margin-left: 10px;"></p>
                </div>
                <div class="row">
                    <img id="smsQrCode"
                         style="width: 300px;height: 300px;display: block; margin-left: auto; margin-right: auto;"/>
                </div>
            </div>
            <div class="modal-footer form-inline">
                <button id="btnCopyToClipboard" class="btn btn-default" onclick="copyToClipboard('#sms_content')">Copy
                </button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
            </div>
        </div>

    </div>
</div>

<div id="confirmPasswordPopup" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Bạn muốn tạo lại?</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-12">
                        <form class="form-horizontal" style="margin-bottom: 10px;">
                            <div class="form-group">
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_emptyPasswordMessage">Xin nhập mật khẩu</p>
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_invalidPasswordMessage">Mật khẩu không đúng</p>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Mật khẩu:</label>
                                <div class="input-group col-sm-4">
                                    <div class="input-group-addon"><span class="fa fa-lock"></span></div>
                                    <input id="confirmPassword_Password" type="password" class="form-control"
                                           name="password"
                                           placeholder="Nhập mật khẩu" value="">
                                </div>
                            </div>

                            <div class="form-group">
                                <button type="button" id="confirmPassword_BtnConfirm" name="selectGroup" value="submit"
                                        class="col-sm-offset-2 btn btn-primary"
                                        autocomplete="off"><span
                                        class="fa fa-floppy-o"></span>&nbsp;Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer form-inline">
                <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
            </div>
        </div>

    </div>
</div>
<div id="requestGroupPopup" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Nhập thông tin nhóm</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-12">
                        <form class="form-horizontal" style="margin-bottom: 10px;">
                            <div class="form-group">
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_emptyGroupMessage">Xin nhập mã nhóm</p>
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_existGroupMessage">Mã nhóm đã tồn tại</p>
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_validGroupMessage">Mã nhóm hợp lệ. Quét mã và gửi tin nhắn</p>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Mã nhóm:</label>
                                <div class="input-group col-sm-4">
                                    <div class="input-group-addon"><span class="fa fa-users"></span></div>
                                    <input id="requestGroup_GroupCode" type="text" class="form-control"
                                           name="groupCode"
                                           placeholder="Nhập mã nhóm" value="">
                                </div>
                            </div>

                            <div class="form-group">
                                <button type="button" id="requestGroup_BtnConfirm" name="selectGroup" value="submit"
                                        class="col-sm-offset-2 btn btn-primary"
                                        autocomplete="off"><span
                                        class="fa fa-floppy-o"></span>&nbsp;Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row">
                    <img id="smsQrCode_RequestGroup"
                         style="width: 300px;height: 300px;display: block; margin-left: auto; margin-right: auto;"/>
                </div>
            </div>
            <div class="modal-footer form-inline">
                <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
            </div>
        </div>

    </div>
</div>
<script>

</script>
</body>
</html>