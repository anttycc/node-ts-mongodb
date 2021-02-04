const fs = require('fs');
const path = require('path');
const basepath = `${__dirname}/`;
const isRoute = (file: string) => ((file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json'));
const basename = path.basename(module.filename);

// getting all the handlers and export to swagger apis.
const readdir = (dirname: string, routes: any[]) => {
  fs.readdirSync(dirname)
    .forEach(function (file: any) {
      let filepath = path.join(dirname, file);
      if (fs.lstatSync(filepath).isDirectory()) {
        console.log(file)

        readdir(filepath, routes)
      } else if (isRoute(file)) {
        const route = filepath.replace(basepath, '');
        const handler = require(`./${route}`);
        routes.push(handler)
      }
    });
}

let routesArray: never[] = [];
readdir(__dirname, routesArray);
export const schema: any = Object.assign({}, ...routesArray);