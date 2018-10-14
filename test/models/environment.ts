import * as mongoose from 'mongoose';

const environmentSchema = new mongoose.Schema({
	name: { type: String, unique: true, trim: true },
	host: { type: String, trim: true },
	port: { type: Number },
	user: { type: String },
	password: { type: String },
});

// const Environment = mongoose.model('Environment', environmentSchema);

export default environmentSchema;
