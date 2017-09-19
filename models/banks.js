/**
 * minderce 2017-09-07
 * 银行卡信息
 */
module.exports=function(sequelize,DataTypes){
    var Banks=sequelize.define("Banks",{
        Id:{                            //银行编号
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        bank_name: DataTypes.STRING,     //银行卡名称
        bank_type: DataTypes.STRING,     //银行类别，客户自行录入
        bank_account: DataTypes.STRING,  //银行账号，客户自行录入
        bank_agent: DataTypes.STRING,    //出纳，客户自行录入
        bank_addr: DataTypes.STRING,     //银行地址
        contacts: DataTypes.STRING,      //联系人
        tel: DataTypes.STRING,           //电话号码
        bank_point: DataTypes.STRING,    //银行网点
        account_type: DataTypes.INTEGER //账户类型，0=现金，1=非现金
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'banks',   //表名
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
    return Banks;
};