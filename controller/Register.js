const UserRegister = require('../models/Register');
const bcrypt = require('bcrypt');

exports.Register = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;
    
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the number of salt rounds

    const Registerdata=await UserRegister.findOne({Email})
    if(Registerdata){
      res.status(500).json({
        message:'Email is alredy exist'
      })
    }
else{
    const newRegistedata= new UserRegister({
      Name:Name,
      Email:Email,
      Password:hashedPassword
    })

    console.log("Register data is", newRegistedata)
    const data = await newRegistedata.save();
    res.status(200).json({
      message: 'Data is saved successfully',
      Data: data
    });
  }

  } catch (err) {
    res.status(500).json({
      message: 'Data is not saved',
      error: err
    });
  }
}
