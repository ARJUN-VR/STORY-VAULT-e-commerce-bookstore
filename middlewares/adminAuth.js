const login=async(req,res,next)=>{
    try{
        if(req.session.email){
            next()
        }else{
            res.redirect('/')
        }
    }catch(error){
        console.log(error);
    }
}
const Logout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
  };
module.exports={
    login,
    Logout
}