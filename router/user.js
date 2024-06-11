const express = require("express");
const {
    userRegister,
    singleByEmail,
    getAllUser,
    updateUserRole,
    handleDelete
} = require("../controler/userControler");


const router = express.Router();

router.post("/register", userRegister);
router.get("/singleByEmail/:email", singleByEmail);
router.get("/allusers", getAllUser)
router.patch("/adminpromote/:id", updateUserRole)
router.delete("/delete_user/:id", handleDelete)


module.exports = router;