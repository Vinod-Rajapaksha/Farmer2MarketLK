import { Request, Response, NextFunction } from 'express';
import * as produceService from '../services/produceService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createProduce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produce = await produceService.createProduce(req.user!.userId, req.body, req.file);
    res.status(201).json(successResponse('Produce created successfully', produce));
  } catch (error) {
    next(error);
  }
};

export const getProduceListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await produceService.getProduceListings(req.query);
    res.status(200).json(successResponse('Listings fetched successfully', result));
  } catch (error) {
    next(error);
  }
};

export const getFarmerListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produce = await produceService.getFarmerListings(req.user!.userId);
    res.status(200).json(successResponse('Farmer listings fetched successfully', produce));
  } catch (error) {
    next(error);
  }
};

export const getProduceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produce = await produceService.getProduceById(req.params.id as string);
    res.status(200).json(successResponse('Produce fetched successfully', produce));
  } catch (error: any) {
    if (error.message === 'Produce not found') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
};

export const updateProduce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produce = await produceService.updateProduce(req.params.id as string, req.user!.userId, req.body, req.file);
    res.status(200).json(successResponse('Produce updated successfully', produce));
  } catch (error: any) {
    if (error.message === 'Produce not found or unauthorized') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
};

export const deleteProduce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await produceService.deleteProduce(req.params.id as string, req.user!.userId);
    res.status(200).json(successResponse('Produce deleted successfully'));
  } catch (error: any) {
    if (error.message === 'Produce not found or unauthorized') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
};

export const markProduceSold = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produce = await produceService.markProduceSold(req.params.id as string, req.user!.userId);
    res.status(200).json(successResponse('Produce marked as sold', produce));
  } catch (error: any) {
    if (error.message === 'Produce not found or unauthorized') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
};