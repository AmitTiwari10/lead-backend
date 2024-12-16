const express = require("express");
const router = express.Router();
const {
  lead,
  updateLead,
  closeLead,
  getLeads,
  getOneLead,
  leadStatus,
  getUsersRegion,
  getProductTotals,
  getSearchedLeads,
} = require("../controller/lead_control");
const { requireLogin, leadMiddleware } = require("../middleware");

router.post("/profile/create-lead", lead);

router.post("/profile/update-lead/assign", requireLogin, updateLead);

router.post("/profile/update-lead/close", requireLogin, closeLead);

router.get("/profile/leads", getLeads);

router.get("/profile/single-lead", getOneLead);

router.get("/profile/leads/users", getUsersRegion);

router.get("/profile/leads/product-totals", getProductTotals);

router.get("/profile/leads/search/", getSearchedLeads);

module.exports = router;
