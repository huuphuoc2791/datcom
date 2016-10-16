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

    public static function guid($hasHyphens = true, $hasBraces = false)
    {
        if (function_exists('com_create_guid')) {
            return com_create_guid();
        } else {
            mt_srand((double)microtime() * 10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = $hasHyphens ? chr(45) : '';// "-"
            $braceStart = $hasBraces ? chr(123) : '';
            $braceEnd = $hasBraces ? chr(125) : '';
            if ($hasHyphens == false) {
                $hyphen = '';
            }
            $uuid = $braceStart// "{"
                . substr($charid, 0, 8) . $hyphen
                . substr($charid, 8, 4) . $hyphen
                . substr($charid, 12, 4) . $hyphen
                . substr($charid, 16, 4) . $hyphen
                . substr($charid, 20, 12)
                . $braceEnd;// "}"
            return $uuid;
        }
    }

    public static function convert_vi_to_en($str)
    {
        $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
        $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
        $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
        $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
        $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
        $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
        $str = preg_replace("/(đ)/", 'd', $str);
        $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
        $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
        $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
        $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
        $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
        $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
        $str = preg_replace("/(Đ)/", 'D', $str);
        return $str;

    }

    public static function splitWordToSMS($str)
    {
        $str=strtolower($str);
        $convertViToEN = self::convert_vi_to_en($str);
        $totalOfWord = explode(' ', $convertViToEN);
        $result =$totalOfWord[0]." ".$totalOfWord[1]." ".$totalOfWord[2];
        return $result;
    }
}