const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      required: true,
    },
    userDepartment: {
      type: String,
      default: 'General',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    department: {
      type: String,
      default: 'All Departments',
    },
    location: {
      type: String,
      default: 'Faculty Campus / Matara',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline date is required'],
    },
    language: {
      type: String,
      default: 'English / Sinhala',
    },
    eligibility: {
      type: String,
      default: 'Registered Faculty of Technology Students',
    },
    requirements: {
      type: [String],
      default: [],
    },
    requiredDocuments: {
      type: [String],
      default: ['Student ID', 'National ID'],
    },
    accessibilityNotes: {
      type: String,
      default: 'Wheelchair accessible building. Online assistance available.',
    },
    supportAvailable: {
      type: String,
      default: 'Help desk and volunteer support available weekdays.',
    },
    contactPerson: {
      type: String,
      default: 'Student Affairs Unit',
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '041-2292200',
    },
    applicationUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'Open',
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 5.0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = opportunitySchema;
