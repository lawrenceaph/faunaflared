import { handleDefault, routeHandler } from './handlers/handlers';

export interface Env {
	fauna: string;
	kv: KVNamespace;
	key: string;
	FaunaFlare: DurableObjectNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== 'GET') {
			return new Response('Method not allowed', { status: 405 });
		}

		const url = new URL(request.url);

		if (url.pathname === '/syncquotes' || url.pathname === '/quotes') {
			return routeHandler(env, request);
		}

		if (url.pathname === '/count') {
			const id = 'counter';
			const durableID = env.FaunaFlare.idFromName(id);
			const durableObject = env.FaunaFlare.get(durableID);

			const response = await durableObject.fetch(request);
			return response;
		}
		// redirect all other routes to "/"

		if (url.pathname != '/') {
			return new Response('', {
				status: 301,
				headers: {
					Location: url.origin + '/',
				},
			});
		}
		return handleDefault(env);
	},
};

export class FaunaFlare {
	state: DurableObjectState;
	request: Request;
	env: Env;
	url: URL;

	constructor(state: DurableObjectState, env: Env, url: URL, request: Request) {
		this.state = state;
		this.env = env as Env;
		this.url = url;
		this.request = request;
	}

	async fetch(request: Request, env: Env, url: URL) {
		const getcount = (await this.state.storage.get('count')) as number;
		const count = getcount || 0;

		await this.state.storage.put('count', count + 1);

		return new Response(JSON.stringify({ count: count }), {
			status: 200,
		});
	}
}
