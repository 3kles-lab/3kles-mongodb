import * as mongoose from 'mongoose';

const logsSchema = new mongoose.Schema({
	username: { type: String, unique: true, uppercase: true, trim: true },
	device: { type: String },
	token: { type: String }
});

export default logsSchema;
