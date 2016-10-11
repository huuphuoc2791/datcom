<?php

class CommonFunction {

    //function chinh de tao session ban dau
    public static function getPostValue($name) {
        if (isset($_POST[$name])) return $_POST[$name];
        return "";
    }

    public static function getGetValue($name) {
        if (isset($_GET[$name])) return $_GET[$name];
        return "";
    }

    public static function GetSessionValue($name) {
        if (isset($_SESSION[$name])) return $_SESSION[$name];
        return NULL;
    }

    public static function CheckPostSend() {
        return count($_POST) != 0;
    }

    public static function CheckGetSend() {
        return count($_GET) != 0;
    }
}