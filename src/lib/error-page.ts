export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="bs">
  <head>
    <meta charset="utf-8" />
    <title>Stranica se nije učitala | AZUR</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    <style>
      body { font: 15px/1.6 Georgia, "Times New Roman", serif; background: #f8f5ec; color: #1c2a4a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
      .card { max-width: 28rem; width: 100%; }
      .brand { letter-spacing: 0.25em; font-size: 1.4rem; }
      .code { font-style: italic; color: #b8913f; font-size: 3.5rem; margin: 2.5rem 0 0.5rem; }
      h1 { font-weight: 400; font-size: 1.6rem; margin: 0 0 0.5rem; }
      p { color: #5b6478; margin: 0 0 2rem; font-family: system-ui, sans-serif; font-size: 14px; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.75rem 1.5rem; border-radius: 999px; font: 12px system-ui, sans-serif; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #1c2a4a; color: #d4b06a; }
      .secondary { background: transparent; color: #1c2a4a; border-color: #c9ccd4; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">AZUR</div>
      <div class="code">Ups</div>
      <h1>Stranica se nije učitala</h1>
      <p>Nešto je pošlo po zlu. Pokušajte ponovo ili se vratite na početnu.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Pokušaj ponovo</button>
        <a class="secondary" href="/">Na početnu</a>
      </div>
    </div>
  </body>
</html>`;
}
