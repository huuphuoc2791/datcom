<?php
class MenuController extends BaseController {
    public function __construct() {
        if (!defined('COM_NHA_VIET_URL')) {
            define('COM_NHA_VIET_URL','http://comnhaviet.net/');
        }
    }

    public function GetMenuFromComNhaViet() {
        $page = file_get_contents(COM_NHA_VIET_URL);

        $separator = '<div class="menutheongay"';
        $menuToEnd = explode($separator, $page)[1];

        $separator = '<div style="clear:both"></div>';

        $menuElements = explode($separator, $menuToEnd)[0];

        $separator = '<div class="monan">';
        $menuElements = explode($separator, $menuElements);

        $menuItems = array();

        //dot get the first item
        for ($i=1;$i<count($menuElements); $i++) {
            $menuItems[] = $this->getMenuItemFromText($menuElements[$i]);
        }

        return $menuItems;
    }

    private function getMenuItemFromText($menuText) {
        $separator = '<a ';
        $menuToEnd = explode($separator, $menuText)[1];
        $separator = '>';
        $menuData = explode($separator, $menuToEnd)[0];

        $separator = 'data-title="';
        $menuNameToEnd = explode($separator, $menuData)[1];

        $separator = 'href=';
        $menuName = explode($separator, $menuNameToEnd)[0];

        $menuName = trim($menuName);
        $menuName = trim($menuName,'"');
        $menuName = CommonFunction::vnToUpper(substr($menuName,0,1)) . CommonFunction::vnToLower(substr($menuName,1));
        return $menuName;
    }
}