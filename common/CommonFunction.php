<?php

class CommonFunction
{

    //function chinh de tao session ban dau
    public static function getPostValue($name)
    {
        if (isset($_POST[$name])) return $_POST[$name];
        return "";
    }

    public static function getGetValue($name)
    {
        if (isset($_GET[$name])) return $_GET[$name];
        return "";
    }

    public static function GetSessionValue($name)
    {
        if (isset($_SESSION[$name])) return $_SESSION[$name];
        return NULL;
    }

    public static function CheckPostSend()
    {
        return count($_POST) != 0;
    }

    public static function CheckGetSend()
    {
        return count($_GET) != 0;
    }

    public static function getDayOfWeek()
    {
        $pTimezone = "+7";
        $userDateTimeZone = new DateTimeZone($pTimezone);
        $UserDateTime = new DateTime("now", $userDateTimeZone);

        $offsetSeconds = $UserDateTime->getOffset();
        //echo $offsetSeconds;

        return gmdate("D", time() + $offsetSeconds);

    }

    public static function convertDayOfWeek()
    {
        $DayOfWeek = array(
            "Mon" => "Thứ 2",
            "Tue" => "Thứ 3",
            "Wed" => "Thứ 4",
            "Thu" => "Thứ 5",
            "Fri" => "Thứ 6",
            "Sat" => "Thứ 7",
            "Sun" => "Chủ nhật"
        );
        $day = CommonFunction::getDayOfWeek();

        return $DayOfWeek[$day];

    }

}