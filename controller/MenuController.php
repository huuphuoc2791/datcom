<?php
class MenuController extends BaseController {
    public function __construct() {
        if (!defined('COM_NHA_VIET_URL')) {
            define('COM_NHA_VIET_URL','http://comnhaviet.net/');
//            define('COM_NHA_VIET_URL','http://comnhaviet.net/thuc-don/danh-muc/thu-hai-584.html');
//            define('COM_NHA_VIET_URL','http://comnhaviet.net/thuc-don/danh-muc/thu-ba-579.html');

        }
    }

    public function GetMenuFromComNhaViet() {
        $page = file_get_contents(COM_NHA_VIET_URL);

        $separator = '<div class="menutheongay';
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

    /***
     * check if menu of today is loaded or not:
     *  if not -> load from comnhaviet, this is also to clear the old data of the users
     *  if yes -> do nothing but load the menu from database
     *
     * change: do not need to load the menu from database, this function is only to update the menu (load from comnhaviet then insert if needed)
     */
    public function CheckAndUpdateMenuForToday()
    {
        //check if today is loaded or not
        $Menu = new Menu();
        $logRows = $Menu->getLogsForToday();
        $returnMessage = new ResponseMessage();

        if (empty($logRows)) {
            //not load today --> load then insert log
            $extraPrice = '25000';
            $price = '30000';
            $day = CommonFunction::convertDayOfWeek();

            //change: do not use menu from client, use from server
            $menuNames = $this->GetMenuFromComNhaViet();

            $menuItems = array();
            foreach ($menuNames as $menuName) {
                $item = new stdClass();
                $item->menuName = $menuName;
                $item->price = $price;

                $menuItems[] = $item;
            }

            $Menu->deleteAll();
            $result = array();
            $i = 1;
            foreach ($menuItems as $item) {
                $Menu->insertAll($i, $item->menuName, $day, $item->price, $extraPrice);
                $i++;
            }

            $Order = new Order();
            $Order->deleteAll();

            $Menu->insertLoadedLogsForToday();
        }
        return;


    }

    public function LoadMenuForToday() {
        $Menu = new Menu();
        $returnMessage = new ResponseMessage();

        $menuRows = $Menu->findAll();

        $names = array();
        foreach ($menuRows as &$menuItem) {
            $names[] = $menuItem['food_name'];
        }

        $names = CommonFunction::createMenuShortName($names);
        $index = 0;
        foreach ($menuRows as &$menuItem) {
            $menuItem['short_food_name'] = $names[$index++];
        }


        if (empty($menuRows)) $menuRows = array();
        $returnMessage->data->menuItems = $menuRows;

        return $returnMessage;
    }
}