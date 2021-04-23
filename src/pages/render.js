function renderHead({ title }) {
  return `
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/css/reset.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
  <title>${title}</title>
</head>
`;
}

function main({ title, scripts, body }) {
  return `
<!DOCTYPE html>
<html lang="en">

${renderHead({ title })}

<body>
  ${renderContent(body)}
  ${(scripts || [])
    .map((script) => `<script src="${script}"></script>`)
    .join("\n")}
</body>

</html>
`;
}

function renderContent(content) {
  return `
<main style="max-width: 600px; margin: auto;">
  ${content}
</main>
`;
}

export default Object.assign(main, {
  head: renderHead,
  main: renderContent,
});
