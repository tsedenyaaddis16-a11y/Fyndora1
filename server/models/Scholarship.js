import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Scholarship title is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    country: {
      type: String,
      default: 'International',
    },
    destination: {
      type: String,
      required: [true, 'Destination country or region is required'],
    },
    educationLevel: {
      type: String,
      enum: ['High school', 'Undergraduate', 'Graduate', 'Any'],
      default: 'Undergraduate',
    },
    eligibleNationalities: {
      type: [String],
      default: ['All Nationalities'],
    },
    minimumAge: {
      type: Number,
      default: null,
    },
    maximumAge: {
      type: Number,
      default: null,
    },
    eligibleGrades: {
      type: [String],
      default: [],
    },
    fields: {
      type: [String],
      default: ['Any'],
    },
    fundingType: {
      type: String,
      enum: ['Fully funded', 'Partially funded', 'Tuition waiver'],
      default: 'Fully funded',
    },
    coverage: {
      type: [String],
      default: ['Tuition'],
    },
    boarding: {
      type: Boolean,
      default: false,
    },
    languageRequirements: {
      type: String,
      default: '',
    },
    academicRequirements: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    applicationUrl: {
      type: String,
      default: '',
    },
    officialWebsite: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    lastVerified: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'archived'],
      default: 'active',
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search performance
scholarshipSchema.index({ title: 'text', provider: 'text', description: 'text', destination: 'text' });

export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
