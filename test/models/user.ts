import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: { type: String, unique: true, uppercase: true, trim: true, required: true },
	type: { type: String },
	role: { type: String }
});

export default userSchema;
