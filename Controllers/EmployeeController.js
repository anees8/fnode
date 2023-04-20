const Employee=require('../models/Employee');

// Get All Employee
const index = async (req,res,next)=> {

    try {
    const data = await Employee.find();
    return  res.status(200).json({ success : true ,message: 'Employee return Successfully', count : data.length  , data  })
    } catch (error) {
        return res.status(400).json({ success : false , error })
    }

}

// Get Single  Employee
const show = async (req,res,next)=>{
    const { employeeID } = req.params;
 
    try {
    const data = await Employee.findById(employeeID);

    if(!data){

        return res.status(400).json({ success : false , error : 'Invalid Employee Detail'})
      
        }
        return res.status(200).json({ success : true,message: 'Single Employee return Successfully' , data  })
    } catch (error) {
        return  res.status(400).json({ success : false , error })
    }
}

// Add an  Employee
const store = async (req,res,next)=>{
    const { name,designation,email,phone,age } = req.body;
    
    try {
    let employee=new Employee({
    name:name,
    designation:designation,
    email:email,
    phone:phone,
    age:age,
    }); 
    const data = await employee.save();
    return res.status(201).json({ success : true ,message: 'Employee Added Successfully', data  })
    } catch (error) {
        return  res.status(400).json({ success : false , error })
    }
  
}

// Update  an  Employee
const update = async (req,res,next)=>{
    const { name,designation,email,phone,age } = req.body;
    const { employeeID } = req.params;
    try {
   
    const emplayee = await Employee.findById(employeeID)
    if(!emplayee){
        return    res.status(400).json({ success : false ,message: 'Employee Updated Successfully', error : 'Invalid Employee Detail' })
    }
    let updateData ={
    name:name,
    designation:designation,
    email:email,
    phone:phone,
    age:age,
    }; 
    await Employee.findByIdAndUpdate(employeeID,{$set:updateData});
    const data = await Employee.findById(employeeID)
    return res.status(200).json({ success : true , data  })
    } catch (error) {
        return res.status(400).json({ success : false , error })
    }

}

// Delete  an  Employee
const destroy = async(req,res,next)=>{
    const { employeeID } = req.params;
    try {    
    const emplayee = await Employee.findById(employeeID)
    if(!emplayee){
        return res.status(400).json({ success : false , error : 'Invalid Employee Detail' })
    }
    const data =   await Employee.findByIdAndDelete(employeeID);
  
    return res.status(201).json({ success : true  ,message: 'Employee Deleted Successfully', data  })
    } catch (error) {
     return res.status(400).json({ success : false, error })
    }
}

module.exports = {index, show, update, store, destroy }