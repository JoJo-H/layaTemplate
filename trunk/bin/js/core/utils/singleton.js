var core;
(function (core) {
    var _singletonMap = {};
    /**
     * 返回指定分类的类型单例
     * @param clz 单例化的类型
     * @returns {any} 单例对象
     */
    function singleton(clz) {
        let name = clz.name;
        if (!name || name == "") {
            core.logerror("不能单例化没有name属性的类");
            return null;
        }
        //使用ecma6特性的symbol类型,Symbol.for(key),获取symbol类型，不存在则新建
        let symbol = Symbol.for(name);
        if (!_singletonMap.hasOwnProperty(symbol)) {
            _singletonMap[symbol] = new clz();
        }
        return _singletonMap[symbol];
    }
    core.singleton = singleton;
    /**
     * 返回指定分类的类型单例
     * @param clz 单例化的类型
     * @param type 分类名称
     * @returns {any} 单例对象
     */
    function typeSingleton(clz, type) {
        let clzName = clz.name;
        if (!clzName || clzName == "") {
            core.logerror("不能单例化没有name属性的类");
            return null;
        }
        let name = type + clzName;
        let symbol = Symbol.for(name);
        if (!_singletonMap.hasOwnProperty(symbol)) {
            _singletonMap[symbol] = new type();
        }
        return _singletonMap[symbol];
    }
    core.typeSingleton = typeSingleton;
    /**
     * 获取所有的单例模式
     */
    function getAllSingleton() {
        return _singletonMap;
    }
    core.getAllSingleton = getAllSingleton;
    // /**
    //  * 返回指定类型的单例
    //  * @includeExample singleton.ts
    //  * @param type 需要单例化的类型
    //  * @returns {any} 类型的单例
    //  */
    // export function singleton<T>(type:{ new(): T ;}):T {
    //     var typeId = getTypeId(type);
    //     if (!_singletonMap.hasOwnProperty(typeId)) {
    //         _singletonMap[typeId] = new (<any>type)();
    //     }
    //     return <any>_singletonMap[typeId];
    // }
    // /**
    //  * 返回指定分类的类型单例
    //  * @param name 分类名称
    //  * @param type 单例化的类型
    //  * @includeExample typesingleton.ts
    //  * @returns {any} 单例对象
    //  */
    // export function typeSingleton<T>(name:string, type:{ new(): T; }):T {
    //     var typeId = name + getTypeId(type);
    //     if (!_singletonMap.hasOwnProperty(typeId)) {
    //         _singletonMap[typeId] = new (<any>type)();
    //     }
    //     return <any>_singletonMap[typeId];
    // }
})(core || (core = {}));
//# sourceMappingURL=singleton.js.map