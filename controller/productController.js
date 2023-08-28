const Product=require('../model/productSchema')
const Category=require('../model/catogorySchema')
const User=require('../model/userSchema')

const loadProduct=async(req,res)=>{
    try{
        const userid=req.session.userid
        const userdata = await User.findOne({_id:userid})
        const data=await Product.find()
        const category=await Category.find()

    res.render('product',{category,data,userdata})

    }catch(error){
        console.log(error);
    }
}

const insertProduct=async(req,res)=>{
    try{
        const data=await Product.find()
        const category=await Category.find()


        const product=new Product({
            name:req.body.name,
            description:req.body.description,
            Image: req.files.map((file) => file.filename),
            category:req.body.Category,
            price:req.body.price,
            stock:req.body.stock,
            is_listed:false

        })
        const name=product.name
        const proName = await Product.aggregate([
            {
                $match: {
                    name: {
                        $regex: name,
                        $options: 'i'
                    }
                }
            }
        ])
        if(proName){
         res.render('product',{message:'product already exist',data,category})
        }else{
        await product.save()
        res.redirect('/admin/product')


        }
        

    }catch(error){
        console.log(error);
        
    }
}

const imageUpload=async(req,res,next)=>{
    try{
    
        if(!req.files || req.files.length===0){
            return res.status(400).send('no files found')
        }else{
        
            next()
        }

    }catch(error){
        console.log(error);
    }
}

const list=async(req,res)=>{
    try{
        const productId = req.query.id;
        const data=await Product.findOne({_id:productId})
        const proName=data.name
        if(data.is_listed==true){
            data.is_listed=false
            await Product.updateOne({ name: proName }, { $set: { is_listed: false } });
        }else{
            data.is_listed=false
            await Product.updateOne({ name: proName }, { $set: { is_listed: true } });
        }
        await data.save()
        res.redirect('/admin/product')
      
    }catch(error){
        console.log(error);
    }
}
const edit=async(req,res)=>{
    try{
        const category=await Category.find()
        const productId=req.query.id
        const data=[await Product.findOne({_id:productId})]
        res.render('productEdit',{data,category})

    }catch(error){
        console.log(error);
    }

}



const update = async (req, res) => {
    try {
      const productId = req.body.Id // Access the product ID from the form data
      
      const updatedData = req.body;
  
       await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
  
      
      res.redirect('/admin/product')
    } catch (error) {
      console.log(error);
    }
  };
  
  

module.exports={
    loadProduct,
    insertProduct,
    imageUpload,
    list,
    edit,
    update
}