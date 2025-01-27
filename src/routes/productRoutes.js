import {Router} from "express"
import {createProduct} from "../controllers/productController.js"

const router = Router();



router.route("/productCreate").post(createProduct)

export default router