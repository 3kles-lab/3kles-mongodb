import * as mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema({
	name: { type: String, unique: true, trim: true },
	mode: { type: Number},
	key: { type: String, trim: true },
	valid: { type: Date },
	nbenv: { type: Number },
	nbuser: { type: Number }
});

export default configurationSchema;
