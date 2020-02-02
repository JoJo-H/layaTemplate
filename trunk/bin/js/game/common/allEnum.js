/**时间常数 */
var TimeEnum;
(function (TimeEnum) {
    /**一天的秒数*/
    TimeEnum[TimeEnum["ONE_DAY_SEC"] = 86400] = "ONE_DAY_SEC";
    /**一天的毫秒 */
    TimeEnum[TimeEnum["ONE_DAY_MILSEC"] = 86400000] = "ONE_DAY_MILSEC";
})(TimeEnum || (TimeEnum = {}));
/** 星期x */
var WeekNum;
(function (WeekNum) {
    WeekNum[WeekNum["Sun"] = 0] = "Sun";
    WeekNum[WeekNum["Mon"] = 1] = "Mon";
    WeekNum[WeekNum["Tue"] = 2] = "Tue";
    WeekNum[WeekNum["Wed"] = 3] = "Wed";
    WeekNum[WeekNum["Thu"] = 4] = "Thu";
    WeekNum[WeekNum["Fri"] = 5] = "Fri";
    WeekNum[WeekNum["Sat"] = 6] = "Sat";
})(WeekNum || (WeekNum = {}));
//# sourceMappingURL=allEnum.js.map