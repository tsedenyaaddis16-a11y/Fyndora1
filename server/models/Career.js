import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Career title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Technology',
        'Medicine & Health',
        'Engineering',
        'Business',
        'Science',
        'Law',
        'Arts & Media',
        'Education',
        'Social Sciences',
        'Design',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    highSchoolSubjects: {
      type: [String],
      default: [],
    },
    universitySubjects: {
      type: [String],
      default: [],
    },
    relatedCareers: {
      type: [String],
      default: [],
    },
    workplaces: {
      type: [String],
      default: [],
    },
    resources: [
      {
        name: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Career = mongoose.model('Career', careerSchema);
