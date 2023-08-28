const Catogory=require('../model/catogorySchema')
const Product=require('../model/productSchema')


const insertCatogory=async(req,res)=>{
    try{
        const data =await Catogory.find()
        const catogory=new Catogory({
            name:req.body.name,
            description:req.body.description,
            is_listed:0
        })
        const name=catogory.name 
        const catName=await Catogory.findOne({name:name})
        if(catName){
             res.render('catogory',{message:"category already exists",data})
        }else{
            catogory.save()
            const data =await Catogory.find()
             if(data){
                 res.render('catogory',{data})
             }else{
                 res.status(404)
                 }

        }
       
        
    }catch(error){
        console.log(error.message);
    }
}

const listcat=async(req,res)=>{
    try{
        const categoryId = req.query.id;
        const data=await Catogory.findOne({_id:categoryId})
        const catName=data.name
        if(data.is_listed==1){
            data.is_listed=0
            await Product.updateMany({ category: catName }, { $set: { is_listed: false } });
        }else{
            data.is_listed=1
            await Product.updateMany({ category: catName }, { $set: { is_listed: true } });
        }
        await data.save()
        console.log(data);

        res.redirect('/admin/catogory')
      
    }catch(error){
        console.log(error);
    }
}
const loadEdit=async(req,res)=>{
    try{
        const catId=req.query.id
        const data=[await Catogory.findOne({_id:catId})]
       
        res.render('categoryEdit',{data})
    }catch(error){
        console.log(error);
    }
}

const updateCategory=async(req,res)=>{
    try{
        const categoryId=req.body.id
        const updatedData=req.body;
        await Catogory.findByIdAndUpdate(
            categoryId,
            updatedData,
            {new:true}
        );
        res.redirect('/admin/catogory')
        

    }catch(error){
        console.log(error);
    }
}

module.exports={
    insertCatogory,
    listcat,
    loadEdit,
    updateCategory,
  
}