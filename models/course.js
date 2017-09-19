/**
 * minderce 2017-09-11
 * 过程
 */
module.exports=function(sequelize,DataTypes){
    var Course=sequelize.define("Course",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        shortname: DataTypes.STRING,    //费用项目名字简写,客户录入,简拼首字母,如杂费,zf
        fullname: DataTypes.STRING,     //费用项目全名
        c_type: DataTypes.INTEGER,    //费用类型,0=应收,1=应付
        c_driver: DataTypes.INTEGER,  //是否司机工资,0=不是,1=是
        c_stat: DataTypes.INTEGER    //状态,0=无效,1=有效
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'course',   //表名
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
    return Course;
};
