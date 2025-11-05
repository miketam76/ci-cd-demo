# Step 1: Choose a Sample Web Application

You need a simple app to test CI/CD on. For example:

Node.js: a simple Express server 

Python Flask: “Hello World” app

Static HTML/CSS/JS: simplest form

Lets go with Node.JS for our example:

```
mkdir ci-cd-demo
cd ci-cd-demo
npm init -y
npm install express
```

Create index.js:

```
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World from CI/CD demo!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```


Create package.json scripts:
```
"scripts": {
  "start": "node index.js",
  "test": "echo \"No tests yet\" && exit 0"
}
```
# Step 2: Dockerize the Application

You need a Dockerfile to package your app.

Create a Dockerfile in the project root:

```
# Use Node.js official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

Test locally:
```
docker build -t ci-cd-demo .
docker run -p 3000:3000 ci-cd-demo
```

Open http://localhost:3000 — you should see your app running.

# Step 3: Push Code to GitHub

Create a new GitHub repo (ci-cd-demo).

Add your code:
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
#Step 4: Set Up GitHub Actions (CI/CD)

In your repo, create the folder:
.github/workflows/

Create a workflow file, e.g., ci-cd.yml:
```
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repo
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Build Docker image
      run: docker build -t ci-cd-demo .

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Push Docker image
      run: docker tag ci-cd-demo <your-dockerhub-username>/ci-cd-demo:latest
    - run: docker push <your-dockerhub-username>/ci-cd-demo:latest
```

You’ll need to add Docker Hub credentials in GitHub Secrets: DOCKER_USERNAME and DOCKER_PASSWORD.

# Step 5: Test the CI/CD Pipeline

Commit a small change to index.js.

Push to main.

Go to Actions tab on GitHub and watch your workflow run.

The workflow should:

- Install dependencies
- Run tests
- Build Docker image
- Push to Docker Hub
