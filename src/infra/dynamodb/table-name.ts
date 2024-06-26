const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export default process.env.databaseTable || DYNAMODB_TABLE_NAME;
