/**
 * minderce 2017-09-11
 * 菜单
 */
module.exports=function(sequelize,DataTypes){
    var Menu=sequelize.define("Menu",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        name: DataTypes.STRING,         //菜单名称
        url: DataTypes.STRING,         //链接地址
        icon: DataTypes.STRING         //小图标
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'menu',   //表名
        // 是否需要增加createdAt、updatedAt、deletedAt字段
        timestamps: true,
        // 不需要createdAt字段
        createdAt: 'create_time',
        // 将updatedAt字段改个名
        updatedAt: false,
        // 将deletedAt字段改名
        // 同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
        deletedAt: false,
        paranoid: false
    });
    return Menu;
};
