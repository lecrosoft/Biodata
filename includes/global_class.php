<?php

use GlobalClass as GlobalGlobalClass;

class GlobalClass
{
    public static function fetchAll($data)
    {
        $sql = self::findThisQuery($data);
        return $sql;
    }
    public static function findThisQuery($sql)
    {
        global $db;
        $query = $db->query($sql);
        return $query;
    }
    public static function getColumn($columnName, $table)
    {
        global $db;
        $sql = "SELECT $columnName from $table";
        $query = $db->query($sql);
        $row = mysqli_fetch_assoc($query);
        $column = $row[$columnName];
        return $column;
    }
}
$global = new GlobalClass();
