<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../'. PATH_SEPARATOR . '../../../');
include_once ('environment.php');
include_once ('constants.php');

// @codingStandardsIgnoreFile
// @codeCoverageIgnoreStart
// this is an autogenerated file - do not edit
spl_autoload_register(
    function ($class) {
        static $classes = null;

        if ($classes === null) {
            $classes = array(
                /*--- Common ---*/
                'CommonFunction' => 'common/CommonFunction.php',
                'ResponseMessage' => 'common/ResponseMessage.php',
                'DBHelper' => 'common/DBHelper.php',
                
                /*--- Model ---*/
                'Menu' => 'model/Menu.php',
                'User' => 'model/User.php',
                'Group' => 'model/Group.php',
                'Order' => 'model/Order.php',

                /*--- controller ---*/
                'AppController' => 'controller/AppController.php',
                'BaseController' => 'controller/BaseController.php',
                'MenuController' => 'controller/MenuController.php',
                'GroupController' => 'controller/GroupController.php',
            );
        }
        $cn = trim($class);
        if (isset($classes[$cn])) {
            require_once $classes[$cn];
        }
    },
    true,
    false
);