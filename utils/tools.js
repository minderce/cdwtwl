
var crypto = require('crypto');
var db = require('../models');
var config = require('../config.json')[process.env.NODE_ENV || 'development'];
var tools = {};
tools.execute = function (func, params) {
    if (func && typeof func === 'function') {
        func(params);
    }
};

tools.isGET = function (req) {
    return req.method === "GET";
};

tools.isPOST = function (req) {
    return req.method === "POST";
};

tools.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

toolsencrypt = function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

tools.decrypt = function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};


tools.getSession = function (name, password) {
    return this.encrypt(name + '\t' + password, config.session_secret);
};

tools.pojo = function (body, arg) {
    var obj = {};

    for (var i in arg) {
        try {
            if (typeof  body[arg[i]] !== 'undefined') {
                obj[arg[i]] = body[arg[i]];
            }
        } catch (e) {

        }
    }

    return obj;
};

/**
 *分页
 * table 表名
 * fields 字段
 * where 查询的条件
 * order 排序
 * currPage 当前页
 * pageSize 每页显示多少条数据
 * search 搜索文字
 * */
tools.page=function(params){
    var startRow =params.pageSize*(params.currPage -1);
    var strsql ="select  "+params.fields+" from " +params.table;
    if(params.where){
        strsql+=" where "+params.where;
    }
    if(params.group){
        strsql+=" group by "+params.group;
    }
    if(params.order){
        strsql+=" order by "+params.order;
    }
    strsql+=" limit "+startRow+","+params.pageSize;
    db.sequelize.query(strsql).spread(function (entity) {
        if(entity.length>=params.pageSize ||  params.currPage>1){
            var count_sql="select count(0) as count from "+params.table;
            if(params.where){
                count_sql+=" where "+params.where;
            }
            db.sequelize.query(count_sql).spread(function (count_val) {
                var pagecount=count_val[0].count;
                pagecount=(pagecount % params.pageSize > 0 )==true?Math.floor(pagecount / params.pageSize) + 1:Math.floor(pagecount / params.pageSize);
                params.res.json({
                    entitys: entity,
                    curr_page:parseInt(params.currPage),
                    pagecount:pagecount,
                    search: params.search,
                    pagesize: params.pageSize,
                    numcount: count_val[0].count
                });
            });
        }else{
            params.res.json({
                entitys: entity,
                curr_page:parseInt(params.currPage),
                pagecount:1,
                search: params.search,
                pagesize: params.pageSize,
                numcount:entity.length
            });
        }
    });
}



module.exports = tools;
