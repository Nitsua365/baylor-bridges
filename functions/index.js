const functions = require("firebase-functions");
const { MeiliSearch } = require("meilisearch");

const MeiliClient = new MeiliSearch({
  host: functions.config().meili.host,
  apiKey: functions.config().meili.apikey,
});

const UserIndex = MeiliClient.index("users");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addToMeiliIndex = functions.firestore.document("/users/{uid}")

  .onCreate(snapshot => {
    const newData = snapshot.data();
    const uid = snapshot.id;

    UserIndex.addDocuments([{ uid, ...newData }])
  })
