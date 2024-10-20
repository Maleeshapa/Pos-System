const Switch = require('../model/Switch');

const getStatus = async (req, res) => {
  try {
    const status = await Switch.findByPk(1);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const switchInstance = await Switch.findByPk(1);
    if (!switchInstance) {
      return res.status(404).json({ message: "Status not found" });
    }
    
    await switchInstance.update({ status });
    res.status(200).json(switchInstance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getStatus,
  updateStatus
};