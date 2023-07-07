const Category = require("../models/Category");


const index = async (req, res, next) => {
    try {
        const search = req.query.search || "";
    
        const namesearch = req.query.namesearch || "";
        const descriptionsearch = req.query.descriptionsearch || "";

        const categoryQuery = {
          $and: [
            {
              $and: [
                { name: { $regex: namesearch, $options: "i" } },
                { description: { $regex: descriptionsearch, $options: "i" } }
              ]
            },
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
              ]
            }
          ]
        };
    
        const count = await Category.countDocuments(categoryQuery);
        const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        const limit = parseInt(req.query.limit); // Set the number of items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip
        const sort = req.query.sort || "createdAt";
        const categories = await Category.find(categoryQuery)
            .skip(skip)
            .limit(limit)
            .sort(sort);
    
        const totalPages = Math.ceil(count / limit) || categories.length;
    
        return res.status(200).json({
          success: true,
          message: "Categories Successfully",
          categories,
          totalPages,
          currentPage: page,
          limit: limit || -1,
          totalRow: count
        });
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Validation Error", error });
      }
};

const store = async (req, res, next) => {
    return res.status(400).json({ success :true  })

};

const update = async (req, res, next) => {  
    return res.status(400).json({ success :true  })
};

//Get Single  Categorys
const show = async (req, res, next) => {
    return res.status(400).json({ success :true  })

};

// Delete  an  Categorys
const destroy = async (req, res, next) => {
    return res.status(400).json({ success :true  })
};

module.exports = { index, show, store, update, destroy };
