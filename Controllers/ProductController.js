const Product = require("../models/Product");
const fs = require("fs");

const index = async(req,res,next)=>{
try {    

const products = await Product.find();

return res.json({ success: true, message: 'Products Successfully',products});

}catch (error) {

return res.status(400).json({ success: false, error });
}
}
  
const store = async(req,res,next)=>{

    try {    
    const { name, price, description} = req.body;
    const images = req.files && req.files.images; 
    const imageUpload=[];
    if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
    }

    if (!fs.existsSync("public/products/")) {
    fs.mkdirSync("public/products/", { recursive: true });
    }

    if (Array.isArray(images)) {
    images.forEach((image) => {
    const imageName="public/products/"+Date.now()+ '-' +image.name;
    image.mv(imageName, (err) => {
    if (err) {
    return res.status(500).send(err);
    }
    });
    imageUpload.push(imageName);
    });
    }else {

   const imageName="public/products/"+Date.now()+ '-' +images.name;
    imageUpload.push(imageName);

    images.mv(imageName, (err) => {


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

    return res.json({ success: true, message: 'Products Added Successfully',data});

    }catch (err) {
        console.log(err);
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
    return res.status(400).json({ success: false, error });
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
          const imageName="public/products/"+Date.now()+ '-' +image.name;
          image.mv(imageName, (err) => {
          if (err) {
          return res.status(500).send(err);
          }
          });
          imageUpload.push(imageName);
          });
          }else {
      
         const imageName="public/products/"+Date.now()+ '-' +images.name;
          imageUpload.push(imageName);
      
          images.mv(imageName, (err) => {
      
      
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


  
    return res.json({ success: true, message: 'Products Updated Successfully',data});
  } catch (error) { 
  return  res.status(400).json({ success : false , error })
  }
}

//Get Single  Products
const show = async (req,res,next)=>{
  let productID=req.params.productID;
  try {
  const data = await Product.findById(productID);
    if(!data){
    return   res.status(404).json({ success:false , error : 'Product Id Invalid'})
    }
   return   res.status(200).json({ success : true , data  })
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
