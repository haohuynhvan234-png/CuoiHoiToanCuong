import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Category from "./src/models/categoryModel.js";
import Product from "./src/models/productModel.js";
import User from "./src/models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function seed() {
  await connectDB();

  const countCat = await Category.countDocuments();
  if (countCat === 0) {
    console.log("Seeding categories and products...");
    const cat1 = await Category.create({
      name: "Bàn Ghế Tiffany & Banquet",
      description: "Các loại bàn ghế tiệc cưới sang trọng",
    });
    const cat2 = await Category.create({
      name: "Nhà Bạt & Rạp Sự Kiện",
      description: "Rạp nhôm đúc, nhà bạt không gian trong suốt",
    });
    const cat3 = await Category.create({
      name: "Khung Backdrop & Cổng Hoa Cưới",
      description: "Cổng hoa lụa, backdrop chụp hình check-in nghệ thuật",
    });
    const cat4 = await Category.create({
      name: "Sân Khấu, Âm Thanh, Ánh Sáng",
      description: "Thiết bị biểu diễn chuyên nghiệp và loa Line Array",
    });

    await Product.create([
      {
        name: "Ghế Chiavari / Tiffany Vàng Gold",
        category: cat1._id,
        pricePerDay: 35000,
        quantity: 350,
        location: "Kho Quận 7, TP.HCM",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
        description: "Ghế Tiffany mạ vàng sang trọng kèm nệm da PU trắng êm ái.",
        isAvailable: true,
      },
      {
        name: "Rạp Cưới Phong Cách Châu Âu (100m²)",
        category: cat2._id,
        pricePerDay: 4500000,
        quantity: 4,
        location: "Kho Quận 7, TP.HCM",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
        description: "Nhà bạt sự kiện chống mưa nắng tuyệt đối, thiết kế trang nhã.",
        isAvailable: true,
      },
      {
        name: "Ghế Louis XVI Sơn Trắng Bọc Nệm Da",
        category: cat1._id,
        pricePerDay: 65000,
        quantity: 120,
        location: "Kho Quận 7, TP.HCM",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
        description: "Dòng ghế hoàng gia kiểu Pháp cổ điển cho các bàn tiệc VIP.",
        isAvailable: true,
      },
      {
        name: "Backdrop Hoa Lụa Sang Trọng Tone Trắng Kem",
        category: cat3._id,
        pricePerDay: 3200000,
        quantity: 3,
        location: "Kho Quận 7, TP.HCM",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
        description: "Backdrop check-in phong cách Hàn Quốc tone màu ngọt ngào.",
        isAvailable: true,
      },
      {
        name: "Bộ Loa Line Array & Mixer Kỹ Thuật Số",
        category: cat4._id,
        pricePerDay: 5500000,
        quantity: 2,
        location: "Kho Quận 7, TP.HCM",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        description: "Dàn âm thanh phục vụ tiệc 300 - 800 khách, âm trầm uy lực.",
        isAvailable: true,
      },
    ]);
  }

  // Admin user check
  const adminUser = await User.findOne({ email: "admin@gmail.com" });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin Toàn Cường",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      age: 30,
      authType: "local",
    });
    console.log("Created default admin: admin@gmail.com / admin123");
  }

  console.log("Seeding finished!");
  process.exit(0);
}

seed();