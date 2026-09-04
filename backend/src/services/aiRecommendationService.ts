import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import { Produce, ProduceStatus } from "../models/Produce";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const recommendProduce = async (query: string) => {
  // 1. Fetch available produce
  const availableProduce = await Produce.find({
    status: ProduceStatus.AVAILABLE,
  }).select("_id name category quantity unit price district availableDate");

  if (availableProduce.length === 0) {
    return { recommendations: [] };
  }

  // 2. Formulate prompt
  const prompt = `
  You are an AI assistant for an agricultural marketplace called Farmer2MarketLK.
  A buyer is looking for produce with the following requirement:
  "${query}"

  Here is the JSON list of currently available produce:
  ${JSON.stringify(availableProduce)}

  Task:
  Analyze the buyer's requirement and match it against the available produce. 
  Return the best matches ranked by suitability (matchScore out of 100).
  Only include produce that somewhat matches the requirement.

  You must respond ONLY with a valid JSON object in the exact following format, without any markdown formatting or extra text:
  {
    "recommendations": [
      {
        "produceId": "id string",
        "matchScore": number,
        "reason": ["Reason 1", "Reason 2"]
      }
    ]
  }
  `;

  // 3. Call Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 4. Parse response
  try {
    // Strip markdown formatting if Gemini accidentally included it
    const jsonStr = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(jsonStr);

    // 5. Populate full produce data for the recommendations
    if (
      parsedData.recommendations &&
      Array.isArray(parsedData.recommendations)
    ) {
      const populatedRecommendations = await Promise.all(
        parsedData.recommendations.map(async (rec: any) => {
          const produce = await Produce.findById(rec.produceId).populate(
            "farmerId",
            "name phone district",
          );
          return {
            produce,
            matchScore: rec.matchScore,
            reason: rec.reason,
          };
        }),
      );

      // Filter out null produce in case AI hallucinated an ID, and sort by score
      const validRecs = populatedRecommendations
        .filter((r) => r.produce !== null)
        .sort((a, b) => b.matchScore - a.matchScore);

      return { recommendations: validRecs };
    }

    return { recommendations: [] };
  } catch (error) {
    console.error("Failed to parse Gemini response:", responseText, error);
    throw new Error(
      "AI failed to process the request correctly. Please try again.",
    );
  }
};
