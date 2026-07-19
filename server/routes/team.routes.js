const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const {
  getActiveTeam,
  getAllTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  toggleTeamMemberStatus,
  deleteTeamMember,
} = require("../controllers/teamController");

// Public
router.get("/", getActiveTeam);
router.get("/all", requireAdmin, getAllTeam); // placed before /:id, admin only
router.get("/:id", getTeamMemberById);

// Admin only
router.post("/", requireAdmin, createTeamMember);
router.put("/:id", requireAdmin, updateTeamMember);
router.patch("/:id/status", requireAdmin, toggleTeamMemberStatus);
router.delete("/:id", requireAdmin, deleteTeamMember);

module.exports = router;
