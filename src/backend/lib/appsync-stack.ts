import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

export class AppSyncStack extends Stack {
  constructor(scope: Construct, id: string, table: ITable, props?: StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "TweeterApi",
      xrayEnabled: true,
    });

    const tableDataSource = api.addDynamoDbDataSource("Table", table);
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
