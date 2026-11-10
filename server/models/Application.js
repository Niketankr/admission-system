import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Selected', 'Rejected'],
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // One application per applicant
    },
    // Personal Details
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    guardianName: {
      type: String,
      required: [true, 'Guardian name is required'],
      trim: true
    },

    // Academic Details
    tenthBoard: {
      type: String,
      required: [true, '10th Board is required'],
      trim: true
    },
    tenthPercentage: {
      type: Number,
      required: [true, '10th percentage is required'],
      min: 0,
      max: 100
    },
    twelfthBoard: {
      type: String,
      required: [true, '12th Board is required'],
      trim: true
    },
    twelfthPercentage: {
      type: Number,
      required: [true, '12th percentage is required'],
      min: 0,
      max: 100
    },
    entranceScore: {
      type: Number,
      default: null,
      min: 0
    },

    // Department / Program
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Computer Science & Engineering',
        'Information Technology',
        'Electronics & Communication Engineering',
        'Mechanical Engineering',
        'Civil Engineering'
      ]
    },

    // Uploaded Documents (Marksheet / Certificate)
    document: {
      originalName: { type: String, required: true },
      filename: { type: String, required: true },
      path: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true },
      uploadedAt: { type: Date, default: Date.now }
    },

    // Status Workflow
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Selected', 'Rejected'],
      default: 'Submitted'
    },

    statusHistory: [statusHistorySchema]
  },
  {
    timestamps: true
  }
);

// Method to validate allowed status transitions (Workflow Engine)
applicationSchema.statics.isValidTransition = function (currentStatus, newStatus) {
  const allowedTransitions = {
    Submitted: ['Under Review'],
    'Under Review': ['Selected', 'Rejected'],
    Selected: ['Under Review'],
    Rejected: ['Under Review']
  };

  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
};

export const Application = mongoose.model('Application', applicationSchema);

