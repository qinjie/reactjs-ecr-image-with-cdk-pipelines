import * as cdk from "@aws-cdk/core";
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import * as path from "path";
import * as ecrdeploy from "cdk-ecr-deployment";
import * as ecr from "@aws-cdk/aws-ecr";

export class ContainerStack extends cdk.Stack {
  output: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const ecr_repo_account = process.env.ECR_REPO_ACCOUNT!;
    const ecr_repo_name = process.env.ECR_REPO_NAME!;
    const ecr_repo_version = process.env.ECR_REPO_VERSION!;

    const dockerImage = new DockerImageAsset(this, `CreateDockerImage`, {
      directory: path.join(__dirname, "../frontend"),
    });

    /* Try to create the ECR repository */
    try {
      const ecrRepo = new ecr.Repository(this, "EcrRepo", {
        repositoryName: ecr_repo_name,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    } catch (e) {}

    const ecr_image_name = `${ecr_repo_account}/${ecr_repo_name}:${ecr_repo_version}`;
    new ecrdeploy.ECRDeployment(this, "DeployDockerImage", {
      src: new ecrdeploy.DockerImageName(dockerImage.imageUri),
      dest: new ecrdeploy.DockerImageName(ecr_image_name),
    });
  }
}
