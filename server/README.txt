Remember to type 'npm i' before testing the server.

The quickest way to run the project after making changes is by running the 'npm run dev' command.


Server files are written in TypeScript inside of the root/src directory.

TypeScript files can be compiled to root/dist using 'npm run build',
followed by 'npm run start', to use node to run the compiled files in root/dist.

Alternatively, the 'ts-node' module can be used to compile and run files in-memory,
saving time.



For testing that the database is properly synchronized, try out these steps.

First, run the server with 'npm run dev'.
Next, run the client in another terminal with 'npm run dev'.
Once on the localhost:port URL provided by the client's console output, try pasting the following (or similar) information
into the terminal (comes up when you press f12):

await fetch('http://localhost:8000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'alex',
    email: 'alex@gmail.com',
    password: 'password123',
    firstName: 'Alexander',
    lastName: 'Stasyna'
  })
}).then(r => r.json())

