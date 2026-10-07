import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm không được để trống'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Giá thuê theo ngày không được để trống'],
      min: [0, 'Giá thuê không thể nhỏ hơn 0']
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng không được để trống'],
      min: [0, 'Số lượng không thể nhỏ hơn 0']
    },
    image: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục không được để trống']
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Product', productSchema);
