/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

import Typesense from "typesense";

let client = new Typesense.Client({
  'nodes': [{
    'host': 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
    'port': 8108,      // For Typesense Cloud use 443
    'protocol': 'http'   // For Typesense Cloud use https
  }],
  'apiKey': '5DcmJ1K7mR2zRh26Ept9J2ttSfH0uUOvfMHc0jSVmXR0W9ce',
  'connectionTimeoutSeconds': 2
})

import fs from "fs/promises";

const booksInJsonl = await fs.readFile("books.jsonl");
client.collections('books').documents().import(booksInJsonl);

