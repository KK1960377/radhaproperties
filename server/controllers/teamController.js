const TeamMember = require("../models/TeamMember");

// GET /api/team (public) — only active members, sorted for display
async function getActiveTeam(req, res) {
  try {
    const team = await TeamMember.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/team/all (admin only) — everyone, active + inactive
async function getAllTeam(req, res) {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/team/:id (public) — for the detail profile page
async function getTeamMemberById(req, res) {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/team (admin only)
async function createTeamMember(req, res) {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: "Could not create team member", error: err.message });
  }
}

// PUT /api/team/:id (admin only)
async function updateTeamMember(req, res) {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: "Could not update team member", error: err.message });
  }
}

// PATCH /api/team/:id/status (admin only) — toggle active/inactive
async function toggleTeamMemberStatus(req, res) {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    member.active = !member.active;
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: "Could not update status", error: err.message });
  }
}

// DELETE /api/team/:id (admin only)
async function deleteTeamMember(req, res) {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json({ message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  getActiveTeam,
  getAllTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  toggleTeamMemberStatus,
  deleteTeamMember,
};
