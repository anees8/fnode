const Employee=require('../models/Employee');

// Get All Employee
const index = async (req,res,next)=> {

    try {
    const data = await Employee.find();
   return res.status(200).json({ success : true , count : data.length  , data  })
    } catch (error) {
        return res.status(400).json({ success : false , error })
    }

}

// Get Single  Employee
const show = async (req,res,next)=>{
    let employeeID=req.params.employeeID;
    try {
    const data = await Employee.findById(employeeID);

        if(!data){
            return   res.status(404).json({ success:false , error : 'Employee Not Found'})
        }
        return   res.status(200).json({ success : true , data  })
    } catch (error) {
        return   res.status(400).json({ success : false , error })
    }
}

// Add an  Employee
const store = async (req,res,next)=>{
  
    try {
    let employee=new Employee({
    name:req.body.name,
    designation:req.body.designation,
    email:req.body.email,
    phone:req.body.phone,
    age:req.body.age,
    }); 
    const data = await employee.save();
    return  res.status(201).json({ success : true , data  })
    } catch (error) {
        return   res.status(400).json({ success : false , error })
    }
  
}

// Update  an  Employee
const update = async (req,res,next)=>{

    try {
    let employeeID = req.params.employeeID;
    let updateData ={
    name:req.body.name,
    designation:req.body.designation,
    email:req.body.email,
    phone:req.body.phone,
    age:req.body.age,
    }; 
    const data = await Employee.findByIdAndUpdate(employeeID,{$set:updateData});
    return  res.status(200).json({ success : true , data  })
    } catch (error) {
        return  res.status(400).json({ success : false , error })
    }

}

// Delete  an  Employee
const destroy = async(req,res,next)=>{

    try {    
    let employeeID = req.params.employeeID;
    const data = await Employee.findOneAndRemove(employeeID);
    return res.status(201).json({ success : true , data  })
    } catch (error) {
        return  res.status(400).json({ success : false , error })
    }
}

module.exports = {index, show, update, store, destroy }