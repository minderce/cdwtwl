var express = require('express');
var db = require('../models');

var config = require('../config.json')[process.env.NODE_ENV || 'development'];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db);
var tools = require('../utils/tools');
var router = express.Router();
var pagesize=10;
/*登陆 start*/
router.get('/',  function (req, res) {

    db.Banks.findAll({where:{tel:0}}).then(function (banks) {
        console.log(banks);
    });

    res.render('index');
});

/*
* 用户列表
* */
router.all("/user-list.html", function (req, res) {
    if (tools.isGET(req)) {
        res.render('user/list');
    }else if(tools.isPOST(req)){
        var curr_page = req.body['page'] || 1,
            _where=" user_stat>=0",
            search=req.body['search'];
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
})
router.get('/list',  function (req, res) {

    res.render('list');
});
router.get('/all',  function (req, res) {

    res.render('all');
});
router.get('/edit',  function (req, res) {

    res.render('edit');
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

                    res.json({status: 0, msg: "登陆成功"});
                } else {
                    //用户名密码错误
                    res.json({status: -1, msg: "用户名或密码错误"});
                }
            });

        }
});

//判断当前是否登陆
function auth(req, res, next) {
    if (req.session.user) {
        //session存在，如果不是登陆则继续，是则直接跳转到主页
        if (req.url !== config.adminLoginPath) {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        //session不存在，如果是登陆则继续，不是登陆则跳转至登陆界面
        if (req.url !== config.adminLoginPath) {
            res.redirect(config.adminLoginPath);
        } else {
            next();
        }
    }
}


module.exports = router;
