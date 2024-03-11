const fs = require('fs');
var TurndownService = require('turndown');
var blogArticles = require('./blog_articles.json');

const writeJsonToFile = (fileName, data) => {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
};

var turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

var markdownArticles = blogArticles
  .filter((article) => article.content.includes('<p>'))
  .filter((article) => !article.content.includes('<table>'))
  .map((article) => ({
    ...article,
    content: turndownService.turndown(article.content),
  }));

writeJsonToFile('blog-article-markdown.json', markdownArticles);

const convertToSqlUpdate = (article) => {
  return `UPDATE blog_articles SET content = '${article.content
    .replace(/'/g, "''")
    .replace(/\*\*\*\*\-/g, '**\n**-')
    .replace(/\*\*\*\*/g, '** **')}'

  WHERE id = ${article.id} and updated_at <= '2024-03-11 10:57:13.193000';`;
};

var sqlUpdates = markdownArticles.map(convertToSqlUpdate);
fs.writeFileSync('blog-article-sql-updates.sql', sqlUpdates.join('\n'));
