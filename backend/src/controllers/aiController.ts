import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/aiRecommendationService';
import { successResponse } from '../utils/apiResponse';

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.body;
    const result = await aiService.recommendProduce(query);
    res.status(200).json(successResponse('AI recommendations generated', result));
  } catch (error) {
    next(error);
  }
};
