import * as cdk from "@aws-cdk/core";
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import * as path from "path";
import * as ecrdeploy from "cdk-ecr-deployment";

export class ContainerStack extends cdk.Stack {
  output: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const docker_image_name = process.env.ECR_REPO!;
    const dockerImage = new DockerImageAsset(this, `CreateDockerImage`, {
      directory: path.join(__dirname, "../frontend"),
    });

    new ecrdeploy.ECRDeployment(this, "DeployDockerImage", {
      src: new ecrdeploy.DockerImageName(dockerImage.imageUri),
      dest: new ecrdeploy.DockerImageName(docker_image_name),
    });
  }
}
