const Banner=require('../model/bannerSchema')

const LoadBanner=async(req,res)=>{
    try{
        const banner=await Banner.find()
        res.render('banner',{banner})

    }catch(error){
        console.log(error);
    }
}

const addBanner=async(req,res)=>{
    try{
        
        const banner=new Banner({
            Image:req.body.coverimage,
            description:req.body.description,
            productimg:req.body.bookimage
        })

        await banner.save()
        res.redirect('/admin/LoadBanner')

    }catch(error){
        console.log(error);
    }
}

const deleteBanner=async(req,res)=>{
    try{
        await Banner.findOneAndDelete({_id:req.query.proId})
        res.redirect('/admin/LoadBanner')

    }catch(error){
        console.log(error);
    }
}






module.exports={
    addBanner,
    LoadBanner,
    deleteBanner
}