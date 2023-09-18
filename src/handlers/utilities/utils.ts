import { Client, query as q } from 'faunadb';

interface Env {
	fauna: string;
	key: string;
	kv: KVNamespace;
}

const { Paginate, Map, Lambda, Get, Var, Index, Match } = q;

export async function handleSyncQuotes(env: Env, url: URL): Promise<Response> {
	const client = new Client({
		secret: env.fauna,
	});

	const query = Map(Paginate(Match(Index('quotes'))), Lambda('x', Get(Var('x'))));
	const getData: any = await client.query(query);

	await env.kv.put('quotes', JSON.stringify({ data: getData.data[0].data.quotes }));
	const test = await env.kv.get('quotes');
	const parsed = JSON.parse(test as string);
	return new Response(JSON.stringify(parsed), { status: 200 });
}

export async function handleQuotes(env: Env): Promise<Response> {
	const cached: any = await env.kv.get('quotes');
	const parsed = JSON.parse(cached);
	if (parsed) {
		return new Response(JSON.stringify(parsed), { status: 200 });
	}
	return new Response(JSON.stringify({ data: [] }), { status: 200 });
}
