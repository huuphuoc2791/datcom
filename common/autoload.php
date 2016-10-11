<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../'. PATH_SEPARATOR . '../../../');

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
                'Database' => 'common/DBHelper.php',

                /*--- Model ---*/
                'Model' => 'model/Model.php',

                /*--- controller ---*/
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