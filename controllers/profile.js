const User =  require("../models/User")

exports.editProfileView = (req, res)=>{
  res.render("profile/editProfile")
}

exports.editProfileProcess = async (req, res)=>{
  const {
    username, email
  } = req.body;

  let image;
    if (req.file) {
        image = req.file.path
    }else{
        image = "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg";
    }

    await User.findByIdAndUpdate(req.user._id, {
      username, 
      email, 
      image
    })
    res.redirect("/profile/profile")
}