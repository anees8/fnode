const Category = require("../models/Category");
const fs = require("fs");

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
            { description: { $regex: search, $options: "i" } }
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
  const { name,status, description } = req.body;
  const images = req.files && req.files.images;
  let imageName = "";
  const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

  try {
    if (!fs.existsSync("public/categories/")) {
      fs.mkdirSync("public/categories/", { recursive: true });
    }
    if (images) {
      if (!ALLOWED_IMAGE_TYPES.includes(images.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          error: { images: "Only PNG and JPEG images are allowed." }
        });
      }
      if (images.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          error: { images: "Image size exceeds the limit of 2MB." }
        });
      }
      imageName = "categories/" + Date.now() + "-" + images.name;

      images.mv(`public/` + imageName, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }

    const category = new Category({
      name,
      description,
      status,
      images: imageName
    });

    const data = await category.save();

    if (data) {
      return res
        .status(200)
        .json({ success: true, message: "Category Added Successfully", data });
    }
  } catch (err) {
    let error = {};
    if (typeof err === "object" && err instanceof Error) {
      if (err.code === 11000) {
        error = { name: "Category Name is already taken" };
        if (imageName) {
          if (fs.existsSync(`public/` + imageName)) {
            fs.unlinkSync(`public/` + imageName);
          }
        }
      } else {
        Object.keys(err.errors).forEach((key) => {
          error[key] = err.errors[key].message;
        });
      }
    } else {
      error = err;
    }
    return res
      .status(400)
      .json({ success: false, message: "Validation Error", error });
  }
};

const update = async (req, res, next) => {
  const { name,description,status } = req.body;
  const images = req.files && req.files.images;
  let imageName = "";
  const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

  try {
    let categoryID = req.params.categoryID;
    let updateData = {
      name,
      description,status
    };

    if (images) {
      const imageexists = await Category.findById(categoryID);
      if (imageexists.images) {
        if (fs.existsSync(`public/` + imageexists.images)) {
          fs.unlinkSync(`public/` + imageexists.images);
        }
      }

      if (images) {
        if (!ALLOWED_IMAGE_TYPES.includes(images.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "Validation Error",
            error: { images: "Only PNG and JPEG images are allowed." }
          });
        }
        if (images.size > MAX_IMAGE_SIZE) {
          return res.status(400).json({
            success: false,
            message: "Validation Error",
            error: { images: "Image size exceeds the limit of 2MB." }
          });
        }

        imageName = "categories/" + Date.now() + "-" + images.name;

        images.mv(`public/` + imageName, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
        });
      }

      updateData.images = imageName;
    }

    const data = await Category.findByIdAndUpdate(
      categoryID,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!data) {
      return res
        .status(404)
        .json({ success: false, error: "Category Id Invalid" });
    }

    return res.status(200).json({
      success: true,
      message: "Categories Updated Successfully",
      data
    });
  } catch (err) {
    let error = {};

    if (typeof err === "object" && err instanceof Error) {
      if (err.code === 11000) {
        error = { name: "Category Name is already taken" };
        if (Array.isArray(imageUpload)) {
          imageUpload.forEach((image) => {
            if (fs.existsSync(`public/` + image)) {
              fs.unlinkSync(`public/` + image);
            }
          });
        }
      } else {
        Object.keys(err.errors).forEach((key) => {
          error[key] = err.errors[key].message;
        });
      }
    } else {
      error = err;
    }

    return res
      .status(400)
      .json({ success: false, message: "Validation Error", error });
  }
};

const updatestatus =async (req, res, next) => {
  const {status } = req.body;

  try {
    let categoryID = req.params.categoryID;
    let updateData = {
      status
    };

    const data = await Category.findByIdAndUpdate(
      categoryID,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!data) {
      return res
        .status(404)
        .json({ success: false, error: "Category Id Invalid" });
    }

    return res.status(200).json({
      success: true,
      message: "Category Status Updated Successfully",
      data
    });
  } catch (err) {
    let error = {};

        if (typeof err === "object" && err instanceof Error) {
        Object.keys(err.errors).forEach((key) => {
        error[key] = err.errors[key].message;
        });

        } else {
        error = err;
        }

    return res
      .status(400)
      .json({ success: false, message: "Validation Error", error });
  }
};
//Get Single  Category
const show = async (req, res, next) => {
  let categoryID = req.params.categoryID;
  try {
    const category = await Category.findById(categoryID);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Catgory Id Invalid" });
    }
    return res.status(200).json({ success: true, category });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

// Delete  an  Category
const destroy = async (req, res, next) => {
  try {
    let categoryID = req.params.categoryID;
    const data = await Category.findByIdAndDelete(categoryID);
    if (data.images) {
      if (fs.existsSync(`public/` + data.images)) {
        fs.unlinkSync(`public/` + data.images);
      }
    }

    if (data) {
      return res.status(201).json({ success: true, data });
    }
    return res
      .status(404)
      .json({ success: false, error: "Category Id Invalid" });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

module.exports = { index, show, store, update,updatestatus, destroy };
