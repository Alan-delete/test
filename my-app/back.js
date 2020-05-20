/* require modules */
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');

/* define app to use express */
var app = express();
app.use(bodyParser.urlencoded({extended: true,limit: '50mb',parameterLimit:1000000}));

app.use(session({
	secret: 'csci2720',
	// cookie: { maxAge: 1000*60*60 } // expire in 1 hour
}));
app.use(express.static('content'));

/* connect to mongodb */
var mongodb = "mongodb://hnchen9:x98957@localhost/hnchen9";
mongoose.set('useCreateIndex', true);
mongoose.connect(mongodb, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Connection is open...');
});

/* define schema */
var Schema = mongoose.Schema;
var UserSchema = Schema({
	username: { type: String, require: true, unique: true },
	pwd: { type: String, require: true },
	favourite: [{ type: String }]
});
/*var StopSchema = Schema({
	stopname: { type: String, require: true, unique: true }, 
	longtitude: { type: Number, require: true },
	latitude: { type: Number, require: true },
	arrival: [{ route: String, time: Date }],
	comment: [{ body: String, username: String, date: Date }]
});*/
 var StopSchema = Schema({ 
    latitude: { type: Number, require:true}, 
    longitude:{type: Number,require:true},
    name: { type: String, require: true, unique: true }, 
    arrival:[{ route: String, stopId:String }] ,
    comment: [{ body: String, username: String, date: Date }]
});
var RouteSchema = Schema({ // this schema can be omitted
	route: { type: String, require: true, unique: true },
	orig: String,
	dest: String
});

/* define model */
User = mongoose.model('User', UserSchema);
Stop= mongoose.model('Stop', StopSchema);
Route = mongoose.model('Route', RouteSchema); // can be ommited

/****** receive http request ******/
/* set header */
app.all('/', (req, res,next) => {
	/* set response header */
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader('Content-Type', 'application/json');
	next();
});
app.use(express.static(__dirname+'/build'));
app.get('/stopmark',function(req,res){
    Stop.find({},
        'latitude longitude name arrival comment',function(err,stop){
            res.send(stop);
        })
});


app.post('/data',function(req,res){
var databody=req.body.alldata;
//console.log(databody[224][eta]+'*****'+databody[227][stopId]);
//console.log(data);
var dataset=[{name:'example',lat:1,long:2,arrival:[{route:0,stopId:'010101'}]}];
var flag=0;
for(var i=0,len=databody.length;i<len;i++){
    flag=0;
    //console.log('******'+databody[i].stopId);
    //console.log("no."+i+' name: '+databody[i].name);
    for(var j=0;j<dataset.length;j++){
       if(databody[i].name.localeCompare(dataset[j].name)===0){
            //console.log("old");
            flag=1;
            dataset[j].arrival.push({route:databody[i].route,stopId:databody[i].stopId});
            //console.log('****'+dataset);
        }
    }
    //console.log('flag is '+flag);
    if(flag===0){
        dataset.push({name:databody[i].name, lat:databody[i].lat, long:databody[i].long, arrival:[{route:databody[i].route,stopId:databody[i].stopId}]});
    }   
}
/*for(var j=0;j<dataset.length;j++){
    console.log(dataset.length);
}
*/
for(let index in dataset){
    if(index!==0)
    {
        var conditions={name:dataset[index].name};
        Stop.findOne(conditions,function(err,stop){
            if(err)
            returhandleError(err);
            if(stop!=null){
                stop.arrival=dataset[index].arrival;
                stop.save();
                console.log("updated");
            }
            else if(stop===null){
                console.log("new one");
                var stop=new Stop({
                  latitude:dataset[index].lat, 
                  longitude:dataset[index].long,
                  name:dataset[index].name, 
                  arrival:dataset[index].arrival,
                  comment:[]
    });
    stop.save(function(err){
    if(err)return err;
    console.log("saved");
    });
            }
        })
        
    }
    
}
});
/*get data from database*/
app.get('/getdata',(req,res)=>{
	
	Stop.find(function(err,result){
		if (err) return err;
		
		res.send(result);
		})
	
	
	
	})
	/* get one's favourite list */
app.get('/favourite', (req, res) => {
	if(req.session.username != undefined) {
		User.findOne({ username: req.session.username }, (err, result) => {
			if(err)
				return console.log(err);
			res.send(result.favourite);
		});
	} else {
		res.send({ 'login': 0 });
	}
});
//get stop
app.get('/stop/:stopname', (req, res) => {
	if(req.session.username != undefined) {
		Stop.findOne({ name: req.params.stopname}, (err, result) => {
			if(err)
				return console.log(err);
			
				res.send(result);
			
		})
	} else {
		res.send({ 'login': 0 });
	}
});
/*
app.get('/*',(req,res)=>{
	
	res.sendFile(__dirname+"/src/index.html");
	
	})*/
/* sign up */
app.post('/signup', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	User.findOne({ username: username }, (err, result) => {
		if(err)
			return console.log(err);
		if(result)
			res.send({"signup": 0});
		else {
			User.create({ username: username, pwd: pwd}, (err, result) => {
				if(err)
					return console.log(err);
				else
					res.send({"signup": 1});
			});
		}
	});
});
/* log in */
app.post('/login', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	User.findOne({ username: username, pwd: pwd }, (err, result) => {
		if(err)
			return console.log(err);
		if(result) {
			req.session.username = username;
			res.send({"login": 1});
		}
		else 
			res.send({"login": 0});
	});
});
/* log out */
app.post('/logout', (req, res) => {
	req.session.destroy(() => {
		res.send({"logout": 1});
	});
});
/* change password */
app.put('/changePwd', (req, res) => {
	if(req.session.username != undefined) {
		var pwd = req.body.pwd;
		var conditions = { username: req.session.username };
		var update = { $set: { pwd: req.body.pwd }};
		User.updateOne(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			res.send({ 'pwdChanged': 1});
		})
	} else {
		res.send({ 'login': 0 });
	}
})


/* add a favourite stop */
app.put('/favourite/:stopname', (req, res) => {
	if(req.session.username != undefined) {
		var conditions = { username: req.session.username };
		var update = { $addToSet: { favourite: req.params.stopname }};
		User.update(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			res.send({ 'stopAdded': 1});
		});
	} else {
		res.send({ 'login': 0 });
	}
});

/* remove a stopname from one's favourite list*/
app.delete('/favourite/:stopname', (req, res) => {

	if(req.session.username != undefined) {
		var conditions = { username: req.session.username };
		var update = { $pull: { favourite: req.params.stopname }};
		User.update(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			if(result.nModified != 0)
				res.send({ 'stopRemoved': 1 });
			else 
				res.send({ 'inFavourite': 0});
		});
	} else {
		res.send({ 'login': 0 });
	}
});
//add comment
app.post('/stop/:stopname', (req, res) => {
	if(req.session.username != undefined) {
		var conditions = {name: req.params.stopname};
		var update = {$addToSet: { comment: req.body }};
		Stop.update(conditions,update, (err, result) => {
			if(err)
				return console.log(err);
			res.send({'addcomment':1});
		});
	} else {
		res.send({ 'login': 0 });
	}
	
});

/**** below are all for admin ****/
/* admin log in */
app.post('/adminLogIn', (req, res) => {
	req.session.admin = true;
	res.send({ 'login': 1});
});

/* admin log out */
/* same as user */
app.post('/adminLogOut', (req, res) => {
	req.session.admin = false;
	res.send({ 'login': 0});
});
/* admin delete a user */
app.delete('/user/:username', (req, res) => {
	if(req.session.admin != undefined) {
		User.remove({ username: req.params.username}, (err, result) => {
			if(err)
				return console.log(err);
			if(result.deletedCount == 0)
				res.send({ 'deleted': 0 });
			else
				res.send({ 'deleted': 1 });
		})
	} else {
		res.send({ 'authority': 0 });
	}
});

/* admin delete a bus stop */
app.delete('/stop/:stopname', (req, res) => {
	if(req.session.admin != undefined) {
		Stop.remove({ name: req.params.stopname}, (err, result) => {
			if(err)
				return console.log(err);
			if(result.deletedCount == 0)
				res.send({ 'deleted': 0 });
			else
				res.send({ 'deleted': 1 });
		})
	} else {
		res.send({ 'authority': 0 });
	}
});
/* admin updata an user */
app.put('/user/:username', (req, res) => {
	if(req.session.admin != undefined) {
		User.update({ username: req.params.username},{username:req.body.username,pwd:req.body.pwd,favourite:req.body.favourite}, (err, result) => {
			if(err)
				return console.log(err);
			
			else
				res.send({ 'update': 1 });
		})
	} else {
		res.send({ 'authority': 0 });
	}
});
/* admin updata a bus stop */
app.put('/stop/:stopname', (req, res) => {
	if(req.session.admin != undefined) {
		Stop.update({ name: req.params.stopname},{name:req.body.name,latitude:req.body.latitude,longitude:req.body.longitude,arrival:[{stopId: req.body.stopId,route:req.body.route}]}, (err, result) => {
			if(err)
				return console.log(err);
			
			else
				res.send({ 'update': 1 });
		})
	} else {
		res.send({ 'authority': 0 });
	}
});
/* add location */
app.post('/stop', (req, res) => {
	var stop = new Stop({
	
	latitude:  req.body.latitude ,
	longitude: req.body.longitude ,
	name: req.body.name ,
	comment:[],
	arrival:[{stopId: req.body.stopId,route:'###'}]
});
		stop.save();
});
/* admin get all bus stop */
app.get('/stop', (req, res) => {
	if(req.session.admin != undefined || req.session.username != undefined) {
		Stop.find({}, (err, result) => {
			if(err)
				return console.log(err);
			res.send(result);
		});
	} else {
		res.send({ 'login': 0 });
	}
	
});

/* for test only 
app.post('/stop', (req, res) => {
	StopModel.create({stopname: "test", longtitude: 50, latitude: 30, 
		arrival: [{route: "route1", time: "2020-01-01"}, {route: "route2", time: "2020-01-01"}],
		comment: [{body: "hahaha", username: "user1"}, {body: "ssss", username: "user2"}]   }, (err, result) => {
		if(err)
			return console.log(err);
		res.send({"created": 1});
	});
});
*/
/* flush stop data */
/* flush stop data 
app.post('/flush/stop', (req, res) => {
	if(req.session.admin) {
		StopModel.find({}, (err, result) => {
			if(err) return console.log(err);
			for(var newStop of req.body.stops) {
				var exist = false;
				for(var oldStop of result) {
					if(newStop.stopid == oldStop.stopid) {
						exist = true;
						break;
					}
				}
				if(exist) {
					StopModel.updateOne({stopid: newStop.stopid}, {$set: {stopname: newStop.stopname, longtitude: newStop.longtitude, latitude: newStop.latitude, otherAttr: []}}, (err, result1) => {
						if(err) console.log(err);
					});
				} else {
					StopModel.create({stopid: newStop.stopid, stopname: newStop.stopname, longtitude: newStop.longtitude, latitude: newStop.latitude, arrival: [], comment: [], otherAttr: []}, (err, result2) => {
						if(err) console.log(err);
					});
				}
			}
			for(var attr of req.body.otherAttr) {
				StopModel.updateOne({stopid: attr.stopid}, {$addToSet: {otherAttr: {route: attr.route, seq: attr.seq}}}, (err, result) => {
					if(err) console.log(err);
				})
			}

			res.send({ 'flush': true });
		})
	} else {
		res.send({ 'admin': false });
	}
})*/

/* flush arrival time 
app.post('/flush/arrival', (req, res) => {
	if(req.session.admin) {
		ArrivalModel.create(req.body.arrival, (err, arrivals) => {
			for(var i in arrivals) {
				StopModel.updateOne({stopid: arrivals[i].stopid}, {$addToSet: {arrival: arrivals[i]._id}}, (err, result) => {
					if(err)
						return console.log(err);
				})
			}
			res.send({ 'flush': true });
		});
	} else {
		res.send({ 'admin': false });
	}
})*/
//add user
app.post('/user', (req, res) => {
	var user = new User({
	username: req.body.username ,
	pwd:  req.body.pwd ,
	favourite: req.body.favourite 
});
		user.save();
	
})
//deal with csv
app.post('/CSV',(req,res)=>{

		req.body.data.forEach((data)=>
		{
			if (data.name!=null||data.stopId!=null||data.latitude!=null||data.longitude!=null||data.stopId==''||data.name==undefined)
		{	var stop = new Stop({
	
	latitude:  data.latitude ,
	longitude: data.longitude ,
	name: data.name ,
	comment:[],
	arrival:[{stopId: data.stopId,route:'###'}]
});
		stop.save();}
		})
	})
/* get all users */
app.get('/user', (req, res) => {
	
		User.find({}, (err, result) => {
			res.send(result);
		})
	
})


//retrieve all stop
app.get('/api/locations',(req,res)=>{
		
		
		if (req.get('Authorization')==="Bearer csci2720")
	{
	var result={locations:{location:[]}};
	Stop.find({},function(err,docs){		
	
		docs.forEach((stop)=>{
			result.locations.location.push({id:stop.arrival[0].stopId,name:stop.name,latitude:stop.latitude,longitude:stop.longitude})
			})		
		var xml = builder.buildObject(result);
	res.type('application/xml');
		res.set('Content-Type', 'text/xml');
		res.send(xml);
		
	})
	}
	else
	{
		res.status(401);
		res.send("Imcorrect Authorization Bearer Token!");
	}
	})
	//retrieve one specific location
app.get('/api/locations/:stopId',(req,res)=>{
	//console.log(req.params.stopId);
	if (req.get('Authorization')==="Bearer csci2720")
	{
	Stop.findOne({arrival:{$elemMatch:{stopId:req.params.stopId}}},function(err,stop){
		
		if (err)
		{ 
		res.send("location dosen't found");
		 return console.log(err);
		 }
		else
	{	
	if (stop==null)
	{ 
		res.send("location dosen't found");
		 return console.log(err);
		 }
	var result={location:[{id:stop.arrival[0].stopId,name:stop.name,latitude:stop.latitude,longitude:stop.longitude}]};
		var xml = builder.buildObject(result);
		res.type('application/xml');
		res.set('Content-Type', 'text/xml');
		res.send(xml);
		}
	
		})
	

	}
	else
	{
		res.status(401);
		res.send("Imcorrect Authorization Bearer Token!");
		}
	})
	
app.delete('/api/locations/:stopId',function(req,res){
	if (req.get('Authorization')==="Bearer csci2720")
	{
		Stop.remove({arrival:{$elemMatch:{stopId:req.params.stopId}}}, (err, result) => {
			if(err)
				{
					res.send("deletion failed");
					return console.log(err);
				}
			if(result.deletedCount == 0)
				res.send({ 'deleted': 0 });
			else
				res.send({ 'deleted': 1 });
		})
	 
	}
	else
	{
		res.status(401);
		res.send("Imcorrect Authorization Bearer Token!")
		}
	
	})
	//add a new location
app.post('/api/locations/',function(req,res){
	if (req.get('Authorization')==="Bearer csci2720")
	{
		
		var location=req.body.location;
		//console.log(location[0]);
		if (location==null)
		{
					res.send("Invalid body");
					return console.log(err);
		}
		else
	{	
	
			
			var stop=new Stop({	
	latitude:  location.latitude[0] ,
	longitude: location.longitude[0] ,
	name: location.name[0] ,
	comment:[],
	arrival:[{stopId: location.id[0],route:'###'}]
								});
	//console.log(stop);
	stop.save(function(err,result){
		if (err)
	{
		res.send("Adding failed.Probably this stop has already existed");
			return console.log(err);
		}
		else
		{
			res.location('http://localhost:3000/api/locations/'+location.id[0]);
		res.send("Adding successfully")
		}
		});
			
			
	}
	}
  else
	{
		res.status(401);
		res.send("Imcorrect Authorization Bearer Token!")
		}
	
	})	
	
app.put('/api/locations/:stopId',function(req,res) {
	if (req.get('Authorization')==="Bearer csci2720")
	{
	var condition={arrival:{$elemMatch:{stopId:req.params.stopId}}};
	var location=req.body.location;
/*	var update={ name:location.name[0],latitude:location.latitude[0], longitude:location.longitude[0]};
	
	Stop.updateOne(condition,update,(err,result) => {
		if (err)
		{
			res.send("Update failed");
			return console.log(err);
			}
		res.send("Update succeed");
		})
		*/
		
	Stop.findOne(condition,(err,stop)=>{
		if (err||stop==null)
		{
			res.send("Update failed");
			return console.log(err);
			}
			stop.name=location.name[0];
			stop.latitude=location.latitude[0];
			stop.longitude=location.longitude[0];
		stop.arrival.forEach((value)=>{
			value.stopId=location.id[0];
			})
			stop.save(); 
			res.location('http://csci2720.cse.cuhk.edu.hk/2011/api/locations/'+location.id[0]);
			res.send("Update succeed");
		})	
	
}
else
{
		res.status(401);
		res.send("Imcorrect Authorization Bearer Token!")
		}
		
		})	
app.listen(2011);




