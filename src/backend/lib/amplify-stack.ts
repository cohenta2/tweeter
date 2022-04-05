import { Stack, StackProps, Fn } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";

export class AmplifyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const buildspec = `
      version: 0.1
        frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: public
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
    `;
    new amplify.CfnApp(this, this.stackName, {
      name: this.stackName,
      buildSpec: buildspec,
    });
  }
}
