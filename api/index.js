import express from "express"
import dotenv from "dotenv"
import mongoose, { Schema } from "mongoose"
import cors from "cors"
import { MongoClient } from 'mongodb';

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const COLLECTION_NAME = 'files-storage';

const app = express()

app.use(cors())

let cachedClient = null;

async function getMongoClient() {
	if (cachedClient) {
		return cachedClient;
	}

	if (!MONGO_CONNECTION) {
		throw new Error('MONGO_CONNECTION is not defined');
	}

	const client = new MongoClient(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
	cachedClient = client;
	return cachedClient;
}

function getThisDaysDate() {
	const d = new Date()
	return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

await mongoose.connect(process.env.MONGO_CONNECTION)

const fileLogSchema = new Schema({
	id: Schema.ObjectId,
	name: {
		type: String,
		unique: true,
	},
	date: Date,
	url: String,
})

const FileLog = mongoose.model("filelogs", fileLogSchema)

// creating a mongo schema for today's csv data
const additionSchema = new Schema({
	id: Schema.ObjectId,
	name: String,
	townCity: String,
	county: String,
	type: String,
	route: String,
	date: String,
})

const fileScehma = new Schema({
	id: Schema.ObjectId,
	name: {
		type: String,
		unique: true,
	},
	data: String,
	date: Date,
})

const File = mongoose.model("files", fileScehma)

// assigning a model to mongodb user userSchema
const Addition = mongoose.model("addition", additionSchema)

// creating a mongo schema for today's csv data
const updateSchema = new Schema({
	id: Schema.ObjectId,
	name: String,
	townCity: String,
	county: String,
	type: String,
	route: String,
	date: String,
})

// assigning a model to mongodb user userSchema
const Updates = mongoose.model("updates", updateSchema)

// creating a mongo schema for today's csv data
const removalSchema = new Schema({
	id: Schema.ObjectId,
	name: String,
	townCity: String,
	county: String,
	type: String,
	route: String,
	date: String,
})

// assigning a model to mongodb user userSchema
const Removal = mongoose.model("removals", removalSchema)

function getFormattedDate(d = new Date().toString()) {
	const date = new Date(d)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")

	return `${year}-${month}-${day}`
}

app.get("/", async (req, res) => {
	res.json({ message: "Up & Running!" })
})

/**
 * API endpoint to return current
 * additions, removals, updates
 * and the date/key for the last day's data
 */
app.get("/today", async (req, res) => {
	try {
		const fileName = await FileLog.find().sort({ date: -1 }).limit(1).exec()
		console.log(fileName[0])
		if (fileName[0]) {
			console.log(fileName[0].name)
			const thisDaysDate = fileName[0].name
			console.log(thisDaysDate)
			const additions = await Addition.find({ date: thisDaysDate }).exec()
			const removals = await Removal.find({ date: thisDaysDate }).exec()
			const updates = await Updates.find({ date: thisDaysDate }).exec()

			console.log({
				additions: additions.length,
				removals: removals.length,
				updates: updates.length,
			})
			return res.json({
				additions,
				removals,
				updates,
				updateDate: fileName[0].name,
			})
		}
	} catch (e) { }
})

app.get("/page/:pageNum", async (req, res) => {
	const { pageNum } = req.params
	console.log(pageNum)

	try {
		const fileLogs = await FileLog.find()
			.select("name")
			.sort({ date: -1 })
			.skip(pageNum)
			.limit(1)
			.exec()
		console.log(fileLogs)

		if (fileLogs.length > 0) {
			const currDate = fileLogs[0].name
			console.log(currDate)
			const additions = await Addition.find({ date: currDate }).exec()
			const removals = await Removal.find({ date: currDate }).exec()
			const updates = await Updates.find({ date: currDate }).exec()

			console.log({
				additions: additions.length,
				removals: removals.length,
				updates: updates.length,
			})
			return res.json({
				additions,
				removals,
				updates,
				updateDate: currDate,
			})
		} else {
			return res.status(404).json({
				additions: [],
				removals: [],
				updates: [],
			})
		}
	} catch (e) { }
})

app.get("/sponsors", async (req, res) => {
	const { search } = req.query;
	try {
		const client = await getMongoClient();
		const db = client.db(MONGODB_DB);
		const collection = db.collection(COLLECTION_NAME);
		const fileName = await FileLog.find().sort({ date: -1 }).limit(1).exec()
		console.log(fileName[0])
		const updateDate = fileName[0].name;

		let query = {
			date: updateDate // Assuming the field name is 'date' and is a string in 'YYYY-MM-DD' format
		};
		if (search) {
			query["Organisation Name"] = { $regex: search, $options: 'i' };
		}
		const countTotal = await collection.countDocuments({ date: updateDate });
		const count = await collection.countDocuments(query);
		const sponsors = await collection.find(query).toArray();

		return res.json({ count, countTotal, sponsors });
	} catch (e) {
		console.log(e);
	}
})

app.listen(3000, () => {
	console.log(`Up & Running on PORT:3000`)
})

export default app
