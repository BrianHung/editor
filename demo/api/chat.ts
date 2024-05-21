import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

const {
	AI_API_KEY: serverApiKey = '',
	AI_BASE_URL: baseURL = 'https://api.openai.com/v1/',
	AI_MODEL_ID: modelId = 'gpt-4-turbo',
	KV_REST_API_URL,
	KV_REST_API_TOKEN,
} = process.env;

const WRITING_ASSISTANT_SYSTEM_PROMPT = `
  You are a writing assistant that generates text based on a prompt.
  You take an input from the user and a command for manipulating the text.
  Output in markdown format. Reply only with generated text.
`;

export async function POST(req: Request) {
	const { messages, clientApiKey } = await req.json();
	let apiKey = clientApiKey || serverApiKey;

	if (!clientApiKey && !serverApiKey) {
		return new Response('Missing serverApiKey - make sure to add it to your environment.', {
			status: 400,
		});
	}

	// Ratelimit request if KV_REST_API_URL and KV_REST_API_TOKEN are set.
	if (!clientApiKey && KV_REST_API_URL && KV_REST_API_TOKEN) {
		const ip = req.headers.get('x-forwarded-for');
		const ratelimit = new Ratelimit({
			redis: kv,
			limiter: Ratelimit.slidingWindow(3, '10 s'),
		});
		const { success, limit, reset, remaining } = await ratelimit.limit(`chat-ratelimit:${ip}`);
		if (!success) {
			return new Response('You have reached your request limit for the day.', {
				status: 429,
				headers: {
					'X-RateLimit-Limit': limit.toString(),
					'X-RateLimit-Remaining': remaining.toString(),
					'X-RateLimit-Reset': reset.toString(),
				},
			});
		}
	}

	const openai = createOpenAI({ apiKey, baseURL });
	const model = openai(modelId);

	const result = await streamText({
		model: model,
		system: WRITING_ASSISTANT_SYSTEM_PROMPT,
		messages: messages,
	});

	return result.toAIStreamResponse();
}

export function GET(request: Request) {
	return new Response(
		`Hello from the edge! This route only supports POST requests.\n\n${JSON.stringify({ baseURL, apiKey, modelId }, null, 2)}`
	);
}
