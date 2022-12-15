const functions = require("firebase-functions");
const { MeiliSearch } = require("meilisearch");

const MeiliClient = new MeiliSearch({
  host: functions.config().meili.host,
  apiKey: functions.config().meili.apikey,
});

const UserIndex = MeiliClient.index("users");

exports.addToMeiliIndex = functions.firestore.document("/users/{uid}")

  .onCreate(snapshot => {
    const newData = snapshot.data();
    const uid = snapshot.id;

    return UserIndex.addDocuments([{ uid, ...newData }])
  })

exports.updateToMeiliIndex = functions.firestore.document("/users/{uid}")

  .onUpdate(snapshot => {
    const newData = snapshot.after.data()
    const uid = snapshot.after.id

    return UserIndex.updateDocuments([{ uid, ...newData }])
  })


exports.deleteFromMeiliIndex = functions.firestore.document("/users/{uid}")

  .onDelete(snapshot => UserIndex.deleteDocument(snapshot.id))
