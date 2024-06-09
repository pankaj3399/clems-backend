import express from "express"
import dotenv from "dotenv"
import mongoose, { Schema } from "mongoose"
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors())

function getThisDaysDate() {
	const d = new Date()
	return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

await mongoose.connect(process.env.MONGO_CONNECTION)

const fileNamesSchema = new Schema({
	id: Schema.ObjectId,
	name: String,
	date: Date,
	url: String,
})

const FileName = mongoose.model("fileName", fileNamesSchema)

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

app.get("/today", async (req, res) => {
	try {
		const fileName = await FileName.findOne().exec()
		if (fileName) {
			console.log(fileName.name)
			const thisDaysDate = fileName.name
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
				updateDate: fileName.name,
			})
		}
	} catch (e) {}
})

app.get("/page/:pageNum", async (req, res) => {
	const { pageNum } = req.params
	console.log(pageNum)

	try {
		const files = await File.find()
			.select("name")
			.sort({ date: -1 })
			.skip(pageNum)
			.limit(1)
			.exec()
		console.log(files)

		if (files.length > 0) {
			const currDate = files[0].name
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
		}
		return res.json({ fileName })
	} catch (e) {}
})

app.listen(3000, () => {
	console.log(`Up & Running on PORT:3000`)
})

export default app
