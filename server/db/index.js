const Sequelize = require("sequelize")
let config
if(process.env.DB_HOST){
    config = {
        logging: false,
        ssl: true,
        dialectOptions: {
            ssl:{
                require:true,
                rejectUnauthorized: false
            }
        }
    }
}
else config = {logging:false}
module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
{
    dialect:"postgres",
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
})