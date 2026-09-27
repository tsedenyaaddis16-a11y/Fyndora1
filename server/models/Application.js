import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
    },
    scholarshipTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Interested', 'Preparing', 'Applied', 'Interview', 'Accepted', 'Rejected'],
      default: 'Preparing',
    },
    deadline: {
      type: Date,
      default: null,
    },
    dateApplied: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    checklist: [
      {
        text: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model('Application', applicationSchema);
