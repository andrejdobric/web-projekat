const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

const port = 3001; 
mongoose.connect("mongodb+srv://ugljesicmia:ucenik107@cluster0.s9q8cey.mongodb.net/Movie?retryWrites=true&w=majority")
.then(() =>{
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
  console.log('MongoDb je povezana')
}).catch((error) =>{
  console.log(error)
})


const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Genre must have at least one value'
    }
  },
  director: {
    type: String,
    required: true
  },
  actors: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Actors must have at least one value'
    }
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
});

var adminLogged = true
  
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema, 'users');
const Movie = mongoose.model('Movie', movieSchema, 'movies');
app.use(express.json()); 

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});


app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({'username': username, 'password' : password})
  if(!user){
    res.status(403).send("Podaci nisu validni")
  }
  if(user.isAdmin){
    adminLogged = true
  }
  else{
    adminLogged = false
  }
  res.status(200).send("M")
})



app.post('/movies', (req, res) => {
  const newMovie = new Movie(req.body);
  newMovie.save()
    .then(() => res.status(201).json({ message: 'Movie added successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to add movie', details: err }));
});

const authMiddleware = (req, res, next) => {
  if (!adminLogged) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.get('/movies', authMiddleware, (req, res) => {
  Movie.find()
    .then(movies => res.json(movies))
    .catch(err => res.status(500).json({ error: 'Failed to fetch movies', details: err }));
});


//Filter po imenu
app.get('/movies/search', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is missing' });
  }
  Movie.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(1)
    .then(movies => res.json(movies))
    .catch(err => res.status(500).json({ error: 'Failed to fetch movies', details: err }));
});


//Filter po zanru
app.get('/movies/filter', (req, res) => {
  const genre = req.query.genre;
  if (!genre) {
    return res.status(400).json({ error: 'Genre is missing' });
  }
  Movie.find({ genre: genre })
    .then(movies => res.json(movies))
    .catch(err => res.status(500).json({ error: 'Failed to fetch movies', details: err }));
});


app.get('/movies/:id', (req, res) =>{
  const id = req.params.id
  Movie.find({"_id" : id})
    .then(movie => res.json(movie))
    .catch(err => res.status(500).json({ error: 'Failed to fetch movies', details: err }));

})


app.put('/movies/:id', (req, res) => {
  var _id = req.params.id;

  const updatedMovie = req.body;
  Movie.updateOne({ '_id': _id }, {'$set': updatedMovie})
    .then(() => res.json({ message: 'Movie updated successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to update movie', details: err }));
});


app.delete('/movies/:id', (req, res) => {
    const id = req.params.id;
    Movie.deleteOne({ '_id': id })
    .then(() => res.json({ message: 'Movie deleted successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to delete movie', details: err }));
    });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });