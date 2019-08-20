let filePath = 'node_modules/vue-cli-plugin-prerender-spa/index.js'; 


var fs = require('fs')
fs.readFile(filePath, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/"html"/g, '"html-index"');

  fs.writeFile(filePath, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});