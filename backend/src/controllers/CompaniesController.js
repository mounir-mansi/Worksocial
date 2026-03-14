const prisma = require("../lib/prisma");
const { deleteS3Object } = require("../lib/deleteS3Object");

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
    const Logo = req.file ? `${process.env.S3_PUBLIC_URL}/${req.file.key}` : null;
    const company = await prisma.company.create({
      data: { Name, URL, Phone, Email, Activity, Address, Logo },
    });
    res.location(`/companies/${company.Company_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateCompany = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { Name, URL, Phone, Email, Activity, Address } = req.body;
    const data = { Name, URL, Phone, Email, Activity, Address };
    if (req.file) {
      const old = await prisma.company.findUnique({ where: { Company_ID: id }, select: { Logo: true } });
      if (old?.Logo) await deleteS3Object(old.Logo);
      data.Logo = `${process.env.S3_PUBLIC_URL}/${req.file.key}`;
    }
    await prisma.company.update({ where: { Company_ID: id }, data });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteCompany = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const company = await prisma.company.findUnique({ where: { Company_ID: id }, select: { Logo: true } });
    await prisma.company.delete({ where: { Company_ID: id } });
    if (company?.Logo) await deleteS3Object(company.Logo);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getCompanies, getCompanyByID, createCompany, updateCompany, deleteCompany };
