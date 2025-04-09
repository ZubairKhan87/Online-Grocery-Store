const { json } = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// register user
const registerUser = async (req,res) => {
    const {name, email, password } = req.body;
    const userExists = await User.findOne({email});
    if (userExists){
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({name,email,password});
    if (user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token : generateToken(user.id)
        });
    }
    else{
        res.status(400).json({ message: "Invalid user data" });

    }
}


// Login User
const loginUser = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user && (await user.matchPassword(password))){
        res.cookie("token", generateToken(user.id),{httpOnly : true});
        res.json({_id: user.id, name: user.name, email: user.email});
    }
    else {
        res.status(401).json({ message: "Invalid email or password" });
    }
}

const logoutUser = (req, res) => {
    res.cookie("token", "", {expires : new Date(0)});
    res.json({message: "Logged out Successfully"});

}

module.exports = {registerUser, loginUser, logoutUser};


