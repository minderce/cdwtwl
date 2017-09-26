/**
 * minderce 2017-09-11
 * 用户信息
 */
module.exports=function(sequelize,DataTypes){
    var Users=sequelize.define("Users",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        username: DataTypes.STRING,       //用户名称，英文字母小写
        passwords: DataTypes.STRING,     //用户密码,密码限制8位,此字段存MD5
        avatar: DataTypes.STRING,       //头像
        tel: DataTypes.STRING,          //电话号码
        email: DataTypes.STRING,        //邮箱
        role_name: DataTypes.STRING,    //职务名称
        role_id: DataTypes.INTEGER,    //职务id
        user_stat: DataTypes.INTEGER    //状态(1=启动，0=禁用，-1=删除)
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'users',   //表名
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
    return Users;
};
