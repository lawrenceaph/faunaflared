export interface Env {
	fauna: string;
	kv: KVNamespace;
	key: string;
	FaunaFlare: DurableObjectNamespace;
}
import { HTML_TEMPLATE } from '../templates/index';
import { handleSyncQuotes, handleQuotes } from './utilities/utils';
// handleDefault controls the response for "/"

export async function handleDefault(env: Env) {
	const cached: any = await env.kv.get('quotes');
	const parsed = JSON.parse(cached);
	return new Response(HTML_TEMPLATE(JSON.stringify(parsed.data)), {
		status: 200,
		headers: {
			'content-type': 'text/html',
		},
	});
}

// routeHandler controls the response for "/syncquotes" and "/quotes"

export async function routeHandler(env: Env, request: Request) {
	const url = new URL(request.url);

	// implement some gatekeeping for security:

	const key = url.searchParams.get('key');
	if (key !== env.key) {
		return new Response(JSON.stringify({ error: 'Invalid key' }), { status: 401 });
	}
	if (url.pathname === '/syncquotes') {
		return handleSyncQuotes(env, url);
	}

	if (url.pathname === '/quotes') {
		return handleQuotes(env);
	}

	return new Response(JSON.stringify({ data: [] }), { status: 200 });
}
