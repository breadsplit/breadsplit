import * as path from 'path'
import * as admin from 'firebase-admin'
import * as functions from '../src'

/* eslint-disable @typescript-eslint/no-var-requires */
const initTest = require('firebase-functions-test')

const keypath = process.env.ONLINE_TEST_KEY_PATH || path.join(__dirname, './service-account-key.json')
const projectId = process.env.FIREBASE_PROJECT_ID || 'splitoast-test'

const test = initTest({ projectId }, path.resolve(keypath))

describe('Cloud Functions', () => {
  afterAll(() => {
    // Do cleanup tasks.
    test.cleanup()
    // TODO: Reset the data
    admin.firestore()
  })

  describe('Test the tests', () => {
    it('always true', async () => {
      // Wrap the function
      const wrapped = test.wrap(functions.alwaysTrue)

      // Call the wrapped function with the snapshot you constructed.
      expect(await wrapped()).toBeTruthy()
    })
  })

  describe('Get group count', () => {
    it('zero when empty', async () => {
      // Create a DataSnapshot
      const snap = test.firestore.makeDocumentSnapshot({ groups: [] }, '')

      // Wrap the function
      const wrapped = test.wrap(functions.groupsCount)

      // Call the wrapped function with the snapshot you constructed.
      expect(await wrapped(snap)).toEqual(0)
    })
  })
})
