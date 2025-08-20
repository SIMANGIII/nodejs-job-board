
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/bestxx', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Mongoose Schema and Model
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', { tasks: tasks });
});

app.get('/new', (req, res) => {
    console.log('GET /new route hit');
    res.render('new');
});

app.post('/', async (req, res) => {
    const task = new Task({
        name: req.body.name,
        description: req.body.description
    });
    await task.save();
    res.redirect('/');
});

app.get('/:id/edit', async (req, res) => {
    console.log('GET /:id/edit route hit with id:', req.params.id);
    const task = await Task.findById(req.params.id);
    res.render('edit', { task: task });
});

app.post('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.name = req.body.name;
    task.description = req.body.description;
    await task.save();
    res.redirect('/');
});

app.post('/:id/delete', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
