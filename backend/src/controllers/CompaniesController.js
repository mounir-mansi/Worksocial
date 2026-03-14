const prisma = require("../lib/prisma");

const getCompanies = async (_req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.send(companies);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getCompanyByID = async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { Company_ID: parseInt(req.params.id, 10) },
    });
    if (!company) return res.sendStatus(404);
    res.send(company);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createCompany = async (req, res) => {
  try {
    const { Name, URL, Phone, Email, Activity, Address } = req.body;
    const Logo = req.file ? req.file.filename : null;
    const company = await prisma.company.create({
      data: { Name, URL, Phone, Email, Activity, Address, Logo },
    });
    res.location(`/companies/${company.Company_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getCompanies, getCompanyByID, createCompany };
