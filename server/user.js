const {User} = require("./db/modals")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {QueryTypes, Op} = require("sequelize")

const generateJwt = (login,password) =>{
    return jwt.sign(
        {login,password},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}
class User_Queries{
    async registration(req,res,next){
        const {login, password, passwordAgain, secret} = req.body
        if(!(login || password || passwordAgain || secret)) res.status(401).send("Введите логин, пароль 2 раза и секрет")
        const candidate = await User.findOne({where:{login}})
        if(password == passwordAgain){
            const hashPassword = await bcrypt.hash(password,5)
            if(!candidate) {
                const user = await User.create({
                    login, hashPassword, secret
                })
                const token = generateJwt(user.login,user.password)
                res.status(200).json({token})
            }
            else res.status(401).send("Пользователь с таким логином уже существует")
        }
        else res.status(402).send("Пароли не совпадают")
    }

    async login_old(req,res,next){
        const {login, password} = req.body
        const hashPassword = await bcrypt.hash(password,5)
        const user = await sequelize.query(`SELECT * FROM users WHERE login=${login} AND password=${hashPassword}`,{
            type:QueryTypes.SELECT
        })
        if(user) res.status(200).json({user})
        else res.status(401).send("Логин не найден, либо неверный пароль")
    }

    async login_new(req,res,next){
        const {login, password} = req.body
        const user = await User.findOne({where: login})
        if(!user){
            res.status(401).send("Указан неверный login")
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            res.status(401).send("Указан неверный пароль")
        }
        const token = generateJwt(user.login,user.password)
        const secret = user.secret
        res.json({"Token":token,"Your secret":secret})
    }

    async check(req,res,next){
        const token = generateJwt(req.user.login, req.user.password)
        if(token) res.json({token})
        else res.send("No Token was created")
    }

    async get_by_login_old(req,res,next){
        const user = sequelize.query(`SELECT * FROM users WHERE login=${req.params.login}`,{
            type:QueryTypes.SELECT
        })
        if(user) res.status(200).json({user})
        else res.status(401).send(`Пользователь с логином = ${req.params.login} не найден`)
    }

    async get_by_login_new(req,res,next){
        const user = await User.findOne({where:{login:req.params.login}})
        if(user) res.status(200).json({user})
        else res.status(404).send(`Пользователь c логином = ${req.params.login} не найден`)
    }

    async get_me_by_token(req,res,next){
        const user = await User.findOne({where:{login:req.user.login}})
        if(user) res.status(200).json({me})
        else res.status(404).send("Пользователь не найден")
    }
}

module.exports = new User_Queries()