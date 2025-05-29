import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface DiagnosticQuery {
  nodeId?: string;
  query: string;
  context?: any;
}

export interface DiagnosticResponse {
  analysis: string;
  recommendations: string[];
  severity: "info" | "warning" | "critical";
  confidence: number;
}

export async function analyzeProblem(query: DiagnosticQuery): Promise<DiagnosticResponse> {
  try {
    const prompt = `You are an expert network diagnostician. Analyze the following network issue and provide detailed recommendations.

Query: ${query.query}
${query.nodeId ? `Node ID: ${query.nodeId}` : ''}
${query.context ? `Context: ${JSON.stringify(query.context)}` : ''}

Please provide your analysis in JSON format with the following structure:
{
  "analysis": "Detailed analysis of the problem",
  "recommendations": ["Recommendation 1", "Recommendation 2", "..."],
  "severity": "info|warning|critical",
  "confidence": 0.0-1.0
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert network diagnostician. Analyze network issues and provide actionable recommendations. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      analysis: result.analysis || "Unable to analyze the problem.",
      recommendations: result.recommendations || ["Contact technical support"],
      severity: result.severity || "info",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze network issue: " + (error as Error).message);
  }
}

export async function chatWithAI(message: string, context?: any): Promise<string> {
  try {
    const systemPrompt = `You are an AI network monitoring assistant. You help users understand network performance, diagnose issues, and provide recommendations. Keep responses concise but informative.

Current context: ${context ? JSON.stringify(context) : 'No additional context'}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request.";
  } catch (error) {
    console.error("OpenAI chat error:", error);
    throw new Error("Failed to get AI response: " + (error as Error).message);
  }
}

export async function generateNetworkInsights(performanceData: any): Promise<string[]> {
  try {
    const prompt = `Analyze the following network performance data and generate 3-5 key insights:

${JSON.stringify(performanceData)}

Provide insights as a JSON array of strings, focusing on performance trends, potential issues, and optimization opportunities.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a network performance analyst. Generate actionable insights from network data. Respond with a JSON array of insight strings."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    return result.insights || [];
  } catch (error) {
    console.error("OpenAI insights error:", error);
    return ["Unable to generate insights at this time."];
  }
}
