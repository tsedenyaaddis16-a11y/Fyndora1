import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    age: {
      type: Number,
      default: 17,
    },
    nationality: {
      type: String,
      default: 'Ethiopia',
    },
    country: {
      type: String,
      default: 'Ethiopia',
    },
    grade: {
      type: String,
      default: 'Grade 11',
    },
    graduationYear: {
      type: Number,
      default: 2027,
    },
    interests: {
      type: [String],
      default: ['Technology', 'Engineering'],
    },
    preferredFields: {
      type: [String],
      default: ['Computer Science', 'Software Engineering'],
    },
    preferredCountries: {
      type: [String],
      default: ['USA', 'Canada', 'Germany'],
    },
    fundingPreference: {
      type: String,
      default: 'Fully funded',
    },
    savedScholarships: [
      {
        scholarship: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Scholarship',
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['Interested', 'Preparing', 'Applied', 'Interview', 'Accepted', 'Rejected'],
          default: 'Interested',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
