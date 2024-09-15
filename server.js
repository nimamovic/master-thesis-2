const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

AWS.config.update({
  region: 'eu-north-1'
});

const dynamoDBdocumentClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'Items';

app.use(bodyParser.json());

AWS.config.update({
  region: 'eu-north-1'
});

app.get('/items', (req, res) => {
  const params = {
    TableName: tableName
  };

  dynamoDBdocumentClient.scan(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error while fatching items', details: err });
    } else {
      res.json(data.Items);
    }
  });
});

app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: tableName,
    Key: { id: id }
  };

  dynamoDB.get(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error while fatching item with id: ' + id, details: err });
    } else if (!data.Item) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.json(data.Item);
    }
  });
});

app.post('/items', (req, res) => {
  const { name } = req.body;
  const params = {
    TableName: tableName,
    Item: {
      id: uuidv4(),
      name: name
    }
  };

  dynamoDBdocumentClient.put(params, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error while adding item.', details: err });
    } else {
      res.json({ message: 'Item added', item: params.Item });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});