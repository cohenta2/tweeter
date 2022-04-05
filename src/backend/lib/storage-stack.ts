import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ITable, Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";

export class StorageStack extends Stack {
  table: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, "Table", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
    });

    new CfnOutput(this, this.stackName + "TableName", {
      value: this.table.tableName,
    });
  }

  getTable() {
    return this.table;
  }
}
