#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AmplifyStack } from "../lib/amplify-stack";
import { StorageStack } from "../lib/storage-stack";
import { AppSyncStack, AppSyncStackProps } from "../lib/appsync-stack";

const app = new cdk.App();

const storage = new StorageStack(app, "TweeterStorage", {});
const table = storage.getTable();
const userPool = storage.getUserPool();
const webClient = storage.getWebClient();

const appSyncProps = {
  table,
  userPool,
};

const amplifyProps = {
  userPool,
  webClient,
};
new AmplifyStack(app, "TweeterAmplify", amplifyProps);
new AppSyncStack(app, "TweeterAppSync", appSyncProps);
