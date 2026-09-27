import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Opportunity type is required'],
      enum: [
        'Scholarship',
        'Competition',
        'Internship',
        'Summer Program',
        'Fellowship',
        'Leadership Program',
        'Academic Program',
        'Conferences',
      ],
      default: 'Summer Program',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    country: {
      type: String,
      default: 'Global',
    },
    eligibility: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    funding: {
      type: String,
      default: '',
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
    status: {
      type: String,
      enum: ['active', 'expired', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Opportunity = mongoose.model('Opportunity', opportunitySchema);
