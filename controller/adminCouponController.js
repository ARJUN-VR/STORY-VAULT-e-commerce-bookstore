const Coupon = require('../model/coupon')

const loadCoupon=async(req,res)=>{
    try{
        const couponlist=await Coupon.find()
        console.log(couponlist);
        res.render('coupon',{couponlist})

    }catch(error){
        console.log(error);
    }
}

const addCoupon=async(req,res)=>{
    try{
 

        const coupon=new Coupon({
            couponCode:req.body.coupon,
            validity:req.body.date,
            minpurchase:req.body.min,
            discount:req.body.discount,
            maxdiscountvalue:req.body.max,
            description:req.body.description,
            status:'valid'
        })
        await coupon.save()
        res.redirect('/admin/coupon')

    }catch(error){
        console.log(error);
    }
}

const deleteCoupon=async(req,res)=>{
    try{
        await Coupon.findOneAndDelete({ couponCode: req.query.code });
        res.redirect('/admin/coupon')



    }catch(error){
        console.log(error);
    }
}





module.exports={
    loadCoupon,
    addCoupon,
    deleteCoupon
}