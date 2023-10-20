const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRegister = require('../models/Register');// Assuming this is the correct import for your User model
const KEY = process.env.SECRETKEY; // Ensure you have a valid secret key

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await UserRegister.findOne({ Email  });

    if (!user) {
      return res.status(400).json({
        message: 'Email not found',
      });
    }

    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Password is incorrect',
      });
    }

    const token = jwt.sign(
      { UserId: user._id, Email: user.Email },
      KEY, // Use your secret key here
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'User is logged in',
      data: {
        Id: user._id,
        Name:user.Name,
        Email: user.Email,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'User is not logged in',
      error: err,
    });
  }
};
