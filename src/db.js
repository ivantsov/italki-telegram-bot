const {DynamoDB} = require('aws-sdk');

const TABLE_NAME = 'italki-schedule';
const ID = 1;

const db = new DynamoDB.DocumentClient({region: process.env.AWS_REGION});

function get() {
  return db
    .get({
      TableName: TABLE_NAME,
      Key: {
        id: ID,
      },
    })
    .promise();
}

function addOrUpdate(data) {
  return db
    .put({
      TableName: TABLE_NAME,
      Item: {
        id: ID,
        items: data,
      },
    })
    .promise();
}

module.exports = {
  get,
  addOrUpdate,
};
