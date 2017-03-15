<?php

class CommonFunction
{

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

    public static function getDayOfWeek() {
        $pTimezone = "Asia/Ho_Chi_Minh";
        $userDateTimeZone = new DateTimeZone($pTimezone);
        $UserDateTime = new DateTime("now", $userDateTimeZone);
        $offsetSeconds = $UserDateTime->getOffset();
        return gmdate("D", time() + $offsetSeconds);

    }

    public static function convertDayOfWeek() {
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

    public static function guid($hasHyphens = true, $hasBraces = false) {
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

    public static function convert_vi_to_en($str) {
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

    function compare2Items($str1, $str2) {
        if (strcmp($str1, $str2) == 0) {

        }


    }

    function contains($str) {
        $totalOfWord = explode(' ', $str);
        $sub_str = $totalOfWord[0] . " " . $totalOfWord[1] . " " . $totalOfWord[2];
        $spe_char = array("khổ qua", "rô ti", "phi lê", "bạc má", "diêu hồng", "nấu tiêu", "lúc lắc");
        foreach ($spe_char as $value) {
            if (strpos($sub_str, $value) !== false)
                return true;
        }
        return false;
    }

    //numberWord uses to split $numberWord words from MenuItem.
    public static function splitWordToSMS($str, $isChecked = true, $numberWord = 2) {
        $str = mb_strtolower($str, 'UTF-8');
        $convertViToEN = self::convert_vi_to_en($str);
        $totalOfWord = explode(' ', $convertViToEN);
        if ($isChecked == false) {
            if (self::contains($str)) {
                $result = $totalOfWord[0] . " " . $totalOfWord[1] . " " . $totalOfWord[2];
            } else {
                $result = $totalOfWord[0] . " " . $totalOfWord[1];
            }
        } else {
            $result = $totalOfWord[0] . " " . $totalOfWord[1] . " " . $totalOfWord[2];
        }

        return $result;
    }

    /***
     * this method is to create the array of one food name ['trung','chien','sao'] --> ['trung chien','sao']
     * @param $arrNames
     * @return the array includes the merge names
     */
    public static function updateArrayOneFoodInDictionary($arrNames) {
        $dictionary = array('ba roi', 'kho qua', 'bac ma', 'cu sen', 'phi le', 'dieu hong');

        //copy to new array
        $newNames = array();
        foreach ($arrNames as $arrName) {
            $newNames[] = $arrName;
        }

        foreach ($dictionary as $dictionaryName) {
            $countWords = count(explode(' ', $dictionaryName));

            $i = 0;
            while ($i <= count($newNames) - 1 - $countWords) {
                $checkedName = '';
                for ($j = 0; $j < $countWords; $j++) {
                    $checkedName .= $arrNames[$i + $j] . ' ';
                }
                $checkedName = trim($checkedName);

                if ($checkedName == $dictionaryName) {
                    //update the array
                    $newNames[$i] = $checkedName;
                    for ($k = $i + 1; $k <= count($newNames) - 1 - $countWords; $k++) {
                        $newNames[$k] = $newNames[$k + $countWords - 1];
                    }

                    for ($m = 1; $m <= $countWords - 1; $m++) {
                        unset($newNames[count($newNames) - 1]);
                    }
                } else {
                    $i++;
                }
            }
        }

        return $newNames;

    }

    public static function splitWordToSMSWithCount($str, $count = 2) {
        $str = mb_strtolower($str, 'UTF-8');
        $convertViToEN = self::convert_vi_to_en($str);
        $totalOfWord = explode(' ', $convertViToEN);

        $totalOfWord = self::updateArrayOneFoodInDictionary($totalOfWord);

        $result = '';
        for ($i = 0; $i < $count; $i++) {
            $result .= $totalOfWord[$i] . ' ';
        }

        $result = trim($result);

        return $result;
    }

    public static function vnToUpper($str) {
        $BASIC_String = new BASIC_String();
        return $BASIC_String->upper($str);
    }

    public static function vnToLower($str) {
        $BASIC_String = new BASIC_String();
        return $BASIC_String->lower($str);
    }

    /***
     * @param $names the list of the full name
     * @return the short name following the business: try with 2 words. Then if 2 or more names are still the same, work on that
     */
    public static function createMenuShortName($names, $count = null) {
        if (empty($count)) $count = 2;
        $newNames = array();
        foreach ($names as $name) {
            $newNames[] = CommonFunction::splitWordToSMSWithCount($name, $count);
        }

        //travel the name if any duplicate
        for ($i = 0; $i < count($names); $i++) {
            $duplicateNeedChangeIndexes = array();
            $duplicateNeedChangeNames = array();
            for ($j = $i + 1; $j < count($names); $j++) {
                if ($newNames[$j] == $newNames[$i]) {
                    $duplicateNeedChangeIndexes[] = $j;
                    $duplicateNeedChangeNames[] = $names[$j];
                }
            }

            if (!empty($duplicateNeedChangeIndexes)) {
                //has duplicate, start change it
                $newChangedDuplicateNames = self::createMenuShortName($duplicateNeedChangeNames, $count + 1);
                for ($k = 0; $k < count($newChangedDuplicateNames); $k++) {
                    $newNames[$duplicateNeedChangeIndexes[$k]] = $newChangedDuplicateNames[$k];
                }
            }
        }

        return $newNames;
    }
}

/*
Copyright phpbasic.com
Vui lòng ghi rõ nguồn: www.phpasic.com, khi sử dụng lại hàm này
*/

class BASIC_String
{
    var $lower = 'a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|đ|é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|í|ì|ỉ|ĩ|ị|ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|ý|ỳ|ỷ|ỹ|ỵ';
    var $upper = 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|Đ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ|Í|Ì|Ỉ|Ĩ|Ị|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Ý|Ỳ|Ỷ|Ỹ|Ỵ';
    var $arrayUpper;
    var $arrayLower;

    function __construct() {
        $this->arrayUpper = explode('|', preg_replace("/\n|\t|\r/", "", $this->upper));
        $this->arrayLower = explode('|', preg_replace("/\n|\t|\r/", "", $this->lower));
    }

    function lower($str) {
        return str_replace($this->arrayUpper, $this->arrayLower, $str);
    }

    function upper($str) {
        return str_replace($this->arrayLower, $this->arrayUpper, $str);
    }
}