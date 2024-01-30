const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const convertToTitleCase = require("../utils/makeTitleCase");
const isValidName = require("../utils/isValidName");
const isValidEmail = require("../utils/isValidEmail");

const JWT_SECRET = process.env.JWT_SECRET;

const convertToK = (num) => {
  return num > 999 ? (num / 1000).toFixed(1) + "K" : num;
};

const createUser = async (req, res) => {
  let success = false;

  let {name, email, password} = req.body;
  name = name.toString().toLowerCase();
  email = email.toString().toLowerCase();

  try{

    if(!isValidName(name)){
      return res.json({success, error: "Name is not valid!"});
    }else{
      name = convertToTitleCase(name);
    }

    if (!isValidEmail(email)) {
      return res.json({success, error: "Email Address is not valid!"});
    } 

    let user = await User.findOne({email: email});
    if(user){
      return res.json({success, error: "Email Address is already registered!"});
    }

    if(password.length < 6){
      return res.json({success, error: "Password must be at least 6 characters long!"});
    }

    const securedPassword = await bcrypt.hash(password.toString(), 10);

    const newUser = await User.create({
      name,
      email,
      password: securedPassword
    });
    const data={
      user:{
          id:newUser.id
      }
    }

    success = true;
    return res.json({ success, info: "Account Created Successfully!!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
    
  }
};

const loginUser = async (req, res) => {
  let success = false;
  let { email, password } = req.body;
  email = email.toString().toLowerCase();
  try {
    let emailCheck = await User.findOne({  email });
    if (!emailCheck) {
      return res.json({ success, error: "Invalid Credentials!" });
    }

    let user = emailCheck;

    if (!user) {
      return res.json({ success, error: "Invalid Credentials!" });
    }

    const passwordCheck = await bcrypt.compare(password.toString(), user.password);

    if (!passwordCheck) {
      return res.json({ success, error: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // filter sensitive data
    user.password = undefined;

    success = true;
    return res.json({ success, info:"Login Success", token, data: user });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const getUser = async (req, res) => {
    let success = false;
    try{
        let user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.json({ success, error: "User Not Found!" });
        }

        let newUser = {
            ...user._doc,
            quizCreated: convertToK(user.quizCreated),
            questionsCreated: convertToK(user.questionsCreated),
            totalImpressions: convertToK(user.totalImpressions),
        };

        success = true;
        return res.json({success, user: newUser});
    }
    catch (error){
        console.log(error);
        return res.json({ error: "Something Went Wrong!" });
    }
}


module.exports = { createUser, loginUser, getUser };