const Head = ({ title }) => `
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/css/reset.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
  <title>${title}</title>
</head>
`;

const Main = ({ title, scripts, body }) => `
<!DOCTYPE html>
<html lang="en">

${Head({ title })}

<body>
  ${Content(body)}
  ${(scripts || [])
    .map((script) => `<script src="${script}"></script>`)
    .join("\n")}
</body>

</html>
`;

const Content = (content) => `
<main style="max-width: 600px; margin: auto;">
  ${content}
</main>
`;

export default Object.assign(Main, {
  head: Head,
  main: Content,
});
