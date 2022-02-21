const express = require('express')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const axios = require('axios')
const app = express()
app.use(bodyParser.json({limit: "10mb"}))
app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// app.use(express.static('public'))
app.set('view engine', 'ejs');

user_location = {}
video_list = {}
VIDEO_LIBRARY_URL = process.env.VIDEO_LIBRARY_URL || "http://localhost:3001/videos";

// Configuration
const config = {
    PORT : 3001,
    HOST : "0.0.0.0",
}

// Rest APIs
app.get("", (req,res) => {
    res.render('index')
})

app.post("/location", async(req, res) => {
    let location = req.body
    const action = location['action']
    if(action === 'reset'){
	res.clearCookie('requestId')
    }
    else{
        if(location.lat && location.long) {
        requestId = uuidv4()
        delete location['action']
        user_location[requestId] = location
        const result = await axios.post('http://consumer-core:9001/data/sync',{
            ...user_location 
        });
        // console.log(user_location)
        user_location = {}
        return res.status(200).send({"requestId": requestId})
        }
        return res.status(400).send({"message": "Invalid Input!"})
    }
})

app.post("/videos_list", (req, res) => {
    console.log("Response received....", Object.keys(req.body)[0])
    //console.log("End point", req.body)
    let videos = req.body
    let requestId = Object.keys(videos)[0]
    video_list[requestId] = videos[requestId]
    res.sendStatus(201)
})

app.get("/videos",(req,res) => {
    let id = req.query.requestId
    console.log("retrieving list of videos :", id)
    try{
	if(video_list[id]){
        res.send(video_list[id])
		delete video_list[id]
	}
	else{
		res.send("Waiting to receive data")
	}
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    // res.send(200)
})

app.get("/test", (req, res) => {
    res.send(video_list)
})

app.listen(config.PORT, config.HOST, ()=>{
    console.log(`listening on port ${config.PORT}`)
})