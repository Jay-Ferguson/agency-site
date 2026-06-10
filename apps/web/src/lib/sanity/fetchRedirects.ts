// fallow-ignore-file unused-file
import { client } from "./client";
import { REDIRECTS_QUERY } from "./query";
// This function fetches redirects from Sanity using the predefined REDIRECTS_QUERY.
// It uses the Sanity client to execute the query and return the results.
export async function fetchRedirects() {
  return client.fetch(REDIRECTS_QUERY);
}
