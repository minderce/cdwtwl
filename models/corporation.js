/**
 * minderce 2017-09-11
 * 公司信息
 */
module.exports=function(sequelize,DataTypes){
    var Corporation=sequelize.define("Corporation",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        corps: DataTypes.STRING,         //客户简称，客户全名首拼小写，如圆通物流为ytwl,必填
        corp_name: DataTypes.STRING,     //客户全称
        corp_type: DataTypes.STRING,     //客户类别,必填,如个人,企业等,查询时按此字段分类
        corp_phone: DataTypes.STRING,    //客户电话
        corp_address: DataTypes.STRING,  //客户地址
        corp_payer: DataTypes.STRING,    //付款经办人
        receiver: DataTypes.STRING,      //收款经办人
        bank_name: DataTypes.STRING,    //开户行名字
        bank_addr: DataTypes.STRING,    //开户行地址
        card_no: DataTypes.INTEGER,    //开户行卡号
        tax_no: DataTypes.STRING    //纳税人识别号
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'corporation',   //表名
        // 是否需要增加createdAt、updatedAt、deletedAt字段
        timestamps: true,
        // 不需要createdAt字段
        createdAt: 'create_time',
        // 将updatedAt字段改个名
        updatedAt: 'update_time',
        // 将deletedAt字段改名
        // 同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
        deletedAt: false,
        paranoid: false
    });
    return Corporation;
};
