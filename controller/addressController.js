const User=require('../model/userSchema');
const { v4: uuidv4 } = require('uuid');
const Order=require('../model/order')


const addAddress=async(req,res)=>{
    try{
      console.log('coming ');
        const address={
            id:uuidv4(),
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            street:req.body.street,
            house:req.body.house,
            city:req.body.city

        }
      
        const userdata= await User.findOne({_id:req.session.userid})
        
       
       if(userdata){
     
        userdata.address.push(address)
        

          await userdata.save() 
          res.redirect('/checkout')       
       }else{
        console.log('address added failed'+error);
       }
        
    }catch(error){
        console.log(error);
    }
}

const deleteAddress=async(req,res)=>{
    try{
        const addressId = req.params.id
        const userdata=await User.findOne({_id:req.session.userid})
        console.log(userdata);
        userdata.address = userdata.address.filter(address => address.id !== addressId);
        console.log(userdata.address);

        
        await userdata.save()
        res.redirect('/checkout')

    }catch(error){
        console.log(error);
    }
}


module.exports={
    addAddress,
    deleteAddress
    

}  