/**
 * 项目配置
 */
declare class ExtConfig{
    /**客户端地址 */
    static res_path:string; 
    /**登录服地址 */
    static net_host:string;
    /**日志等级 */
    static LOG_LEVEL:number;
    /**是否调试 */
    static RELEASE:boolean;
    /**是否版署 */
    static BANSHU:boolean;
     /**外部参数 */
    static platparam:any;
    /**错误上报地址 */
    static reportErrorUrl:string;
}