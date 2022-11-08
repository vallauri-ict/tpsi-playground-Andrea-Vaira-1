// mongoDb
import { MongoClient, ObjectId } from "mongodb";
const connectionString = "mongodb://localhost:27017";
const DBNAME = "5b";

// AVVIO DEL SERVER HTTP
/*
let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});*/

/***********USER LISTENER****************/

// Query 3
let conn1 = MongoClient.connect(connectionString);
conn1.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn1.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .find({ $or: [{ gender: "f" }, { weight: { $lt: 700 } }] })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 3 -->", data);
      }
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
    .find({ vampires: { $gt: 60 }, loves: { $in: ["apple", "grape"] } })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 4 -->", data);
      }
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
    .find({ vampires: { $gt: 60 }, loves: { $all: ["grape", "watermelon"] } })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 5 -->", data);
      }
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
    // .find({ $or: [{ hair: "brown" }, { hair: "grey" }] })
    .find({ hair: { $in: ["brown", "grey"] } })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 6 -->", data);
      }
      client.close();
    });
});

// Query 7
let conn7 = MongoClient.connect(connectionString);
conn7.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn7.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    // .find({ $or: [{ vaccinated: { $exists: false } }, { vaccinated: false }] })
    .find({ vaccinated: { $ne: true } })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 7 -->", data);
      }
      client.close();
    });
});

// Query 8
let conn8 = MongoClient.connect(connectionString);
conn8.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn8.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .find({ gender: "m", loves: { $ne: "apple" } })
    //.find({ gender: "m", loves: { $nin: ["apple"] } })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 8 -->", data);
      }
      client.close();
    });
});

// Query 9
let conn9 = MongoClient.connect(connectionString);
conn9.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn9.then((client: any) => {
  // let reg = new RegExp("^[Aa]w*");
  // let reg = new RegExp("^[Aa]");
  let reg = new RegExp("^a", "i"); // ricerca case insensitive
  let collection = client.db(DBNAME).collection("unicorns");
  collection.find({ gender: "f", name: reg }).toArray((err: any, data: any) => {
    if (err) {
      console.log("Errore esecuione query " + err.message);
    } else {
      console.log("QUERY 9 -->", data);
    }
    client.close();
  });
});

// Query 10
let conn10 = MongoClient.connect(connectionString);
conn10.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn10.then((client: any) => {
  let objectId = new ObjectId("634e69806542323ecc1d9bc0");
  let collection = client.db(DBNAME).collection("unicorns");
  collection.findOne({ _id: objectId }, (err: any, data: any) => {
    if (err) {
      console.log("Errore esecuione query " + err.message);
    } else {
      console.log("QUERY 10 -->", data);
    }
    client.close();
  });
});

// Query 11
let conn11 = MongoClient.connect(connectionString);
conn11.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn11.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .find({ gender: "m" })
    .project({ name: 1, vampires: 1, _id: 0 })
    .sort({ vampires: -1, name: 1 })
    .skip(3)
    .limit(3) // Permette di prendere i primi n
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 11 -->", data);
      }
      client.close();
    });
});

// Query 12
let conn12 = MongoClient.connect(connectionString);
conn12.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn12.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  // collection.find({ gender: "m" }).count((err: any, data: any) => {
  collection.countDocuments({ gender: "m" }, (err: any, data: any) => {
    if (err) {
      console.log("Errore esecuione query " + err.message);
    } else {
      console.log("QUERY 12 -->", data);
    }
    client.close();
  });
});

// Query 13
let conn13 = MongoClient.connect(connectionString);
conn13.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn13.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  // findOne non ammette .project e .array, allora devo usare  questa sintassi
  collection.findOne(
    { name: "Aurora" },
    { projection: { hair: 1, weight: 1, _id: 0 } },
    (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 13 -->", data);
      }
      client.close();
    }
  );
});

// Query 14
let conn14 = MongoClient.connect(connectionString);
conn14.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn14.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection.distinct("loves", { gender: "f" }, (err: any, data: any) => {
    if (err) {
      console.log("Errore esecuione query " + err.message);
    } else {
      console.log("QUERY 14 -->", data);
    }
    client.close();
  });
});

// Query 15
let conn15 = MongoClient.connect(connectionString);
conn15.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn15.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  let unicorn = {
    name: "Pippo",
    weight: 700,
    gender: "m",
  };
  collection.insertOne(unicorn, (err: any, data: any) => {
    if (err) {
      console.log("Errore esecuione query " + err.message);
      client.close();
    } else {
      console.log("QUERY 15 -->", data);
      collection.deleteMany({ name: "Pippo" }, (err: any, data: any) => {
        if (err) {
          console.log("Errore esecuione query " + err.message);
        } else {
          console.log("QUERY 15b -->", data);
        }
        client.close();
      });
    }
  });
});

// Query 16
let conn16 = MongoClient.connect(connectionString);
conn16.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn16.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection.updateOne(
    { name: "Pilot" },
    { $inc: { vampires: 1 } },
    (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 16 -->", data);
      }
      client.close();
    }
  );
});

// Query 17
let conn17 = MongoClient.connect(connectionString);
conn17.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn17.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection.updateOne(
    { name: "Aurora" },
    { $inc: { weight: 10 }, $addToSet: { loves: "watermelon" } },
    (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 17 -->", JSON.stringify(data, null, 2));
      }
      client.close();
    }
  );
});

// Query 18
let conn18 = MongoClient.connect(connectionString);
conn18.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn18.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection.update(
    { name: "Pluto" },
    { $inc: { vampires: 1 } },
    { upsert: true },
    (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 18 -->", data);
      }
      client.close();
    }
  );
});

// Query 19
let conn19 = MongoClient.connect(connectionString);
conn19.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn19.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection.updateMany(
    { vaccinated: { $exists: false } },
    { $set: { vaccinated: false } },
    (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 19 -->", data);
      }
      client.close();
    }
  );
});

// Query 20
let conn20 = MongoClient.connect(connectionString);
conn20.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn20.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
  collection.deleteMany(
    // { loves: {$eq:'carrots', $eq:'grapes'} }, NON SI PUò FARE
    // { $and: [{ loves: "carrot" }, { loves: "grape" }] }, forma estesa della AND
    { loves: { $all: ["carrot", "papaya"] } },
    (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 20 -->", data);
      }
      client.close();
    }
  );
});

// compito: fare query 22

// Query 23
let conn23 = MongoClient.connect(connectionString);
conn23.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn23.then((client: any) => {
  let collection = client.db(DBNAME).collection("biblioteca");
  collection
    .find({
      "posizione.stanza": 2,
    })
    .project({ titolo: 1, autore: 1, _id: 0 })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 23 -->", JSON.stringify(data, null, 2));
      }
      client.close();
    });
});

// Query 24
let conn24 = MongoClient.connect(connectionString);
conn24.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn24.then((client: any) => {
  let collection = client.db(DBNAME).collection("biblioteca");
  // Sui campi non vettoriali non si usa $elemMatch
  collection
    .find({
      "posizione.stanza": 2,
      "posizione.scaffale": 3,
    })
    .project({ titolo: 1, autore: 1, _id: 0, "pubblicazioni.editore": 1 })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 24 -->", JSON.stringify(data, null, 2));
      }
      client.close();
    });
});

// Query 25
let conn25 = MongoClient.connect(connectionString);
conn25.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn25.then((client: any) => {
  let collection = client.db(DBNAME).collection("biblioteca");
  // Sui campi non vettoriali non si usa $elemMatch
  let reg = new RegExp("einaudi", "i");
  collection
    .find({
      pubblicazioni: {
        $elemMatch: {
          editore: reg,
          anno_pubblicazione: 2010,
        },
      },
    })
    .project({ titolo: 1, autore: 1, _id: 0, "pubblicazioni.editore": 1 })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("QUERY 25 -->", JSON.stringify(data, null, 2));
      }
      client.close();
    });
});

// Query 26
let conn26 = MongoClient.connect(connectionString);
conn26.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn26.then((client: any) => {
  let collection = client.db(DBNAME).collection("biblioteca");
  collection.distinct("pubblicazioni.editore", (err: any, data: any) => {
    if (err) {
      console.log("Errore esecuione query " + err.message);
    } else {
      console.log("QUERY 26 -->", JSON.stringify(data, null, 2));
    }
    client.close();
  });
});
