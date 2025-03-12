"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageUpload_1 = require("../utils/imageUpload");
const userControllers_1 = require("../controllers/userControllers");
const userControllerInstance = new userControllers_1.UserController();
const route = (0, express_1.Router)();
route.post("/parseData", imageUpload_1.upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
]), (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
}, userControllerInstance.ParseAdhaarData.bind(userControllerInstance));
exports.default = route;
