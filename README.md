## Virtual Time Capsule

_IMPORTANT_
Always run in root directory, i.e. Virtual-Time-Capsule

During testing use 'npm start' to test the website.
To exit, press Ctrl + C

Note: replace proxy in package.json file and implement CORS when deploying

## INSTALLS _REQUIRED_

- [node.js](https://nodejs.org/en)
- npm install

## TESTING

- in client repo, run 'npm test'

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Database

docker pull postgres:18.1
docker run --name virtualTimeCapsuleDB -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres:18.1
a