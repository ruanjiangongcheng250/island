const requireDirectory = require('require-directory');
const Router = require('koa-router');
const exceptions = require('./http-exception')
class InitManager{
    static InitCore(app){
        InitManager.InitRouters(app);
        InitManager.loadConfig();
        InitManager.LoadException();
    }

    static InitRouters(app){
        const routerPath = `${process.cwd()}/app/api`;
        requireDirectory(module, routerPath, {
            visit: whenModuleLoad
        });
        
        function whenModuleLoad (obj) {
            if(obj instanceof Router){
                app.use(obj.routes())
            }
        } 
    }

    static loadConfig(path=''){
        const configPath = path || `${process.cwd()}/config/config`;
        const config = require(configPath); 
        global.config = config;
    }

    static LoadException() {
        global.errs = exceptions
    }

}
module.exports =  InitManager;