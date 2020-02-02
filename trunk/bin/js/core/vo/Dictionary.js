/**
 * 字典型的数据存取类。
 */
class Dictionary {
    constructor() {
        this.m_keys = [];
        this.m_values = [];
    }
    get length() {
        return this.m_keys.length;
    }
    /**
     * 获取所有的子元素列表。
     */
    get values() {
        return this.m_values.concat();
    }
    /**
     * 获取所有的子元素键名列表。
     */
    get keys() {
        return this.m_keys.concat();
    }
    /**
     * 获取指定对象的键名索引。
     * @param	key 键名对象。
     * @return 键名索引。
     */
    indexOfKey(key) {
        return this.m_keys.indexOf(key);
    }
    indexOfValue(val) {
        return this.m_values.indexOf(val);
    }
    /**
     * 通过value得到对应的key
     */
    getKeyByValue(value) {
        return this.m_keys[this.indexOfValue(value)];
    }
    /**
     * 添加指定键名的值。
     * @param	key 键名。
     * @param	value 值。
     */
    add(key, value) {
        var index = this.indexOfKey(key);
        if (index >= 0) {
            this.m_values[index] = value;
        }
        else {
            this.m_keys.push(key);
            this.m_values.push(value);
        }
    }
    /**
     * 返回指定键名的值。
     * @param	key 键名对象。
     * @return 指定键名的值。
     */
    get(key) {
        var index = this.indexOfKey(key);
        if (index >= 0) {
            return this.m_values[index];
        }
        return null;
    }
    /**
     * 移除指定键名的值。
     * @param	key 键名对象。
     * @return 是否成功移除。
     */
    remove(key) {
        var index = this.indexOfKey(key);
        if (index >= 0) {
            this.m_keys.splice(index, 1);
            return this.m_values.splice(index, 1)[0];
        }
        return null;
    }
    /**
     * 清除此对象的键名列表和键值列表。
     */
    clear() {
        this.m_keys.length = 0;
        this.m_values.length = 0;
    }
    /**
     * 随机获取一条数据
     */
    getRandomData() {
        var index = Math.random() * this.keys.length << 0;
        return this.m_values[index];
    }
}
//# sourceMappingURL=Dictionary.js.map