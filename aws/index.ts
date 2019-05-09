import { DynamoDB } from "aws-sdk";

import { DYNAMODB_REGION } from "../constant"


export const dynamoDBClient = new DynamoDB.DocumentClient({region: DYNAMODB_REGION});
