const {User} = require("../db/modals")
class User_Queries{
    async registration(req,res,next){
        const {nickname, email, phone, passwd, passwdAgain} = req.body
        if(!(nickname && passwd && passwdAgain) && !(email || phone)){
            res.status(401).json({message:'Введите почту или телефон, никнейм, пароль и пароль снова'})
        }
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                errors: errors.array()
            })
        }
        const candidate_email = await User.findOne({
            where: email
        }).then(result=>{if(result)res.status(401).send("Пользователь с таким email уже существует")})
        const candidate_phone = await User.findOne({
            where: phone
        }).then(result=>{if(result)res.status(401).send("Пользователь с таким телефоном уже существует")})
        const candidate_nickname = await User.findOne({
            where: nickname
        }).then(result=>{if(result)res.status(401).send("Пользователь с таким ником уже существует")})
        if(passwd == passwdAgain){
            const hashPasswd = await bcrypt.hash(passwd,5)
            const user = await User.create({
                nickname, email, phone, passwd, passwdAgain
            })
            const token = generateJwt(user.id_user,user.nickname,user.email,user.phone,user.account_type)
            res.status(200).json({token})
        }
        else res.status(402).send("Пароли не совпадают")
    }

    async login(req,res,next){
        const {nickname, passwd} = req.body
        const user = await User.findOne({
            where: nickname
        })
        if(!user){
            res.status(403).send("Указан неверный nickname")
        }
        let comparePassword = bcrypt.compareSync(passwd, user.passwd)
        if(!comparePassword) {
            res.status(404).send("Указан неверный пароль")
        }
        const token = generateJwt(user.id_user,user.nickname,user.email,user.phone,user.account_type)
        res.status(200).json({token})
    }

    async check(req,res,next){
        const token = generateJwt(req.user.id_user,req.user.nickname,req.user.email,req.user.phone,req.user.account_type,req.user.status)
    }
}

module.exports = new User_Queries()