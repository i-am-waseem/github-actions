const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// Configuration
const config = {
    PORT : 3001,
    HOST : "0.0.0.0",
}

// Rest APIs
app.get("", (req,res) => {
    res.json({message: "Welcome Home."})
})

app.listen(config.PORT, config.HOST, ()=>{
    console.log(`listening on port ${config.PORT}`)
})