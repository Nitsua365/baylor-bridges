const functions = require("firebase-functions");
const { MeiliSearch } = require("meilisearch");

const MeiliClient = new MeiliSearch({
  host: (process.env.NODE_ENV === "production") ? functions.config().meili.host : functions.config().meili.dev_host,
  apiKey: (process.env.NODE_ENV === "production") ? functions.config().meili.apikey : functions.config().meili.dev_apikey,
});

const UserIndex = MeiliClient.index("users");

exports.addToMeiliIndex = functions.firestore.document("/users/{uid}")

  .onCreate(snapshot => {
    try {
      const newData = snapshot.data();
      const uid = snapshot.id;

      const res = UserIndex.addDocuments([{ uid, ...newData }])

      functions.logger.info(`[${(new Date()).toString()}] CREATED MEILISEARCH DOCUMENT [User Id]: ${uid}`)

      return res
    }
    catch (e) {
      functions.logger.error(`[${(new Date()).toString()}] CREATED MEILISEARCH DOCUMENT [User Id]: ${snapshot.id} ERROR: ${e.toString()}`)
    }
    
  })

exports.updateToMeiliIndex = functions.firestore.document("/users/{uid}")

  .onUpdate(snapshot => {
    try {
      const newData = snapshot.after.data()
      const uid = snapshot.after.id

      const res = UserIndex.updateDocuments([{ uid, ...newData }])

      functions.logger.info(`[${(new Date()).toString()}] UPDATED MEILISEARCH DOCUMENT [User Id]: ${uid}`)

      return res
    }
    catch (e) {
      functions.logger.error(`[${(new Date()).toString()}] UPDATED MEILISEARCH DOCUMENT [User Id]: ${snapshot.after.id} ERROR: ${e.toString()}`)
    }
  })


exports.deleteFromMeiliIndex = functions.firestore.document("/users/{uid}")

  .onDelete(snapshot => {
    try {
      const res = UserIndex.deleteDocument(snapshot.id)

      functions.logger.info(`[${(new Date()).toString()}] DELETED MEILISEARCH DOCUMENT [User Id]: ${snapshot.id}`)

      return res
    }
    catch (e) {
      functions.logger.error(`[${(new Date()).toString()}] UPDATED MEILISEARCH DOCUMENT [User Id]: ${snapshot.id} ERROR: ${e.toString()}`)
    }
    
  })
