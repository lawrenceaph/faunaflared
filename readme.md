# Fauna and Cloudflare Workers Quotes App 

This repository contains the source code for https://faunaflared.aritao.workers.dev/. 

<img width="800" alt="scap" src="https://imagedelivery.net/HML6qmlXDXx6EPV6zNm9VA/a63fd381-da1f-45f7-10bd-b053c5491e00/public">


Every five seconds, the site displays a new quote. The master copy of all quotes is kept in a Fauna database. Fauna is a document relational database accessible through an API.

For performance and cost-effectiveness, a cached copy of the quotes is kept in a Cloudflare KV (key value store). When the site is visited, the Cloudflare Worker pulls data from the kv store and fills up the array of quotes before serving the html to the browser. Strictly speaking, the quotes are loaded by the Worker into the javascript portion of the index.html file. 

When the quotes array is updated in Fauna, a sync can be triggered through the "/syncquotes" route, which functions like a webhook. This triggers a database call to fauna, which returns fresh data. That data is then synced with Cloudflare's key value store, and eventually (almost immediately), new visits to the site will receive the fresh content. 

Security and testing features: 

The "/syncquotes" route requires a unique search parameter for requests to the sync route as a protective measure.

To double check the quotes used by the site, the "/quotes" route can be visited. Content on this route is gated as well to prevent unauthorized access. 





