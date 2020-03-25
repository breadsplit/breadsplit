import { promisify } from 'util'

const nextTick = promisify(process.nextTick)

export async function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: FirebaseFirestore.Query, batchSize: number): Promise<number> {
  const snapshot = await query.get()
  // When there are no documents left, we are done
  if (snapshot.size === 0)
    return 0

  // Delete documents in a batch
  const batch = db.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  const numDeleted = (await batch.commit()).length

  if (numDeleted === 0)
    return 0

  // Recurve on the next process tick, to avoid
  // exploding the stack.
  await nextTick()
  return numDeleted + await deleteQueryBatch(db, query, batchSize)
}

export async function deleteCollection(db: FirebaseFirestore.Firestore, collectionPath: string, batchSize = 100) {
  const collectionRef = db.collection(collectionPath)
  const query = collectionRef.orderBy('__name__').limit(batchSize)

  return await deleteQueryBatch(db, query, batchSize)
}
