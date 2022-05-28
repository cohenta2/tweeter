import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ITable, Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class StorageStack extends Stack {
  private table: ITable;
  private userPool: cognito.IUserPool;
  private client: cognito.IUserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, "Table", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
    });

    this.userPool = new cognito.UserPool(this, "ApiUserPool", {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    this.client = this.userPool.addClient("app-client", {
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    new CfnOutput(this, this.stackName + "TableName", {
      value: this.table.tableName,
    });
  }

  getTable(): ITable {
    return this.table;
  }

  getUserPool(): cognito.IUserPool {
    return this.userPool;
  }

  getWebClient(): cognito.IUserPoolClient {
    return this.client;
  }
}
