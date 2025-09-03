import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return v === '' || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid pincode!`
    }
  },
  profilePhoto: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
farmerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method for farmer signup
farmerSchema.statics.signup = async function(farmerData) {
  try {
    // Check if mobile already exists
    const existingFarmer = await this.findOne({ 
      $or: [
        { mobile: farmerData.mobile },
        { email: farmerData.email ? farmerData.email : undefined }
      ]
    });
    
    if (existingFarmer) {
      throw new Error(
        existingFarmer.mobile === farmerData.mobile 
          ? 'Mobile number already registered' 
          : 'Email already registered'
      );
    }
    
    // Create new farmer
    const farmer = new this(farmerData);
    await farmer.save();
    
    return farmer;
  } catch (error) {
    throw error;
  }
};

// Method to compare password for login
farmerSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Remove password from JSON output
farmerSchema.methods.toJSON = function() {
  const farmer = this.toObject();
  delete farmer.password;
  return farmer;
};

export default mongoose.model('Farmer', farmerSchema, 'FarmerSignUp');