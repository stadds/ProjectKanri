const { Schema, model, Types } = require("mongoose");

const TaskSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		validate: [({ length }) => length >= 1, "Must not be an empty string."]
	},
	description: {
		type: String,
		required: false,
		trim: true,
		validate: [({ length }) => length >= 1, "Must not be empty string."]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	comments: [
		{
			type: Types.ObjectId,
			ref: "TaskComments"
		}
	],
	creator: {
		type: Types.ObjectId,
		ref: "User",
		required: true
	},
	assignedUser: {
		type: Types.ObjectId,
		ref: "User"
	}
});
const Task = model("Task", TaskSchema);

module.exports = Task;