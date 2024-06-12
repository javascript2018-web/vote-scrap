const express = require("express");
const {
    userRegister,
    singleByEmail,
    getAllUser,
    updateUserRole,
    handleDelete,
    createAdmin
} = require("../controler/userControler");


const router = express.Router();

router.post("/register", userRegister);
router.post("/create-admin", createAdmin);
router.get("/singleByEmail/:email", singleByEmail);
router.get("/allusers", getAllUser)
router.patch("/adminpromote/:id", updateUserRole)
router.delete("/delete_user/:id", handleDelete)


module.exports = router;