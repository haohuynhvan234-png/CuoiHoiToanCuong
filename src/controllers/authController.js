import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import firebaseAuth from '../config/firebase.js';

// Helper loai bo password khoi user object tra ve
const removePassword = (user) => {
  const data = user.toObject ? user.toObject() : { ...user };
  delete data.password;
  return data;
};

// Dang ky (Register)
export const register = async (req, res, next) => {
  try {
    const { name, email, password, birthDate, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email và password là bắt buộc',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: 'Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: example@gmail.com)',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password phải có ít nhất 6 ký tự',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    let calculatedAge = age || 18;
    let validBirthDate = null;

    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      if (isNaN(birth.getTime())) {
        return res.status(400).json({
          message: 'Ngày sinh không đúng định dạng',
          error: 'BadRequest',
          statusCode: 400
        });
      }
      if (birth > today) {
        return res.status(400).json({
          message: 'Ngày sinh không được vượt quá ngày hiện tại',
          error: 'BadRequest',
          statusCode: 400
        });
      }

      let diffYears = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        diffYears--;
      }

      if (diffYears > 100) {
        return res.status(400).json({
          message: 'Tuổi không được vượt quá 100 tuổi',
          error: 'BadRequest',
          statusCode: 400
        });
      }
      calculatedAge = diffYears;
      validBirthDate = birth;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email đã được đăng ký',
        error: 'Conflict',
        statusCode: 409
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      authType: 'local',
      age: calculatedAge,
      birthDate: validBirthDate
    });

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      data: removePassword(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi đăng ký',
      error: 'InternalServerError',
      statusCode: 500
    });
  }
};

// Dang nhap (Login + JWT)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email và password là bắt buộc',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không đúng',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    if (user.authType === 'google' && !user.password) {
      return res.status(400).json({
        message: 'Tài khoản này được đăng ký bằng Google. Vui lòng chọn đăng nhập bằng Google.',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không đúng',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    const secret = process.env.JWT_SECRET || 'my_super_secret_jwt_key_2026';
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: removePassword(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi đăng nhập',
      error: 'InternalServerError',
      statusCode: 500
    });
  }
};

// Dang nhap bang Google Firebase (Google Sign-In)
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: 'idToken là bắt buộc',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    if (!firebaseAuth) {
      return res.status(500).json({
        message: 'Firebase Admin SDK chưa được cấu hình trên server',
        error: 'InternalServerError',
        statusCode: 500
      });
    }

    let decodedToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(idToken);
    } catch (verifyError) {
      return res.status(401).json({
        message: 'Firebase idToken không hợp lệ hoặc đã hết hạn',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({
        message: 'Tài khoản Google không có email hợp lệ',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      let shouldSave = false;
      if (!user.googleId) {
        user.googleId = uid;
        shouldSave = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId: uid,
        avatar: picture || '',
        authType: 'google',
        role: 'user'
      });
    }

    const secret = process.env.JWT_SECRET || 'my_super_secret_jwt_key_2026';
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Đăng nhập Google thành công',
      token,
      user: removePassword(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi đăng nhập Google',
      error: 'InternalServerError',
      statusCode: 500
    });
  }
};

// Lay thong tin user hien tai (/me)
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      message: 'Lấy thông tin người dùng thành công',
      user: removePassword(req.user)
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server',
      error: 'InternalServerError',
      statusCode: 500
    });
  }
};

// Doi mat khau (Change Password)
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: 'Mật khẩu cũ và mật khẩu mới là bắt buộc',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng',
        error: 'NotFound',
        statusCode: 404
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: 'Tài khoản đăng ký qua mạng xã hội chưa thiết lập mật khẩu',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Mật khẩu cũ không chính xác',
        error: 'BadRequest',
        statusCode: 400
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi server khi đổi mật khẩu',
      error: 'InternalServerError',
      statusCode: 500
    });
  }
};

// Logout
export const logout = async (req, res, next) => {
  return res.status(200).json({
    message: 'Đăng xuất thành công. Vui lòng xóa token ở phía client.'
  });
};

// Test RBAC Admin Dashboard
export const getAdminDashboard = async (req, res, next) => {
  return res.status(200).json({
    message: 'Chào mừng Admin đến với trang quản trị',
    admin: removePassword(req.user)
  });
};