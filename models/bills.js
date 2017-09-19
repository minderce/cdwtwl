/**
 * minderce 2017-09-07
 * 账单
 */
module.exports=function(sequelize,DataTypes){
    var Bills=sequelize.define("Bills",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        makedate_m: DataTypes.DATE,     //开票日期,客户录入
        makedate_r: DataTypes.DATE,     //到票日期,客户录入
        bill_corp: DataTypes.STRING,    //开票单位(开票),客户录入
        bill_deduct: DataTypes.STRING,    //抵扣单位,客户录入
        tax_no_m: DataTypes.STRING,     //纳税人识别号(开票)
        tax_no_r: DataTypes.STRING,      //纳税人识别号(抵扣)
        bank_no_m: DataTypes.STRING,           //开户行账号(开票)
        bank_no_r: DataTypes.STRING,    //开户行账号(抵扣)
        bank_addr_m: DataTypes.INTEGER, //开户行地址(开票)
        bank_addr_r: DataTypes.INTEGER, //开户行地址(抵扣)
        card_no_m: DataTypes.STRING,    //银行卡号(开票)
        corp_payer: DataTypes.STRING,    //付款经办人
        corp_re: DataTypes.STRING,    //收款经办人
        corp_phone_m: DataTypes.STRING,    //(收款)电话
        corp_phone_r: DataTypes.STRING,    //(付款)电话
        corp_phone_r: DataTypes.STRING,    //(付款)电话
        bill_no: DataTypes.STRING,         //发票号,客户录入
        bill_num_11: DataTypes.DOUBLE(11, 12), //发票金额,11%税,客户录入
        bill_num_6: DataTypes.DOUBLE(11, 12), //发票金额,6%税,客户录入
        bill_sum: DataTypes.DOUBLE(11, 12), //发票总金额，自动生成
        taxpoint_r_6: DataTypes.DOUBLE(10, 2), //应收税点6%,客户录入
        taxpoint_r_11: DataTypes.DOUBLE(10, 2), //应收税点11%,客户录入
        taxprice_r_6: DataTypes.DOUBLE(11, 12), //应收税款,自动由公式产生
        taxprice_r_11: DataTypes.DOUBLE(11, 12), //应收税款,自动由公式产生,公式为发票金额*税点
        taxpoint_p_6: DataTypes.DOUBLE(10, 2), //应付税点6%,客户录入
        taxprice_p_6: DataTypes.DOUBLE(10, 2), //应付税款6%,自动由公式产生
        taxprice_p_11: DataTypes.DOUBLE(10, 2), //应付税款11%,自动由公式产生
        balance: DataTypes.DOUBLE(10, 2), //税款余额
        check_stat: DataTypes.INTEGER, //对账状态,0=未对账，1=已对账
        clean_stat: DataTypes.INTEGER, //清账状态,0=未清账，1=已清账
        check_date:DataTypes.DATE, //发票对账日期
        clean_date:DataTypes.DATE, //发票清账日期
        agent:DataTypes.STRING, //录入人,自动填入登录人
        bill_mark_p:DataTypes.STRING, //付款备注
        bill_mark_r:DataTypes.STRING, //收款备注
        update_person:DataTypes.STRING, //收款备注
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'bills',   //表名
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
    return Bills;
};