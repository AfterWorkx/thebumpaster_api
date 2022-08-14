import mongoose, { ConnectOptions } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Logger from '../logger'
import { v4 } from 'uuid'

const logger = Logger('Database')

/**
 *
 */
export function generateMongoDBURI() {
  let uri = ''

  if (process.env.DB_URI) {
    return process.env.DB_URI as string
  } else {
    uri = 'mongodb://'
  }

  if (
    process.env.DB_USER !== undefined &&
    process.env.DB_PASS !== undefined &&
    process.env.DB_USER !== '' &&
    process.env.DB_PASS !== ''
  ) {
    uri += process.env.DB_USER + ':' + process.env.DB_PASS + '@'
  }

  uri += process.env.DB_HOST

  if (process.env.DB_PORT !== undefined && process.env.DB_PORT !== '') {
    uri += ':' + process.env.DB_PORT
  } else {
    uri += ':27017'
  }

  if (process.env.DB_NAME !== undefined && process.env.DB_NAME !== '') {
    uri += '/' + process.env.DB_NAME
  } else {
    uri += '/' + v4()
  }

  if (
    process.env.DB_AUTH_SOURCE !== undefined &&
    process.env.DB_AUTH_SOURCE !== ''
  ) {
    uri += '?authSource=' + process.env.DB_AUTH_SOURCE
  }

  return uri
}

/**
 *
 */
export default async function initializeMongooseClient(
  mock = false
): Promise<mongoose.Mongoose> {
  const options: ConnectOptions = {
    autoIndex: true,
    autoCreate: true,
  }

  if (mock) {
    const server = await MongoMemoryServer.create()
    const uri = server.getUri('test')

    logger.info(
      'Initializing in test environment, mongodb-memory-server on uri: ' + uri
    )
    return mongoose.connect(uri, options)
  } else {
    if (process.env.DB_AUTH_SOURCE !== undefined) {
      Object.assign(options, { authSource: process.env.DB_AUTH_SOURCE })
    }
    const uri = generateMongoDBURI()

    logger.info('Initializing service connection on uri: ' + uri)
    return mongoose.connect(uri, options)
  }
}
