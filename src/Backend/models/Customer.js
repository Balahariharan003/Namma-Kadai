import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return v === "" || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: { type: String, required: true, minlength: 6 },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{6}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid pincode!`,
    },
  },
  profilePhoto: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt
customerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method for signup
customerSchema.statics.signup = async function (customerData) {
  try {
    const existingCustomer = await this.findOne({
      $or: [
        { mobile: customerData.mobile },
        { email: customerData.email ? customerData.email : undefined },
      ],
    });

    if (existingCustomer) {
      throw new Error(
        existingCustomer.mobile === customerData.mobile
          ? "Mobile number already registered"
          : "Email already registered"
      );
    }

    const customer = new this(customerData);
    await customer.save();
    return customer;
  } catch (error) {
    throw error;
  }
};

// Compare password
customerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Remove password from JSON output
customerSchema.methods.toJSON = function () {
  const customer = this.toObject();
  delete customer.password;
  return customer;
};

export default mongoose.model("Customer", customerSchema, "CustomerSignUp");
