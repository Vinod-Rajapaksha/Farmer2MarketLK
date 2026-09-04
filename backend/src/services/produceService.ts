import { Produce, ProduceStatus } from '../models/Produce';
import { UserRole } from '../models/User';
import mongoose from 'mongoose';

export const createProduce = async (farmerId: string, data: any, file?: Express.Multer.File) => {
  const produceData = { ...data, farmerId };
  if (file) {
    produceData.imageUrl = file.path;
  }
  return Produce.create(produceData);
};

export const getProduceListings = async (query: any) => {
  const { search, district, category, minPrice, maxPrice, page = 1, limit = 20 } = query;
  
  const filter: any = { status: ProduceStatus.AVAILABLE };

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (district) {
    filter.district = district;
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [produce, total] = await Promise.all([
    Produce.find(filter)
      .populate('farmerId', 'name phone district')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Produce.countDocuments(filter)
  ]);

  return {
    produce,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  };
};

export const getFarmerListings = async (farmerId: string) => {
  return Produce.find({ farmerId }).sort({ createdAt: -1 });
};

export const getProduceById = async (id: string) => {
  const produce = await Produce.findById(id).populate('farmerId', 'name phone district');
  if (!produce) {
    throw new Error('Produce not found');
  }
  return produce;
};

export const updateProduce = async (id: string, farmerId: string, data: any, file?: Express.Multer.File) => {
  const produce = await Produce.findOne({ _id: id, farmerId });
  
  if (!produce) {
    throw new Error('Produce not found or unauthorized');
  }

  const updateData = { ...data };
  if (file) {
    updateData.imageUrl = file.path;
  }

  Object.assign(produce, updateData);
  await produce.save();
  return produce;
};

export const deleteProduce = async (id: string, farmerId: string) => {
  const produce = await Produce.findOneAndDelete({ _id: id, farmerId });
  if (!produce) {
    throw new Error('Produce not found or unauthorized');
  }
  return produce;
};

export const markProduceSold = async (id: string, farmerId: string) => {
  const produce = await Produce.findOne({ _id: id, farmerId });
  if (!produce) {
    throw new Error('Produce not found or unauthorized');
  }
  produce.status = ProduceStatus.SOLD;
  await produce.save();
  return produce;
};