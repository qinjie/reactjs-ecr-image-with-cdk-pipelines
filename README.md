# ReactJS ECR Image with CDK Pipeline

Deploy ReactJS project as a docker image and upload it to ECR repository using CDK Pipeline.
Any code commmit into GitHub repository will cause the pipeline to mutate and container image to be rebuilt.

## 1. Initial Project Structure

### Prerequisite

Install and configure following tools on your computer.

- Installed NodeJS (LTS or higher) and npm / yarn
- Installed Typescript (3)
- Installed AWS CLI (1.16 or higher)
- Installed CDK CLI ( npm i -g cdk )
- Configured AWS Account ( aws configure )

### CDK Project

Initialize a blank CDK project.

```
cdk init app --language typescript
```

Folder structure with key files/folders in a CDK project.

```
├── README.md
├── bin
├── cdk.json
├── lib
├── package-lock.json
├── package.json
```

Add following line in `cdk.json`.

```
context"@aws-cdk/core:newStyleStackSynthesis": true
```

Run following command to bootstrap cdk.

```
cdk bootstrap --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

Install libraries from CDK

```bash
npm install @aws-cdk/core @aws-cdk/aws-s3 @aws-cdk/aws-cloudfront @aws-cdk/aws-iam @aws-cdk/aws-codebuild @aws-cdk/aws-codepipeline @aws-cdk/aws-codepipeline-actions @aws-cdk/aws-route53 @aws-cdk/aws-route53-targets @aws-cdk/aws-certificatemanager @aws-cdk/pipelines @aws-cdk/aws-s3-deployment
```

Install other libraries

```
npm install dotenv
```

In the `tsconfig.json` file, update `exclude` attribute.

```
"exclude": ["node_modules", "cdk.out", "docs", "frontend"]
```

### ReactJS Project

Create a React App using `create-react-app` in `frontend` folder.

```
npx create-react-app frontend --template typescript
```

Add `Dockerfile` with following content

```
# stage1 - build react app first
FROM node:12.16.1-alpine3.9 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --silent
COPY . ./
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Add `.dockerignore` file with following content

```
node_modules
build
.git
*.md
.gitignore
.dockerignore
Dockerfile
Dockerfile.prod
```

## 2. Stacks

## 3. Deployment

### Create Code Pipeline

Run `cdk deploy` to create the code pipeline first. It will create all resources, build and deploy code from repo.

Subsequent code commit into the repo will trigger the pipeline to self-mutate and redeploy code.

### Destroy Code Pipeline

To destroy the pipeline, destroy all sub-stacks first before running `cdk destroy`. If not, sub-stacks will not be removed and they need to manually remove sub-stack from AWS console.

## 4. Others

### Exclude Folders

1. When CDK code is compiled to build the pipeline, it will compile all TypeScript files. Thus if your application code is also in TypeScript, exclude it from compilation. In the cdk `tsconfig.json` file, add the application code folder in the `exclude`.

   ```json
     "exclude": ["node_modules", "cdk.out", "docs", "frontend"]
   ```

### Remove .git Folder in Application Code

1.  By default, React or Angular project auto includes `.git` folder. Remove it since we already have a `.git` folder in the project root.

- Remove `./frontend/.git` folder if it exists.

### Docker Ignore File

1. Not all files need to be copied during docker image building. Add a `.dockerignore` file to exclude files/folders from building process.

   ```
   node_modules
   build
   .git
   *.md
   .gitignore
   .dockerignore
   Dockerfile
   Dockerfile.prod
   ```

### ReactJS Compilation

There may be compilation error related to `Jest` version. If really cannot find solution, add following line in `.env` file to ignore it.

```
SKIP_PREFLIGHT_CHECK=true
```

### Reference
