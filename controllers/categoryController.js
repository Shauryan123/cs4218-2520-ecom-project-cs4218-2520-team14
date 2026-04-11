import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

const CATEGORY_LIST_LIMIT = Number(process.env.CATEGORY_LIST_LIMIT || 100);

export const createCategoryController = async (req, res) => {
  try {
    const rawName = req.body?.name;
    const name = typeof rawName === "string" ? rawName.trim() : "";

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name }).lean();
    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name, { lower: true, strict: true }),
    }).save();

    return res.status(201).send({
      success: true,
      message: "New category created",
      category: {
        _id: String(category._id),
        name: category.name,
        slug: category.slug,
      },
    });
  } catch (error) {
    console.log(error);

    if (error?.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Error in Category",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const rawName = req.body?.name;
    const name = typeof rawName === "string" ? rawName.trim() : "";
    const { id } = req.params;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name, { lower: true, strict: true }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category: {
        _id: String(category._id),
        name: category.name,
        slug: category.slug,
      },
    });
  } catch (error) {
    console.log(error);

    if (error?.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Error while updating category",
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({}, { name: 1, slug: 1 })
      .sort({ name: 1 })
      .limit(CATEGORY_LIST_LIMIT)
      .lean();

    return res.status(200).send({
      success: true,
      message: "All Categories List",
      category: categories.map((c) => ({
        _id: String(c._id),
        name: c.name,
        slug: c.slug,
      })),
      totalReturned: categories.length,
      capped: categories.length === CATEGORY_LIST_LIMIT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting all categories",
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel
      .findOne({ slug: req.params.slug }, { name: 1, slug: 1 })
      .lean();

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category: {
        _id: String(category._id),
        name: category.name,
        slug: category.slug,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting single category",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting category",
    });
  }
};