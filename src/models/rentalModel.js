import mongoose from 'mongoose';

const rentalItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'ID sản phẩm không được để trống']
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng thuê không được để trống'],
      min: [1, 'Số lượng thuê tối thiểu là 1']
    },
    price: {
      type: Number,
      required: [true, 'Đơn giá thuê không được để trống'],
      min: [0, 'Đơn giá thuê không thể nhỏ hơn 0']
    }
  },
  { _id: false }
);

const rentalSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Tên khách hàng không được để trống'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại không được để trống'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ tổ chức sự kiện không được để trống'],
      trim: true
    },
    eventDate: {
      type: Date,
      required: [true, 'Ngày bắt đầu sự kiện không được để trống']
    },
    returnDate: {
      type: Date,
      required: [true, 'Ngày trả đồ sự kiện không được để trống']
    },
    products: {
      type: [rentalItemSchema],
      required: [true, 'Danh sách sản phẩm thuê không được để trống'],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Đơn thuê phải có ít nhất 1 sản phẩm'
      }
    },
    totalPrice: {
      type: Number,
      required: [true, 'Tổng tiền không được để trống'],
      min: [0, 'Tổng tiền không thể nhỏ hơn 0']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'returned', 'cancelled'],
      default: 'pending'
    },
    note: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Rental', rentalSchema);
