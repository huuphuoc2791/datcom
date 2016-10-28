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
        $pTimezone = "Asia/Ho_Chi_Minh";
        $userDateTimeZone = new DateTimeZone($pTimezone);
        $UserDateTime = new DateTime("now", $userDateTimeZone);
        $offsetSeconds = $UserDateTime->getOffset();
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
        $str = mb_strtolower($str);
        $convertViToEN = self::convert_vi_to_en($str);
        $totalOfWord = explode(' ', $convertViToEN);
        $result = $totalOfWord[0] . " " . $totalOfWord[1];
        return $result;
    }

    public static function vnToUpper($str) {
        return (new BASIC_String())->upper($str);
    }
    public static function vnToLower($str) {
        return (new BASIC_String())->lower($str);
    }
}

/*
Copyright phpbasic.com
Vui lòng ghi rõ nguồn: www.phpasic.com, khi sử dụng lại hàm này
*/
class BASIC_String {
    var $lower = 'a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|đ|é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|í|ì|ỉ|ĩ|ị|ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|ý|ỳ|ỷ|ỹ|ỵ';
    var $upper = 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|Đ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ|Í|Ì|Ỉ|Ĩ|Ị|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Ý|Ỳ|Ỷ|Ỹ|Ỵ';
    var $arrayUpper;
    var $arrayLower;
    function __construct(){
        $this->arrayUpper = explode('|',preg_replace("/\n|\t|\r/","",$this->upper));
        $this->arrayLower = explode('|',preg_replace("/\n|\t|\r/","",$this->lower));
    }

    function lower($str){
        return str_replace($this->arrayUpper,$this->arrayLower,$str);
    }
    function upper($str){
        return str_replace($this->arrayLower,$this->arrayUpper,$str);
    }
}