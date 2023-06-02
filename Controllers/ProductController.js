const Product = require("../models/Product");
const fs = require("fs");

const index = async(req,res,next)=>{


        try {    
        const search = req.query.search ||""; 
       
        const namesearch = req.query.namesearch ||""; 
        const descriptionsearch = req.query.descriptionsearch ||""; 
        const pricesearch=req.query.pricesearch||""; 




        const count = await Product.countDocuments({
          $and: [
            {
              $and: [
                { name: { $regex: namesearch, $options: 'i' } },
                { price: { $regex: pricesearch, $options: 'i' } },
                { description: { $regex: descriptionsearch, $options: 'i' } }
              ]
            },
            {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
              ]
            }
          ]
        }
        );



        const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        const limit =  parseInt(req.query.limit) || 10; // Set the number of items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip
        const sort = req.query.sort||'createdAt'; 
        const totalPages = Math.ceil(count / limit);


      const products = await Product.find({
        $and: [
          {
            $and: [
              { name: { $regex: namesearch, $options: 'i' } },
              { price: { $regex: pricesearch, $options: 'i' } },
              { description: { $regex: descriptionsearch, $options: 'i' } }
            ]
          },
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { price: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort(sort);

        return res.status(200).json({ success: true, message: 'Products Successfully',products,totalPages,
        currentPage: page,
        limit: limit,
        totalRow: count});

        }catch (error) {

        return res.status(400).json({ success: false,  message: 'Validation Error',error });
        }
        }
  
const store = async(req,res,next)=>{
    try { 
    const { name, price, description} = req.body;
    const images = req.files && req.files.images; 
    const imageUpload=[];
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: true, message: 'No files were uploaded'});
   
    }

    if (!fs.existsSync("public/products/")) {
    fs.mkdirSync("public/products/", { recursive: true });
    }

    if (Array.isArray(images)) {
    images.forEach((image) => {
    const imageName="products/"+Date.now()+ '-' +image.name;
    image.mv(`public/`+imageName, (err) => {
    if (err) {
    return res.status(500).send(err);
    }
    });
    imageUpload.push(imageName);
    });
    }else {

   const imageName="products/"+Date.now()+ '-' +images.name;
    imageUpload.push(imageName);

    images.mv(`public/`+imageName, (err) => {


    if (err) {
    return res.status(500).send(err);
    }


    });
    }

    const product = new Product({
    name,
    price,
    description,
    images:imageUpload
    });

    const data = await product.save();

    return res.status(200).json({ success: true, message: 'Products Added Successfully',data});

    }catch (err) {
    
    let error={};

    if (typeof err === 'object' && err instanceof Error) {
    if(err.code === 11000){

    error={"name":"Product Name is already taken"};
    }else{
    Object.keys(err.errors).forEach((key) => {
    error[key] = err.errors[key].message;
    });
    }
    }else{
    error=err;
    }

    return res
    .status(400)
    .json({ success: false, message: "Validation Error", error  });
    
    }
}

const update = async(req,res,next)=>{
    const { name, price, description} = req.body;
    const images = req.files && req.files.images; 
    const imageUpload=[];

  try {    
    let productID = req.params.productID;
    let updateData ={
    name,
    price, 
    description
    }; 

        if(images){
        const imageexists = await Product.findById(productID);
        if (Array.isArray(imageexists.images)) {
        imageexists.images.forEach((image) => {
          if (fs.existsSync(image)) {
          fs.unlinkSync(image);

          }
        });
        }
        if (Array.isArray(images)) {
          images.forEach((image) => {
          const imageName="products/"+Date.now()+ '-' +image.name;
          image.mv(`public/`+imageName, (err) => {
          if (err) {
          return res.status(500).send(err);
          }
          });
          imageUpload.push(imageName);
          });
          }else {
      
         const imageName="products/"+Date.now()+ '-' +images.name;
          imageUpload.push(imageName);
      
          images.mv(`public/`+imageName, (err) => {
      
      
          if (err) {
          return res.status(500).send(err);
          }
      
      
          });
          }

  
          updateData.images=imageUpload ;

        }

       

    
        
      await Product.findByIdAndUpdate(productID,{$set:updateData});
      const data = await Product.findById(productID);
    if(!data){
    return   res.status(404).json({ success:false , error : 'Product Id Invalid'});
    }


  
    return res.status(200).json({ success: true, message: 'Products Updated Successfully',data});
  }catch (err) {
    
    let error={};

    if (typeof err === 'object' && err instanceof Error) {
    if(err.code === 11000){

    error={"name":"Product Name is already taken"};
    }else{
    Object.keys(err.errors).forEach((key) => {
    error[key] = err.errors[key].message;
    });
    }
    }else{
    error=err;
    }

    return res
    .status(400)
    .json({ success: false, message: "Validation Error", error  });
    
    }
}

//Get Single  Products
const show = async (req,res,next)=>{
  let productID=req.params.productID;
  try {
  const product = await Product.findById(productID);
    if(!product){
    return   res.status(404).json({ success:false , error : 'Product Id Invalid'})
    }
   return   res.status(200).json({ success : true , product  })
  } catch (error) {
      return   res.status(400).json({ success : false , error })
  }
}

// Delete  an  Products
const destroy = async(req,res,next)=>{

      try {    
      let productID = req.params.productID;
      const data = await Product.findOneAndRemove(productID);
      if (Array.isArray(data.images)) {
      data.images.forEach((image) => {
      if (fs.existsSync(image)) {
      fs.unlinkSync(image);
      }
      });
      }
      if(data){
      return res.status(201).json({ success : true , data  })
      }
      return   res.status(404).json({ success:false , error : 'Product Id Invalid'})
      } catch (error) { 
      return  res.status(400).json({ success : false , error })
      }
}


module.exports = {index, show, store, update,destroy }