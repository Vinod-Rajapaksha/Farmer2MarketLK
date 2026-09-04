import mongoose from 'mongoose';

export enum ProduceStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}

export interface IProduce extends mongoose.Document {
  farmerId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  district: string;
  availableDate: Date;
  description?: string;
  imageUrl?: string;
  status: ProduceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const produceSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.1,
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    district: {
      type: String,
      required: true,
    },
    availableDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String, // Cloudinary image URL
    },
    status: {
      type: String,
      enum: Object.values(ProduceStatus),
      default: ProduceStatus.AVAILABLE,
    },
  },
  {
    timestamps: true,
  }
);

export const Produce = mongoose.model<IProduce>('Produce', produceSchema);