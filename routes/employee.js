const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth");
const EmployeeController = require("../Controllers/EmployeeController");

router.get("/employee", authenticateJWT, EmployeeController.index);
router.get("/employee/:employeeID", authenticateJWT, EmployeeController.show);
router.post("/employee", authenticateJWT, EmployeeController.store);
router.put("/employee/:employeeID", authenticateJWT, EmployeeController.update);
router.delete(
  "/employee/:employeeID",
  authenticateJWT,
  EmployeeController.destroy
);

module.exports = router;
