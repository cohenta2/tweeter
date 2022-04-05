#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AmplifyStack } from "../lib/amplify-stack";
import { StorageStack } from "../lib/storage-stack";
import { AppSyncStack } from "../lib/appsync-stack";

const app = new cdk.App();
new AmplifyStack(app, "TweeterAmplify", {});

const storage = new StorageStack(app, "TweeterStorage", {});
const table = storage.getTable();
new AppSyncStack(app, "TweeterAppSync", table, {});
