import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

export interface AppSyncStackProps extends StackProps {
  table: ITable;
  userPool: IUserPool;
}

export class AppSyncStack extends Stack {
  private table: ITable;
  private userPool: IUserPool;

  constructor(scope: Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);

    this.table = props.table;
    this.userPool = props.userPool;

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "TweeterApi",
      xrayEnabled: true,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.userPool,
          },
        },
      },
    });

    const tableDataSource = api.addDynamoDbDataSource("Table", this.table);
    const tweetInput = new appsync.InputType("TweetInput", {
      definition: {
        body: appsync.GraphqlType.string(),
      },
    });

    api.addType(tweetInput);

    const tweet = new appsync.ObjectType("Tweet", {
      definition: {
        pk: appsync.GraphqlType.string(),
        sk: appsync.GraphqlType.string(),
        id: appsync.GraphqlType.string(),
        userName: appsync.GraphqlType.string(),
        body: appsync.GraphqlType.string(),
      },
    });

    api.addMutation(
      "sendTweet",
      new appsync.ResolvableField({
        returnType: tweet.attribute(),
        args: { body: appsync.GraphqlType.string() },
        dataSource: tableDataSource,
        requestMappingTemplate: appsync.MappingTemplate.fromFile(
          "./lib/resolvers/send-tweet/req.vtl"
        ),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(
          "./lib/resolvers/send-tweet/res.vtl"
        ),
      })
    );

    api.addType(tweet);

    api.addQuery(
      "getTweet",
      new appsync.ResolvableField({
        returnType: tweet.attribute(),
        args: { id: appsync.GraphqlType.string() },
        dataSource: tableDataSource,
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem(
          "pk",
          "id"
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
      })
    );
  }
}
