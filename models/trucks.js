/**
 * minderce 2017-09-11
 *
 */
module.exports=function(sequelize,DataTypes){
    var Trucks=sequelize.define("Trucks",{
        Id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        truck_no: DataTypes.STRING,    //车牌号，如川A12345
        truck_owner: DataTypes.STRING,     //车主,如XXXXX公司
        truck_driver: DataTypes.STRING,    //驾驶员姓名
        truck_type: DataTypes.STRING,  //车型，如单拖车,双拖车等
        truck_license: DataTypes.STRING,    //行驶证号
        driver_license: DataTypes.STRING,    //驾驶证号
        authenticate: DataTypes.STRING,    //资格证号
        driver_tel: DataTypes.STRING,    //驾驶员电话,如0865-15858585858
        truck_addr: DataTypes.STRING    //车所在地
    },{
        // 自定义表名
        freezeTableName: true,
        tableName: 'trucks',   //表名
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
    return Trucks;
};
