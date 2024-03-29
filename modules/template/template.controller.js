const { sendWelcomeMail } = require("../../utils/sendMail");
const Template = require("./template.model");
const { generateLink } = require("./template.service");

const createTemplate = async (req, res) => {
  try {
    const isExist = await Template.findOne({ email: req.body?.email });
    if (isExist) {
      const updateResult = await Template.updateOne(
        {
          _id: isExist?._id.toString(),
        },
        req.body,
        { new: true }
      );
      const template = await Template.findOne({ _id: isExist?._id.toString() });
      res.status(200).json({
        success: true,
        message: "Template Update Success",
        data: template,
      });
    } else {
      const link = await generateLink();
      if (link) {
        req.body["template_link"] = link;
      }
      const newNewTemplate = new Template(req.body);
      const result = await newNewTemplate.save();
      res.status(200).json({
        success: true,
        message: "Template Create Success",
        data: result,
      });
    }
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Template Create Failed",
      error_message: error.message,
    });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const result = await Template.findOne({
      template_link: req.params.template_link,
    });
    res.status(200).json({
      success: true,
      message: "Template Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Template Retrieve Failed",
      error_message: error.message,
    });
  }
};

const updateTemplateById = async (req, res) => {
  try {
    const result = await Template.updateOne(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Template Update Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Template Update Failed",
      error_message: error.message,
    });
  }
};

const sendSourceCode = async (req, res) => {
  try {
    const result = await sendWelcomeMail(req.body);
    res.status(200).json({
      success: true,
      message: "Template Send Success",
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Template Send Failed",
      error_message: error.message,
    });
  }
};

module.exports = {
  createTemplate,
  getTemplateById,
  sendSourceCode,
  updateTemplateById,
};
