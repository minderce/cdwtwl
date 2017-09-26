var express = require('express');
var db = require('../models');

var config = require('../config.json')[process.env.NODE_ENV || 'development'];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db);
var tools = require('../utils/tools');
var router = express.Router();
var pagesize=10;
router.get("/*", auth);
router.post("/*", auth);
/*
* 菜单列表
* */
router.get("/menu.html", auth, function(req, res){

    db.sequelize.query("select * from menu where id in(select m_id from role where type = " + req.session.user.role_id + "  group by m_id) or pid = 0 ").spread(function (entity) {

        res.json({
            menu: entity
        });
    });
});
/*登陆 start*/
router.get('/',  function (req, res) {

    res.render('login');
});
router.get('/index.html',  function (req, res) {
    res.render('index');
});

/*
* 用户列表
* */
router.all("/user-list.html", auth, function(req, res) {
    if (tools.isGET(req)) {
        res.render('user/list');
    }else if(tools.isPOST(req)){
        var curr_page = req.body['page'] || 1,
            _where=" user_stat>=0",
            search=req.body['userName'];
        if(search){
            _where+=" and username like '%"+search+"%'";
        }
        pagesize=req.body['pageSize'] || pagesize;
        var params={
            table:"users",
            fields:"id,username,tel,email,role_name,user_stat,create_time",
            where:_where,
            order:"",
            currPage:curr_page,
            pageSize:pagesize,
            search:req.query['search'],
            res:res
        };

        tools.page(params);
    }
});

/**
 * 新增用户
 * */
router.post("/user-edit.html", function(req, res){
    var body = tools.pojo(req.body,["username","passwords","user_stat","tel","email","role_name","role_id"]);
    body.passwords = tools.md5(body.passwords);
    try{
        db.Users.create(body).then(function (entity) {
            res.json({status:tools.SUCCESS, msg:"编辑成功"});
        });
    }catch (e){
        res.json({status:tools.ERROR, msg:"编辑失败"+e.message});
    }

});

/**
 * 修改用户
 * */
router.all("/user-modify.html", function(req, res){
    var id = req.body["Id"] || req.query["id"];
    db.Users.find({where: {Id: id}}).then(function (entity) {
        if (tools.isGET(req)) {
            res.json({entity:entity});
        }else if(tools.isPOST(req)){
            try{
                var body = tools.pojo(req.body,["Id","username","user_stat","tel","email","role_name","role_id"]);
                var pwd = req.body["passwords"];
                if(pwd != ""){
                    body.passwords = tools.md5(pwd);
                }
                entity.updateAttributes(body).then(function () {
                    res.json({status:tools.SUCCESS, msg:"编辑成功"});
                });
            }catch (e){
                console.error(e.message);
                res.json({status:tools.ERROR, msg:"编辑失败"+e.message});
            }

        }
    });

});

/**
 * 删除用户
 * */
router.post("/user-del.html", function(req, res){
    var id= req.body["id"];
    try{
        if(typeof id == "object"){
            try{
                id.forEach(function(item){
                    db.Users.destroy({where:{id:item}}).then(function () {

                    });
                });
                res.json({status:tools.SUCCESS, msg:"删除成功！"});
            }catch (e){
                res.json({status:tools.ERROR, msg:"删除用户失败"});
            }

        }else{
            db.Users.find({where:{id:id}}).then(function (entity) {
                if(entity){
                    entity.destroy().then(function () {
                        res.json({status:tools.SUCCESS, msg:"删除成功！"});
                    });
                }else{
                    res.json({status:tools.FAIL, msg:"此用户不存在，删除失败！"});
                }

            });
        }

    }catch (e){
        res.json({status:tools.ERROR, msg:"删除失败！"+e.message});
    }

});
/**
 * 角色管理
 * */
router.all("/role-list.html", function(req, res) {
    if (tools.isGET(req)) {
        res.render('role/list');
    }else if(tools.isPOST(req)){
        var curr_page = req.body['page'] || 1,
            _where = " type=0",
            search = req.body['roleName'];
        if(search){
            _where += " and role_name like '%"+search+"%'";
        }
        pagesize=req.body['pageSize'] || pagesize;
        var params={
            table:"role",
            fields:"id,role_name,role_level,m_id,create_time",
            where:_where,
            order:"",
            currPage:curr_page,
            pageSize:pagesize,
            res:res
        };

        tools.page(params);
    }
});

/**
 * 角色新增
 * */
router.all("/role-edit.html", function(req, res){
    if (tools.isGET(req)) {
        db.Menu.findAll({order:[["sort","asc"]]}).then(function(menu){
            var ids = [], menus = [], menuLen = 0;
            menu.forEach(function(item){
                if(item.pid == 0){
                    ids.push(item.Id);
                    menus.push({
                        name:item.name,
                        url:item.url,
                        icon:item.icon,
                        Id:item.Id,
                        childMenus:[]
                    });
                    menuLen = menuLen+1;
                }else{
                    var isId = ids.indexOf(item.pid);
                    if(isId >= 0){
                        menus[isId].childMenus.push({
                            name:item.name,
                            url:item.url,
                            icon:item.icon,
                            Id:item.Id
                        });
                        menuLen = menuLen+1;
                    }
                }
            });
            var outers = ["用户","职位"];       //不需要查看个人的菜单
            res.render('role/edit',{entitys:menus,menuLen:menuLen,outers:outers});
        });

    }else if(tools.isPOST(req)){
        var roleName =req.body["roleName"],
            roles =req.body["role"];

        try{
            db.Role.create({role_name:roleName,type:0,m_id:0,role_level:0}).then(function (entity) {
                roles.forEach(function(role){
                    var roleTemp = role.split('-');
                    db.Role.create({role_name:"",type:entity.Id,m_id:roleTemp[1],role_level:roleTemp[0]}).then(function () {

                    });
                });
            });
            res.json({status:tools.SUCCESS, msg:"编辑成功"});
        }catch (e){
            res.json({status:tools.ERROR, msg:"编辑失败"+e.message});
        }

    }
});

/**
 * 角色修改
 * */
router.all("/role-modify.html", function(req, res){
    var id = req.query['id'] || req.body["id"];
    db.Role.find({where: {Id: id}}).then(function (entity) {

        if (!entity) {
            res.redirect('/role-list.html');
        }else{
            if (tools.isGET(req)) {
                db.Menu.findAll({order:[["sort","asc"]]}).then(function(menu){
                    var ids = [], menus = [], menuLen = 0;
                    menu.forEach(function(item){
                        if(item.pid == 0){
                            ids.push(item.Id);
                            menus.push({
                                name:item.name,
                                url:item.url,
                                icon:item.icon,
                                Id:item.Id,
                                childMenus:[]
                            });
                            menuLen = menuLen+1;
                        }else{
                            var isId = ids.indexOf(item.pid);
                            if(isId >= 0){
                                menus[isId].childMenus.push({
                                    name:item.name,
                                    url:item.url,
                                    icon:item.icon,
                                    Id:item.Id
                                });
                                menuLen = menuLen+1;
                            }
                        }
                    });
                    var outers = ["用户","职位"];       //不需要查看个人的菜单
                    db.Role.findAll({where:{type: id}}).then(function(roleList){

                        var roleLists = [];
                        roleList.forEach(function(rl){
                            roleLists.push(rl.role_level + "-" + rl.m_id);
                        });
                        console.error(roleLists);
                        res.render('role/modify',{roleList:roleLists, roleEntity:entity, entitys:menus,menuLen:menuLen,outers:outers});

                    }) });

            }else if(tools.isPOST(req)){
                var roleName =req.body["roleName"],
                    roles =req.body["role"];
              try{

                    entity.updateAttributes({role_name:roleName}).then(function () {});
                    db.Role.destroy({where: { type: id}}).then(function () {});

                    if(typeof roles == "string"){
                        var roleTemp = roles.split('-');
                        db.Role.create({role_name:"",type:entity.Id,m_id:roleTemp[1],role_level:roleTemp[0]}).then(function () {

                        });
                    }
                    roles.forEach(function(role){

                        var roleTemp = role.split('-');
                        db.Role.create({role_name:"",type:entity.Id,m_id:roleTemp[1],role_level:roleTemp[0]}).then(function () {

                        });
                    });
                    res.json({status:tools.SUCCESS, msg:"编辑成功"});
                }catch (e){
                    res.json({status:tools.ERROR, msg:"编辑失败"+e.message});
                }

            }
        }

    });
});

/**
 * 获取职位
 * */
router.post("/job.html", function(req, res){
    db.Role.findAll({where: {type: 0}}).then(function (entity) {
        res.json({entitys:entity});
    });
});
/**
 * 角色删除
 * */
router.post("/role-del.html", function(req, res){
    var id= req.body["id"];
    db.Users.find({where:{role_id:id}}).then(function (entity) {
        if(!entity){
            db.Role.destroy({where: { id: id}}).then(function () {

                res.json({status:tools.SUCCESS, msg:"删除成功！"});
            });
        }else{
            res.json({status:tools.ERROR, msg:"此职位目前正在使用，不能被删除！"});
        }
    });
});

/*登陆页面*/
router.all('/login.html',  function (req, res) {
        if(tools.isGET(req)){
            res.render('login');
        }else if(tools.isPOST(req)){
            var obj = tools.pojo(req.body, ["name", 'pwd']);
            obj.pwd = tools.md5(obj.pwd);
            db.Users.find({where: {username: obj.name, passwords: obj.pwd}}).then(function (user) {
                if (user) {
                    //保存用户 session
                    req.session.user = user;
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;//有效期为一周
                    req.session.cookie.httpOnly = true;

                    res.json({status: tools.SUCCESS, msg: "登陆成功"});
                } else {
                    //用户名密码错误
                    res.json({status: tools.FAIL, msg: "用户名或密码错误"});
                }
            });

        }
});

//注销，退出当前账号
router.get('/logout.html', function (req, res) {
    if(req.session.user){
        req.session.user = null;
    } else {
        //用户退出，删除会话
        req.sessionStore.destroy(req.sessionID, function(error) {
            if(error){
                //删除失败，则重置
                req.session.destroy();
            }
        });
    }

    res.redirect("/login.html");
});
//判断当前是否登陆
function auth(req, res, next) {
    if (req.session.user) {
        //session存在，如果不是登陆则继续，是则直接跳转到主页
        if (req.url.indexOf('/login')<0) {
            next();
        } else {
            res.redirect('/index.html');
        }
    } else {
        //session不存在，如果是登陆则继续，不是登陆则跳转至登陆界面
        if (req.url.indexOf('/login')<0) {
            res.redirect("/login.html");
        } else {
            next();
        }
    }

}

module.exports = router;
