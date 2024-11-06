const Router = require("express")
const router = new Router()

const user = require("./user")

router.post("/reg",user.registration)
router.post("/login_old",user.login_old)
router.post("/login_new",user.login_new)
router.get("/get_by_login_old/:login",user.get_by_login_old)
router.get("/get_by_login_new/:login",user.get_by_login_new)
router.post("/check",user.check)

module.exports = router