This is a redo of the second day of Backend. It's not using a real data base. These are the steps with comments:

Day one:

1. npm init -y (builds the package.json)
2. npm i express
3. .gitignore for /node_modules
4. npm i -D nodemon
5. configure package.json
6. create main/server file
7. npm run dev
8. setup the endpoints
9. npm i express-list-endpoints

Day two, middlewares:

1. npm i http-errors

Day three, cors:

1. npm i cors
2. npm i fs-extra

Info pages:

- expressjs.com (documentation and current version)

package.json configuration steps:

1. "type": "module", (to use new import syntax)
2. "sripts" {
   "dev": "nodemon ./src/server.js",
   }

Example of folder/file structure:

- src folder:
  --> server.js (ONE file that is going to be executed)
  --> api folder
  --> users folder
  --> index.js
