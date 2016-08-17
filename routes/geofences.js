var express = require('express'),
    mongoose = require('mongoose'),    
    Geofence = require('../app/models/geofences');

var router = express.Router();

router.route('/within')
    .get(function(req,res) {
        var point = [172.757417, -43.568444]; // 27 Nayland Street
		Geofence.find({
			geometry: { 
				$geoWithin: {
                    // Within centerSphere with radius of 100m. Radius is measured in radians where 1 Radian = 6371km so 0.1/6371 = 100m
					$centerSphere: [ point, 0.05/6371 ]
				} 
			}
		})
		.then(function(results) {
				res.json(results);
		})
		.catch(function(err){
			return console.error(err);
		 })
    });

// Responds in JSON (requires 'Accept: application/json' in the Request Header).
router.route('/')
    // Get all geofences.
    .get(function(req, res) {
        //var point = [req.query["longitude"], req.query["latitude"]];
        var point = [172.757417, -43.568444]; // 27 Nayland Street
        var geoJSONPoint = {type: 'Point', coordinates: point};

        mongoose.model('Geofence').geoNear(
            geoJSONPoint, 
            {
                maxDistance: 20000,
                spherical: true,
                limit: 100
            }
        )
        .then(function(results) {            
            res.json(results);
        })
        .catch(function(err) {
            return console.error(err);
        });
    })

    // Create a new geofence.
    .post(function(req, res) {
        var geofence = new Geofence({
            properties: {
                venue_id: req.body.id
                // startDate: new Date,
                // endDate: new Date
            },
            geometry: {
                coordinates: [req.body.longitude, req.body.latitude]
            }	
        })
        
        geofence.save()
        .then(function(value) {
            res.json(geofence);
        })
        .catch(function(err){
            res.send('There was a problem creating your geofence.');
        });        
    })

    // Delete all geofences.
    .delete(function(req, res) {        
		mongoose.model('Geofence').remove({})
		.then(function(results) {
			console.log('Deleted all geofences.');
            res.json({
                message: 'deleted'
            });
		})
		.catch(function(err) {
			return console.error(err);
		});        
    });

module.exports = router;