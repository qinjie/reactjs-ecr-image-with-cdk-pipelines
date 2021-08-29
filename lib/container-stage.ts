import * as cdk from "@aws-cdk/core";
import { ContainerStack } from "./container-stack";

export class ContainerStage extends cdk.Stage {
  public readonly output: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);

    const stack = new ContainerStack(this, id, props);
    this.output = stack.output;
  }
}
