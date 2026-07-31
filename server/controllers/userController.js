const User = require('../models/User');

const addAddress = async (req, res) => {
  const { fullName, mobile, pincode, state, city, houseNumber, area, landmark } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses.push({ fullName, mobile, pincode, state, city, houseNumber, area, landmark });
      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addAddress };
