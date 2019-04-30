import * as path from 'path'
import * as admin from 'firebase-admin'

/* eslint-disable @typescript-eslint/no-var-requires */
const initTest = require('firebase-functions-test')

const offline = !!process.env.RUN_TEST_OFFLINE
const keypath = process.env.ONLINE_TEST_KEY_PATH || path.join(__dirname, './service-account-key.json')
const projectId = process.env.FIREBASE_PROJECT_ID || 'splitoast-development'

// @ts-ignore
admin.initializeApp = jest.fn()

const test = offline
  ? initTest()
  : initTest({
    projectId,
    databaseURL: `https://${projectId}.firebaseio.com`,
  }, path.resolve(keypath))

describe('Cloud Functions', () => {
  const functions = require('../src')

  afterAll(() => {
    // Do cleanup tasks.
    test.cleanup()
    // Reset the database.
    admin.database().ref('messages').remove()
  })

  describe('Test the tests', () => {
    it('always true', async () => {
      // Create a DataSnapshot
      const snap = test.database.makeDataSnapshot('input', 'messages/11111/original')

      // Wrap the function
      const wrapped = test.wrap(functions.alwaysTrue)

      // Call the wrapped function with the snapshot you constructed.
      expect(await wrapped(snap)).toBeTruthy()
    })
  })
})
