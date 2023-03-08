import {MongoClient, ObjectId}  from "mongodb";
import moment from "moment"
import dotenv from "dotenv";

// config
dotenv.config({ path: ".env" });
const DB_NAME = "5b";
const connectionString: string|undefined = process.env.connectionString;
const COLLECTION = "bigData"

let sensors = [
	{ "sensorId": 5578, "type": "temperature" },
	{ "sensorId": 5579, "type": "temperature" },
	{ "sensorId": 5581, "type": "humidity" },
	{ "sensorId": 5582, "type": "humidity" },
	{ "sensorId": 5590, "type": "ph" },
]
// sensor 5578 sensore temperature tra 18 e 22, set-point 20  ogni 20 sec
// sensor 5579 sensore temperature tra 37 e 43, set-point 40  ogni 20 sec
// sensor 5581 sensore umidità tra 55 e 65,     set-point 60  ogni minuto
// sensor 5582 sensore umidità tra 75 e 85,     set-point 80  ogni minuto
// sensor 5590 sensore ph tra 7 e 8,           set-point 7.5  ogni giorno


/* ******************** TEMPERATURE ********************* */
setInterval(writeTemperature, 1000);
function writeTemperature(){
	// moment() restituisce la data corrente sotto forma di oggetto moment
	// il metodo format() restituisce la versione ISO Date con un timezone locale
	// che però senza la Z finale non è considerato da mongo un valore UTC valido
	let format="YYYY-MM-DDT:hh:mm.ss.SSSZ";
	let t = (moment()).format(format)
	
	// Greenwich time
	let currentTime = new Date() 
	let n, value;
	
	// 5578
	n = generaNumero ()
	if(n<=3)
		value= generaNumeroDecimale (18, 22)
	else if(n<=6)
		value= generaNumeroDecimale (18.4, 21.6)
	else if(n<=9)
		value= generaNumeroDecimale (18.8, 21.2)
	else if(n<=12)
		value= generaNumeroDecimale (19.2, 20.8)
	else 
		value= generaNumeroDecimale (19.6, 20.4)
			
    let rec1 = {
      "sensor": sensors[0],
      "timestamp": currentTime,
      "value": value
    }

	// 5579
	n = generaNumero ()
	if(n<=3)
		value= generaNumeroDecimale (37, 43)
	else if(n<=6)
		value= generaNumeroDecimale (37.6, 42.4)
	else if(n<=9)
		value= generaNumeroDecimale (38.2, 41.8)
	else if(n<=12)
		value= generaNumeroDecimale (38.8, 41.2)
	else 
		value= generaNumeroDecimale (39.4, 40.6)
    
	let rec2 = {
      "sensor": sensors[1],
      "timestamp": currentTime,
      "value": value
    }
	salvaInDb(rec1, rec2)
}

/* ******************** HUMIDITY ********************* */
setInterval(writeHumidity, 5000);
function writeHumidity(){	
	// Greenwich time
	let currentTime = new Date() 
	let n, value;
	
	// 5581
	n = generaNumero ()
	if(n<=3)
		value= generaNumeroDecimale (55, 65)
	else if(n<=6)
		value= generaNumeroDecimale (56, 64)
	else if(n<=9)
		value= generaNumeroDecimale (57, 63)
	else if(n<=12)
		value= generaNumeroDecimale (58, 62)
	else 
		value= generaNumeroDecimale (59, 61)

    let rec1 = {
      "sensor": sensors[2],
      "timestamp": currentTime,
      "value": value
    }

	// 5582
	n = generaNumero ()
	if(n<=3)
		value= generaNumeroDecimale (75, 85) 
	else if(n<=6)
		value= generaNumeroDecimale (76, 84)
	else if(n<=9)
		value= generaNumeroDecimale (77, 83)
	else if(n<=12)
		value= generaNumeroDecimale (78, 82)
	else 
		value= generaNumeroDecimale (79, 81)

    let rec2 = {
      "sensor": sensors[3],
      "timestamp": currentTime,
      "value": value
    }
	salvaInDb(rec1, rec2)
}

/* ******************** PH ********************* */
setInterval(writePH, 7000);
function writePH(){	
	// Greenwich time
	let currentTime = new Date() 
	let n, value;
	
	// 5590
	n = generaNumero ()	
	if(n<=3)
		value= generaNumeroDecimale (7, 8) 
	else if(n<=6)
		value= generaNumeroDecimale (7.1, 7.9)
	else if(n<=9)
		value= generaNumeroDecimale (7.2, 7.8)
	else if(n<=12)
		value= generaNumeroDecimale (7.3, 7.7)
	else 
		value= generaNumeroDecimale (7.4, 7.6)

    let rec1 = {
      "sensor": sensors[4],
      "timestamp": currentTime,
      "value": value
    }
	salvaInDb(rec1)
}


function salvaInDb(rec1:any, rec2:any=null){
    let promises:any[] = []
	let connection = new MongoClient(connectionString as string);
    connection.connect()
	.then((client: any) => {
		let db = client.db(DB_NAME) 
		let collection = db.collection(COLLECTION);
		let request1 = collection.insertOne(rec1);
		promises.push(request1)		
		if (rec2){
			let request2 = collection.insertOne(rec2);
			promises.push(request2)
		}
		Promise.all(promises)
		.then((data:any) => {
			console.log(data)
		})
		.catch((err) =>  {
			console.log("Sintax error in query " + err.message);
		})
		.finally(() => {
			client.close();
		})
	})
	.catch((err: any) => { 
		console.log("Errore di connessione al db")
	}) 
}

/* ********************* */

function generaNumero(a=1, b=16){
	let n = Math.floor((b-a+1)*Math.random()) + a
	return n
}

function generaNumeroDecimale(a:number, b:number){
	a=a*10
	b=b*10;
	let n = Math.floor((b-a+1)*Math.random()) + a
	return n/10
}