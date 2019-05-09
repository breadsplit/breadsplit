import * as path from 'path'
import * as admin from 'firebase-admin'
import * as functions from '../src'
import { Group } from '../../../types/models'
import { deleteCollection } from './_utils'

/* eslint-disable @typescript-eslint/no-var-requires */
const initTest = require('firebase-functions-test')

const keypath = process.env.ONLINE_TEST_KEY_PATH || path.join(__dirname, './service-account-key.json')
const projectId = process.env.FIREBASE_PROJECT_ID || 'breadsplit-test'

const test = initTest({ projectId }, path.resolve(keypath))

describe('Cloud Functions', () => {
  const collection = admin.firestore().collection('groups')

  beforeAll(async () => {
    await deleteCollection(admin.firestore(), 'groups')
    expect(await test.wrap(functions.groupsCount)()).toEqual(0)
  })

  afterAll(async () => {
    // Do cleanup tasks.
    test.cleanup()
    // Reset the data
    await deleteCollection(admin.firestore(), 'groups')
  })

  describe('Get group count', () => {
    it('zero when empty', async () => {
      // Wrap the function
      const wrapped = test.wrap(functions.groupsCount)

      // Call the wrapped function with the snapshot you constructed.
      expect(await wrapped()).toEqual(0)
    })

    it('add one', async () => {
      const wrapped = test.wrap(functions.groupsCount)

      await collection.doc('addone').set({})
      expect(await wrapped()).toEqual(1)
      await collection.doc('addone').delete()
      expect(await wrapped()).toEqual(0)
    })
  })

  describe('PublishGroup', () => {
    it('demo', async () => {
      const wrapped = test.wrap(functions.publishGroup)

      const group: Group = {
        id: '233',
        name: 'Good',
        options: {
          multiple_currencies: true,
        },
        currencies: [],
        timestamp: +new Date(),
        members: {},
        transactions: [],
        activities: [],
        currency_records: [],
      }
      await wrapped({ group }, { auth: { uid: 'yes' } })
    })
  })
})
