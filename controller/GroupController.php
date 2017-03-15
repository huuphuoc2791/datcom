<?php

class GroupController extends AppController
{
    public function ViewLog() {
        if (!isset($_GET['groupCode']) || !isset($_GET['hash'])) {
            $this->data->code = 1;
            $this->data->message = 'Invalid link';
        } else {
            $groupCode = CommonFunction::getGetValue('groupCode');
            $hash = CommonFunction::getGetValue('hash');

            //check hash and group code
            $Group = new Group();
            $groupRows = $Group->findByGroupCodeAndHash($groupCode, $hash);

            if (empty($groupRows)) {
                $this->data->code = 1;
                $this->data->message = 'Invalid link';
            }
        }

        //only continue when no error occurs
        if (!empty($this->data->code)) return;


        $this->data->group = $groupRows[0];
        $Order = new Order();
        $this->data->logs = $Order->getTodayLogOrderByGroupCode($groupCode);
    }
}