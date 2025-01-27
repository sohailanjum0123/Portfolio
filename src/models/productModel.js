import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
      productName: {
        type: String,
        required: [true, 'Product name is required'],
        index: true,
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters'],
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
      },
      category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Home', 'Books', 'Other'],
        default: 'Other',
      },
      stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
      },
      imageUrl: {
        type: String,
        validate: {
          validator: function (url) {
            return /^(http|https):\/\/[^ "]+$/.test(url);
          },
          message: 'Please provide a valid URL',
        },
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
      versionKey: false, // Removes the __v field
    }
  );

  export const Product = mongoose.model("Product",productSchema)