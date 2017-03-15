<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include 'common/autoload.php';
$orderCode = CommonFunction::getGetValue('order_code');

if (!empty($orderCode)) {
    $group = new Group();
    $groupRows = $group->findByOrderCode($orderCode);
    if (!empty($groupRows)) {
        $groupRow = $groupRows[0];
        $groupCode = $groupRow['code'];
    }

}

//do not get the get or post any more, use order_code instead
if (empty($groupCode)) {
    $groupCode = CommonFunction::getGetValue('groupCode');

    if (empty($groupCode)) {
        //try post
        $groupCode = CommonFunction::getPostValue('groupCode');
    }
}

$group = null;
if (!empty($groupCode)) {
    $group = new Group();
    $groupRows = $group->findByGroupCode($groupCode);
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
    <!--    <meta http-equiv="refresh" content="10" />-->
    <title>Đặt cơm</title>
    <link rel="shortcut icon" type="image/x-icon" href="/view/images/foods.png"/>
    <link rel="image_src" href="/view/images/foods.png">

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

        #order_menu.fixed-column {
            z-index: 1000;
        }

        .DATCOM_RunOnMobile_Mode .mobile_button {
            display: block !important;
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
                <a class="navbar-brand hidden" href="<?= ROOT_URL . '/mobile/?order_code=' . $group['order_code'] ?>"><span class="fa fa-mobile"></span></a>
            </div>
        </div>
    </nav>

    <div class="col-lg-12" style="clear: both">
        <?php if (!empty($group)): ?>
            <label style="text-align: left; font-size: 22px;"><?= $group["name"] ?></label>
        <?php endif; ?>
        <!-- do not used any more -->
        <!--
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
        -->
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
                <th style="background: white;min-width: 200px;">Thực đơn</th>
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
                    <div class="col-sm-10 col-sm-offset-1">
                        <form class="form-horizontal">
                            <div class="navbar-form">
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_emptyPasswordMessage">Xin nhập mật khẩu</p>
                                <p class="col-sm-offset-2 text-danger hidden confirmPassword_invalidPasswordMessage">Mật khẩu không đúng</p>
                            </div>
                            <div class="navbar-form">
                                <label class="control-label">Mật khẩu:</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><span class="fa fa-lock"></span></div>
                                    <input id="confirmPassword_Password" type="password" class="form-control"
                                           name="password"
                                           placeholder="Nhập mật khẩu" value="">
                                    <span class="input-group-btn"><button type="button" id="confirmPassword_BtnConfirm"
                                                                          name="selectGroup" value="submit"
                                                                          class="btn btn-primary"
                                                                          autocomplete="off">Xác nhận
                                        </button> </span>
                                </div>
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
    function checkAndAddMobileClass() {
        if (checkMobile()) {
            $('body').addClass('DATCOM_RunOnMobile_Mode');
        }
    }

    function checkMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    $(document).ready(function() {
        checkAndAddMobileClass();
        $('body').addClass('DATCOM_RunOnMobile_Mode');
    });
</script>
</body>
</html>