/**
 * minderce 2017-09-11
 * 权限
 */
module.exports=function(sequelize,DataTypes){
    var Role=sequelize.define("Role",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        name: DataTypes.STRING,         //权限名称
        m_id: DataTypes.STRING,         //菜单编号
        role_level: DataTypes.INTEGER   //0=查 1=新增 2=修改 3=删除 4=打印
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'role',   //表名
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
    return Role;
};
