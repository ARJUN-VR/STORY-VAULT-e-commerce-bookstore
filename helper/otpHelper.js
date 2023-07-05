const checkOtp = async (req, res) => {
    try {
      const { otp } = req.body;
  
      const storedOtp = req.session.otp;
  
      delete req.session.otp;
  
      if (!otp || otp === "") {
        console.log("OTP is not provided");
        res.redirect("/enterOtp");
        return;
      }
      if (Number(otp) === storedOtp) {
        console.log("OTP verification successful");
        res.redirect("/login");
      } else {
        console.log("OTP verification failed");
        res.render("enterOtp", { message: "incorrect OTP" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  module.exports={
    checkOtp
  }