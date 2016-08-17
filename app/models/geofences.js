var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geofenceSchema = new Schema({
	properties: {
		venue_id: { type: String, required: true },
		// male: { type: Boolean, default: true },
		// female: { type: Boolean, default: true },
		// minAge: { type: Number, min: 18, default: 18 },
		// maxAge: { type: Number, min: 18, default: 65 },
		// startDate: { type: Date, default: Date.now },
		// endDate: { type: Date, default: Date.now },
		// interests: [],
		// promotions: [],
		// createdDate: { type: Date, default: Date.now },
		// modifiedDate: { type: Date, default: Date.now }
	},
	geometry: {
		type: { type: String, default:'Point' }, 
		coordinates: { type: [Number], index: '2dsphere', required: true }
	}
})

geofenceSchema.pre('save', function(next) {
	this.ModifiedDate = new Date();
	next();
});

var geofence = mongoose.model('Geofence', geofenceSchema);

module.exports = geofence;