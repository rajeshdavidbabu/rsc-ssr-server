import React from "react";
import { renderJSXToClientJSX, renderJSXToHTML, stringifyJSX } from "./utils";
import { Post, BlogIndexPage, BlogLayout } from "./components";
import sanitizeFilename from "sanitize-filename";

function Router({ url }) {
  let page;
  if (url.pathname === "/") {
    page = <BlogIndexPage />;
  } else {
    const postSlug = sanitizeFilename(url.pathname.slice(1));
    page = <Post slug={postSlug} />;
  }
  return <BlogLayout children={undefined}>{page}</BlogLayout>;
}

export async function htmlGenerator(url: URL) {
  // Match the URL to a page and load the data it needs.
  const clientJSX = await renderJSXToClientJSX(<Router url={url} />);
  const jsxString = clientJSXString(clientJSX); // Indent with two spaces

  let html = await renderJSXToHTML(clientJSX);
  html += `<script>window.__INITIAL_CLIENT_JSX_STRING__ = `;
  html += JSON.stringify(jsxString).replace(/</g, "\\u003c");
  html += `</script>`;
  html += `
        <script type="importmap">
          {
            "imports": {
              "react": "https://esm.sh/react@18.2.0",
              "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
            }
          }
        </script>
        <script type="module" src="/client.js"></script>
      `;

  return html;
}

function clientJSXString(jsx) {
  const clientJSXString = JSON.stringify(jsx, stringifyJSX, 2); // Indent with two spaces

  return clientJSXString;
}

export async function jsxGenerator(url: URL) {
  // Match the URL to a page and load the data it needs.

  const clientJSX = await renderJSXToClientJSX(<Router url={url} />);

  return clientJSXString(clientJSX);
}
