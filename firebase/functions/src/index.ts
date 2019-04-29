import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

export const joinGroup = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    await admin.firestore()
      .collection('groups')
      .doc(data.groupid)
      .set({
        memberIds: [context.auth.uid],
      }, {
        merge: true,
      })
  }
})
