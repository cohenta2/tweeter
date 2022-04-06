#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AmplifyStack } from "../lib/amplify-stack";
import { StorageStack } from "../lib/storage-stack";
import { AppSyncStack, AppSyncStackProps } from "../lib/appsync-stack";

const app = new cdk.App();
new AmplifyStack(app, "TweeterAmplify", {});

const storage = new StorageStack(app, "TweeterStorage", {});
const table = storage.getTable();
const userPool = storage.getUserPool();
const props = {
  table,
  userPool,
};
new AppSyncStack(app, "TweeterAppSync", props);
