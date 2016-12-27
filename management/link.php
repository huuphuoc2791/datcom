
<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include_once '../common/autoload.php';


//change: this page also generate the link if not exists before

$link ='';
$groupCode = CommonFunction::getPostValue('group_name');

if (!empty($groupCode)) {
    $groups = (new Group())->findByGroupCode($groupCode);
    $group = $groups[0];
    $hash = $group['hash'];

    if (empty($hash)) {
        //generate then get again
        $hash = CommonFunction::guid();
        (new Group())->updateHashByGroupId($group["id"],$hash);
    }

    //then get the order link
    $orderHash = $group['order_code'];
    if (empty($orderHash)) {
        $orderHash = Group::EncodePassword(CommonFunction::guid());
        (new Group())->updateOrderHashByGroupId($group["id"],$orderHash);
    }

    //$link = 'http://localhost/datcom/group-management/';

    $link = ROOT_URL . '/group-management/';
    $orderLink = ROOT_URL . "/$orderHash";
}

if($groupCode==''){
    $link='';
    $orderLink='';
}else{
    if($hash==null){
        $link='';
    }else{
        $link =$link.$groupCode.'/'.$hash;
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <title>Get Link</title>
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
    <h4 class="text-center">Link quản lý</h4>
</div>
<div class="col-sm-10 col-sm-offset-1">
    <form class="col-sm-6 col-sm-offset-3 form-horizontal" role="form" method="post">
        <div class="form-group">
            <label for="group_name" class="col-sm-2 control-label">Group Code</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="group_name" name="group_name" placeholder="korrin" value="">
            </div>
        </div>

        <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
                <input id="submit" name="submit" type="submit" value="Send" class="btn btn-primary">
            </div>
        </div>
    </form>
    <div class="col-sm-8 col-sm-offset-2">
        <a href="<?php echo $link ?>"> <?php echo $link ?></a><br/>
        <a href="<?php echo $orderLink ?>"> <?php echo $orderLink ?></a><br/>

    </div>
</div>
</body>
</html>