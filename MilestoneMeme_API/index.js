const { Meme } = require('./lib/app/models/Meme');
const { Caption } = require('./lib/app/models/Caption');
const { MemeDAO } = require('./lib/app/database/MemeDAO.js')

//Post & Express Body Parser dependencies
const express = require('express')
const bodyParser = require('body-parser')

//Instance at Port of Express
const app = express()
const Port = 3000

//Database configuration
const dbHost  = "localhost"
const dbPort =  "3306";
const dbUsername = "root"
const dbPassword = "root"

// Set location of static resources and use the JSON body parser
app.use(express.static('app/images'))
app.use(bodyParser.json());


//GET Route at Root '/' returning a test message
app.get('/', function (_req, res)
{
  //Returns Test
  console.log('In GET / Route');
  res.send('This is the default root Route');
})
//GET route for '/meme/
app.get('/meme', function (_req, res)
{
  console.log('In GET /meme Route');
  let dao = new MemeDAO(dnHost, dbPort, dbUsername, dbPassword);
  dao.findMemes(function(meme)
  {
    res.json(meme);

  });
})

app.get('/caption', function (req, res)
{
  //Return Caption List as JSON call fins allCaptions and return JSON captions
  console.log('In GET /caption Route ');
  let dao = new MemeDAO(dbHost, dbPort, dbUsername, dbPassword);
  dao.findAllCaptions(function(caption)
  {
    res.json(caption);
  });
})

//Get Method for all Memes for a caption in the database
app.get('/meme/:caption', function (req, res)
{
  // Return Albums List as JSON, call MusicDAO.findAlbums(), and return JSON array of Albums
  console.log('In GET /caption Route for ' + req.params.caption);
  let dao = new MemeDAO(dbHost, dbPort, dbUsername, dbPassword);
  dao.findCaption(req.params.caption, function(caption)
  {
      res.json(caption);
  });
})

// GET Route at '/meme/search/caption/:search' that does a wildcard search for all Memes searching by Captions from the database
app.get('/memes/search/caption/:search', function (req, res)
{
    // Return Meme List as JSON, call MemeDAO.findMemeByCaption(), and return JSON array of Meme
    console.log('In GET /meme/search/caption Route for ' + req.params.search);
    let dao = new MemeDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findMemeByCaption(req.params.search, function(meme)
    {
        res.json(meme);
    });
})

// GET Route at '/meme/:caption/:id' that returns an Meme given an Meme ID from the database
app.get('/meme/:caption/:id', function (req, res)
{
    // Get the Meme
    console.log('In GET /meme Route with ID of ' + req.params.id);
    let memeId = Number(req.params.id);

    // Call MemeDAO.findMeme() to find Meme from the database and return the Meme
    let dao = new MemeDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findMeme(memeId, function(meme)
    {
        if(album == null)
            res.status(200).json({"error" : "Invalid Meme ID"})
        else
            res.status(200).json(meme)
    });
 })

 // POST Route at '/meme' that adds a meme and its caption to the database
app.post('/meme', function (req, res)
{
    console.log(req);

    // If invalid POST Body then return 400 response else add Meme & caption to the database
    console.log('In POST /meme Route with Post of ' + JSON.stringify(req.body));
    if(!req.body.memename)
    {
        // Check for valid POST Body, note this should validate EVERY field of the POST
        res.status(400).json({error: "Invalid Meme Posted"});
    }
    else
    {
        // Create an Meme object model from Posted Data
        let caption = [];
        for(let x=0;x < req.body.caption.length;++x)
        {
            tracks.push(new Track(req.body.caption[x].id, req.body.tracks[x].number, req.body.tracks[x].title, req.body.tracks[x].lyrics, req.body.tracks[x].video));
        }
        let album = new Album(-1, req.body.title, req.body.artist, req.body.description, req.body.year, req.body.image, tracks);

        // Call MusicDAO.create() to create an Album from Posted Data and return an OK response
        let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
        dao.create(album, function(albumId)
        {
            if(albumId == -1)
                res.status(200).json({"error" : "Creating Album failed"})
            else
                res.status(200).json({"success" : "Creating Album passed with an Album ID of " + albumId});
        });
      }
})

// PUT Route at '/meme' that updates an Meme and it's Caption in the database
app.put('/meme', function (req, res)
{
    // If invalid PUT Body then return 400 response else update Meme and Caption to the database
    console.log('In PUT /albums Route with Post of ' + JSON.stringify(req.body));
    if(!req.body.title)
    {
        // Check for valid PUT Body, note this should validate EVERY field of the POST
        res.status(400).json({error: "Invalid Meme Posted"});
    }
    else
    {
        // Create a new MEME object model from Posted Data
        let caption = [];
        for(let x=0;x < req.body.caption.length;++x)
        {
            caption.push(new Caption(req.body.caption[x].id, req.body.caption[x].title, req.body.caption[x].caption));
        }
        let meme = new Meme(req.body.id, req.body.memename, req.body.memequality, req.body.meme_image, caption);

        // Call MemeDAO.update() to update an Meme from Posted Data and return an OK response
        let dao = new MemeDAO(dbHost, dbPort, dbUsername, dbPassword);
        dao.update(meme, function(changes)
        {
            if(changes == 0)
                res.status(200).json({"error" : "Updating Meme passed, but nothing was changed"})
            else
                res.status(200).json({"success" : "Updating Meme passed and data was changed"});
        });
      }
})

// DELETE Route at '/albums/:artist/:id' that deletes an Album given an Album ID from the database
app.delete('/meme/:caption/:id', function (req, res)
{
    // Get the Album
    console.log('In DELETE /meme Route with ID of ' + req.params.id);
    let memeId = Number(req.params.id);

    // Call MemeDAO.delete() to delete a Meme from the database and return if passed
    let dao = new MemeDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.delete(memeId, function(changes)
    {
        if(changes == 0)
            res.status(200).json({"error" : "Failed to Delete Meme"})
        else
            res.status(200).json({"success" : "Successfully Deleted Meme"})
    });
 })



// Route code ends
// Start the Server
app.listen(port, () =>
{
    console.log(`Example app listening on port ${port}!`);
});
