const Router = require("express")
const router = new Router()

const user = require("./user")

router.post("/reg",user.registration)
router.post("/login",user.login)