import { Stack, StackProps, Fn } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import { SecretValue, aws_codebuild } from "aws-cdk-lib";
import { IUserPool, IUserPoolClient } from "aws-cdk-lib/aws-cognito";

export interface AmplifyStackProps extends StackProps {
  userPool: IUserPool;
  webClient: IUserPoolClient;
}

export class AmplifyStack extends Stack {
  private userPool: IUserPool;
  private webClient: IUserPoolClient;

  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props);

    this.userPool = props.userPool;
    this.webClient = props.webClient;

    // new aws_codebuild.BuildSpec.fromObject({
    //   version: 0.1,
    // });
    const buildspec = `
      version: 0.1
        frontend:
          phases:
            preBuild:
              commands:
                - export REACT_APP_USER_POOL_ID=${this.userPool.userPoolId}
                - export REACT_APP_WEB_CLIENT=${this.webClient.userPoolClientId}
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
    // new amplify.CfnApp(this, this.stackName, {
    //   name: this.stackName,
    //   buildSpec: buildspec,
    // });
    const amplifyApp = new amplify.App(this, this.stackName, {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "cohenta2",
        repository: "tweeter",
        oauthToken: SecretValue.secretsManager("my-github-token"),
      }),
      buildSpec: buildspec,
      autoBranchDeletion: true, // Automatically disconnect a branch when you delete a branch from your repository
    });
  }
}
