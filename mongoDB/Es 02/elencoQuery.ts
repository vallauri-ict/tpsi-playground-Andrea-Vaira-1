// mongoDb
import { MongoClient, ObjectId } from "mongodb";
const connectionString =
  "mongodb+srv://admin:admin@cluster0.ieoh65s.mongodb.net/?retryWrites=true&w=majority";
const connectionStringLocal = "mongodb://localhost:27017";
const DBNAME = "5b";

/***********USER LISTENER****************/

// Query 1
let conn1 = MongoClient.connect(connectionString);
conn1.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn1.then((client: any) => {
  let collection = client.db(DBNAME).collection("orders");
  collection
    .aggregate([
      { $match: { status: "A" } },
      { $group: { _id: "$cust_id", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 1 -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// Query 2
let conn2 = MongoClient.connect(connectionString);
conn2.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn2.then((client: any) => {
  let collection = client.db(DBNAME).collection("orders");
  collection
    .aggregate([
      {
        $group: {
          _id: "$cust_id",
          avgAmount: { $avg: "$amount" },
          avgTotal: { $avg: { $multiply: ["$qta", "$amount"] } },
        },
      },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 2 -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// Query 3
let conn3 = MongoClient.connect(connectionString);
conn3.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn3.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .aggregate([
      { $match: { gender: { $exists: true } } },
      {
        $group: {
          _id: "$gender",
          nEsemplari: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 3 -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// Query 4
let conn4 = MongoClient.connect(connectionString);
conn4.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn4.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .aggregate([
      { $match: { gender: { $exists: true } } },
      {
        $group: {
          _id: "$gender",
          vampiriUccisi: { $avg: "$vampires" },
        },
      },
      { $sort: { vampiriUccisi: -1 } },
      { $project: { vampiriUccisi: { $round: "$vampiriUccisi" } } },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 4 -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// Query 5
let conn5 = MongoClient.connect(connectionString);
conn5.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn5.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .aggregate([
      { $match: { gender: { $exists: true } } },
      {
        $group: {
          _id: { genere: "$gender", pelo: "$hair" },
          nEsemplari: { $sum: 1 },
          vampiriUccisi: { $avg: "$vampires" },
        },
      },
      { $sort: { nEsemplari: -1 } },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 5 -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// Query 6
let conn6 = MongoClient.connect(connectionString);
conn6.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn6.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .aggregate([
      { $match: { gender: { $exists: true } } },
      {
        $group: {
          _id: {},
          nEsemplari: { $sum: 1 },
          vampiriUccisi: { $avg: "$vampires" },
        },
      },
      { $sort: { nEsemplari: -1 } },
      { $project: { _id: 0 } },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 6 -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// Query 7a
let conn7 = MongoClient.connect(connectionString);
conn7.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn7.then((client: any) => {
  let collection = client.db(DBNAME).collection("quizzes");
  collection
    .aggregate([{ $project: {
      quizAvg : {$round:{$avg:'$quizzes'}},
      labAvg: {$avg:'$labs'},
      examAvg: {$avg: ['$midterm', '$final']}
    } }])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 7a -->", data);
    })
    .finally(() => {
      client.close();
    });
});

// 7b
let conn7b = MongoClient.connect(connectionString);
conn7b.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn7b.then((client: any) => {
  let collection = client.db(DBNAME).collection("quizzes");
  collection
    .aggregate([
      {
        $project: {
          quizAvg: { $round: { $avg: "$quizzes" } },
          labAvg: { $avg: "$labs" },
          examAvg: { $avg: ["$midterm", "$final"] },
        },
        $group: {
          _id:{},
          avgQuizClass: {$avg:'$quizAvg'},
          avgLabClass: {$avg:'$labAvg'},
          avgExamClass: {$avg:'$examAvg'}
        }
      },
    ])
    .toArray()
    .catch((err: Error) => {
      console.log("Errore esecuzione query " + err.message);
    })
    .then((data: any) => {
      console.log("QUERY 7b -->", data);
    })
    .finally(() => {
      client.close();
    });
});