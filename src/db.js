const {DynamoDB} = require('aws-sdk');

const tableName = process.env.TABLE_NAME;
const ID = 1;

const db = new DynamoDB.DocumentClient();

function get() {
  return db
    .get({
      TableName: tableName,
      Key: {
        id: ID,
      },
    })
    .promise();
}

function addOrUpdate(data) {
  return db
    .put({
      TableName: tableName,
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
