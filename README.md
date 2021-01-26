# pai-dan-system


## Alpha
http://54.248.158.236/  
http://54.248.158.236/management  
admin:123qwe


## Develop environment
### Node.js
We will run tests on node.js v12 and v14.  
We recommended to use v14.
```bash
brew install node@14
```


### Database
Please use [Homebrew](https://brew.sh/) or [Docker](https://www.docker.com/) to install database server.  

#### MongoDB
```bash
# Download the docker image.
docker pull mongo:4.2

# Create the docker container from the image mongo:4.2.
docker run --name mongo -p 27017:27017 -d mongo:4.2
```

#### Redis
```bash
# Download the docker image.
docker pull redis:6

# Create the docker container from the image redis:6.
docker run --name redis -p 6379:6379 -d redis:6
```

#### Docker commands
```bash
# Show running containers.
docker ps

# Show all conntainers (include stop).
docker ps -a

# Start the container by name.
docker start {container-name}

# Stop the container by name.
docker stop {container-name}

# Remove the container by name.
docker rm {container-name}

# Remove the image by name.
docker rmi {image-name}
```


### Ansible
We use [Ansible](https://github.com/ansible/ansible) to deploy.  
```bash
brew install ansible
```


## Branch
### [develop](https://github.com/ljit-io/pai-dan-system/tree/develop)
The development flow:
1. Create a new branch from `develop` to develop.  
2. Create a pull-request to merge from your feature branch into `develop`.


## NPM Commands
### init
Create collections and default data.
```bash
npm run init
```

### start
Start the development server.  
Webpack port config: `config/default.js:WEBPACK.PORT`  
Client API port config: `config/default.js:SERVER.CLIENT.PORT`  
Management API port config: `config/default.js:SERVER.MANAGEMENT.PORT`  
```bash
npm start
```

### eslint
Run [eslint](https://github.com/eslint/eslint) to check JavaScript syntax.
```bash
npm run eslint
```

### ncu
Run [npm-check-updates](https://github.com/raineorshine/npm-check-updates) to check node modules updates.
```bash
npm run ncu
```

### build
Build frontend app in production mode.
```bash
npm run build
```

### Frontend Dev
```bash
npm run dev
```

client: http://localhost:3003/client  
management http://localhost:3003/management

### Setup server
Install database and setup services on the new server.
```bash
npm run setup:alpha
```

### Deploy
Build frontend app then deploy web on the server.
```bash
npm run deploy:alpha
```

### E2E (Puppeteer)
Run [Puppeteer](https://github.com/puppeteer/puppeteer) to end-to-end test.
```bash
npm run test:e2e
```


## Release
The alpha site use release branch.  
The production site use master branch.  
Merge flow: `develop` -> `release` -> `master`

### 1. Update version at `package.json`.
1. Create a new branch to update `version` at `package.json`.
2. Create a pull-request from your branch into `develop`.

### 2. Merge into [release](https://github.com/ljit-io/pai-dan-system/tree/release) branch.
1. Create a new branch from `develop` branch.
2. Run `npm run changelog` to generate the changelog.
3. Create a pull-request from your branch into `release`.
4. Append the changelog at the pull-request comment.

### 3. Tag version.
1. Checkout the latest `release` branch.
2. Add a tag at the `release` branch then push it.
3. Goto GitHub [release page](https://github.com/ljit-io/pai-dan-system/releases) then create a release with changelog.
