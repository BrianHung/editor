import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

/**
 * To run this edge function locally, you can use the following command:
 * vercel dev
 */

// Create an OpenAI API client (that's edge friendly!)
export const config = { runtime: 'edge' };

const WRITING_ASSISTANT_SYSTEM_PROMPT = `
	You are a writing assistant that generates text based on a prompt.
	You take an input from the user and a command for manipulating the text.
	Output in markdown format. Reply only with generated text.
`;

const {
	AI_API_KEY: apiKey,
	AI_BASE_URL: baseURL = 'https://api.openai.com/v1/',
	AI_MODEL_ID: modelId = 'gpt-4-turbo',
} = process.env;

export async function POST(req: Request): Promise<Response> {
	// Check if the OPENAI_API_KEY is set, if not return 400
	if (!apiKey || apiKey === '') {
		return new Response('Missing apiKey - make sure to add it to your environment.', {
			status: 400,
		});
	}

	const openai = createOpenAI({ apiKey, baseURL });
	const model = openai(modelId);

	const { prompt, command } = await req.json();

	const response = await streamText({
		model,
		system: WRITING_ASSISTANT_SYSTEM_PROMPT,
		messages: [
			{
				role: 'user',
				content: `You have to respect the command: ${command}. For this text: ${prompt}.`,
			},
		],
	});

	// Respond with the stream
	return response.toAIStreamResponse();
}

export function GET(request: Request) {
	return new Response(
		`Hello from the edge! This route only supports POST requests.\n\n${JSON.stringify({ baseURL, apiKey, modelId }, null, 2)}`
	);
}
