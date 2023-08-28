const { name } = require("ejs");
const Admin = require("../model/adminSchema");
const User = require("../model/userSchema");
const Product=require('../model/productSchema')

const Order=require('../model/order')


const bcrypt = require("bcrypt");
const catogory=require('../model/catogorySchema')
const Cart=require('../model/cartSchema')

const PDFDocument = require('pdfkit');
const fs = require('fs');
const { log } = require("console");





const adminLogin = async (req, res) => {
  try {   
    res.render("adminLogin");
  } catch (error) {
    console.log("not working", error);
  }
};

const adminVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await Admin.findOne({ email: email });
    if (adminData) {
      if (password == adminData.password) {
        req.session.email=email
        res.redirect('/admin/home')
      } else {
        res.render("adminLogin", { message: "check your password" });
      }
    } else {
      res.render("adminLogin", { message: "you have no access" });
    }
  } catch (error) {
    console.log(error);
  }
};


const loadUser=async(req,res)=>{
  try{
    const udata=await User.find() //it is the collection
    res.render('users',{udata})
  }catch(error){
    console.log(error);
  }
}

const loadhome=async(req,res)=>{
  try{
    
    const salesCount = await Order.aggregate([
      { $unwind: "$orderdetails" },
      {
        $match: {
          "orderdetails.status": "placed"  
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {  // Group by the date part of createdAt field
              format: "%Y-%m-%d",
              date: "$orderdetails.date"
            }
          },
          orderCount: { $sum: 1 }  // Calculate the count of orders per date
        }
      },
      {
        $sort: {
          _id: 1  // Sort the results by date in ascending order
        }
      }
    ])

   

    const orders=await Order.aggregate([
      {
        $unwind:"$orderdetails"
      },
      {
        $project:{
          orderdetails:1
        }
      }
    ])
    

    const revenue=await Order.aggregate([
      { $unwind: "$orderdetails" },
      {
        $match: {
          "orderdetails.status": "placed"  
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {  // Group by the date part of createdAt field
              format: "%Y-%m-%d",
              date: "$orderdetails.date"
            }
          },
          totalRevnue: { $sum: "$orderdetails.cartTotal" }  
        }
      },
      {
        $sort: {
          _id: 1  // Sort the results by date in ascending order
        }
      }

    ])
    const order = await Order.find(); // Retrieve your orders or data

    // Extract category data and calculate category totals
    const categoryTotals = {};
    order.forEach(order => {
        const category = order.orderdetails[0].carted.category;
        const revenue = order.Total;

        if (!categoryTotals[category]) {
            categoryTotals[category] = revenue;
        } else {
            categoryTotals[category] += revenue;
        }
    });

    // Generate pie chart data
    const pieChartData = [];
    for (const category in categoryTotals) {
        pieChartData.push({
            label: category,
            data: categoryTotals[category]
        });
    }
    

    const carted=orders.map(order=>order.orderdetails.carted)
    const priceSum = carted.map(cart => cart.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
   
  
    res.render('adminHome',{salesCount,priceSum,revenue,pieChartData})


    
  }catch(error){
    console.log(error);
  }
}

const block=async(req,res)=>{
  try{
    const usersEmail=req.query.id
   
   const userData=await User.findOne({_id:usersEmail})
   if(userData){
    if(userData.is_blocked==false){
      userData.is_blocked=true
    }else{
      userData.is_blocked=false
    }
    await userData.save()
   
   }else{
    console.log('user not found');
   }
   res.redirect('/admin/users')

  }catch(error){
    console.log(error);
  }
}

const loadCatogory=async(req,res)=>{
  try{
    const data=await catogory.find()
    res.render('catogory',{data})
  }catch(error){
    console.log(error);
  }
}

// const generatePDF = (data) => {
//   const doc = new PDFDocument();
//   const fileName = 'sales_report.pdf';
//   const stream = fs.createWriteStream(fileName);

//   doc.pipe(stream);

//   doc.fontSize(18).text('Sales Report', { align: 'center' });
//   doc.moveDown();

//   data.forEach((item) => {
//       doc.fontSize(12).text(`Customer: ${item.users[0].name}`);
//       doc.text(`Product ID: ${item.orderdetails.carted._id}`);
//       doc.text(`Quantity: ${item.orderdetails.quantity}`);
//       doc.text(`Price: ${item.orderdetails.quantity * item.orderdetails.carted.price}`);
//       doc.moveDown();
//   });

//   doc.end();
// };


const LoadSales = async (req, res) => {
  try {
      let aggregationPipeline = [
          {
              $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'users',
              },
          },
          {
            $unwind:'$orderdetails'

          },
          {
              $project: {
                  user: 1,
                  orderdetails: 1,
                  users: 1,
              },
          },
      ];

      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      if (startDate && endDate) {
          aggregationPipeline.unshift(
              {
                  $unwind: '$orderdetails',
              },
              {
                  $match: {
                      'orderdetails.date': {
                          $gte: new Date(startDate),
                          $lte: new Date(endDate),
                      },
                  },
              }
          );
      }

      const data = await Order.aggregate(aggregationPipeline);

     

      res.render('sales', { data ,startDate,endDate});
  } catch (error) {
      console.log(error);
  }
};

// const downloadSales = async (req, res) => {
//   try {
//       const startDate = req.query.startDate;
//       const endDate = req.query.endDate;

//       let aggregationPipeline = [
//           {
//               $lookup: {
//                   from: 'users',
//                   localField: 'user',
//                   foreignField: '_id',
//                   as: 'users',
//               },
//           },
//           {
//               $project: {
//                   user: 1,
//                   orderdetails: 1,
//                   users: 1,
//               },
//           },
//       ];

//       if (startDate && endDate) {
//           aggregationPipeline.unshift(
//               {
//                   $unwind: '$orderdetails',
//               },
//               {
//                   $match: {
//                       'orderdetails.date': {
//                           $gte: new Date(startDate),
//                           $lte: new Date(endDate),
//                       },
//                   },
//               }
//           );
//       }

//       const data = await Order.aggregate(aggregationPipeline);

//       // If a special query parameter is provided (e.g., ?download=true),
//       // generate and trigger the PDF download
//       if (req.query.download === 'true' && data.length > 0) {
//           generatePDF(data);
//           res.download('sales_report.pdf');
//       } else {
//           // Redirect back to the /sales route if the button is not clicked yet
//           res.redirect('/sales');
//       }
//   } catch (error) {
//       console.log(error);
//   }
// };



module.exports = {
  adminLogin,
  adminVerify,
  loadUser,
  block,
  loadhome,
  loadCatogory,
  LoadSales,
  // downloadSales
 
};
