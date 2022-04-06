import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ITable, Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import {
  IUserPool,
  UserPool,
  AccountRecovery,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";

export class StorageStack extends Stack {
  private table: ITable;
  private userPool: IUserPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, "Table", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
    });

    this.userPool = new UserPool(this, "ApiUserPool", {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
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

    new CfnOutput(this, this.stackName + "TableName", {
      value: this.table.tableName,
    });
  }

  getTable(): ITable {
    return this.table;
  }

  getUserPool(): IUserPool {
    return this.userPool;
  }
}
