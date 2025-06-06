import { Schema, Document } from 'mongoose';

export const DoctorSchema = new Schema(
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
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    qualifications: [
      {
        type: String,
        required: [true, 'At least one qualification is required'],
        trim: true,
      },
    ],
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot be more than 1000 characters'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
      },
    },
    availability: {
      workingHours: {
        monday: { start: String, end: String },
        tuesday: { start: String, end: String },
        wednesday: { start: String, end: String },
        thursday: { start: String, end: String },
        friday: { start: String, end: String },
        saturday: { start: String, end: String },
        sunday: { start: String, end: String },
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
    profileImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Add indexes for frequently queried fields
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ specialty: 1 });
DoctorSchema.index({ 'location.city': 1 });
DoctorSchema.index({ verified: 1 });

export interface Doctor extends Document {
  name: string;
  email: string;
  specialty: string;
  qualifications: string[];
  phone: string;
  bio: string;
  verified: boolean;
  licenseNumber: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  availability: {
    workingHours: {
      [key: string]: { start: string; end: string };
    };
    isAvailable: boolean;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  languages: string[];
  insuranceAccepted: string[];
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
