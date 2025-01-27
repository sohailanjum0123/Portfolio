import { apiError } from "../utils/apiError.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import { Product } from "../models/productModel.js";
import { apiResponse } from "../utils/apiResponse.js";

const createProduct = asyncHnadler(async(req, res)=>{

const {productName, description, price, category, stock} = req.body;

if([productName,description,price,category,stock].some(product=>!product)){
    throw new apiError(400,"all fields requried")
}

const existedProduct = await Product.findById(productName)
if(existedProduct){
    throw new apiError(400,"Product already exist")
}
const product = await Product.create({
    productName,
    description,
    price, 
    category,
    stock
})


// const existedProduct = await Product.findById(product._ide)
// if(existedProduct){
//     throw new apiError(400,"Product already exist")
// }

return res.status(201).json(new apiResponse(200, existedProduct,"Product created Successfully"))

})

export {createProduct}