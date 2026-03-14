const express = require("express");

const router = express.Router();
const upload = require("../middleware/handleUpload");
const { verifyToken } = require("../middleware/auth");
const companiesController = require("../controllers/CompaniesController");

router.use(verifyToken);

router.get("/companies", companiesController.getCompanies);
router.get("/company/:id", companiesController.getCompanyByID);
router.post("/company", upload.single("Logo"), companiesController.createCompany);
router.put("/company/:id", upload.single("Logo"), companiesController.updateCompany);
router.delete("/company/:id", companiesController.deleteCompany);

module.exports = router;
