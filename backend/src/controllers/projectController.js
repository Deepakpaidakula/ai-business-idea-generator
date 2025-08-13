const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      user: req.user.id
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
