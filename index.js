const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/Jobs', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Mongoose Schema and Model
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    website: {
        type: String
    }
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const loaded = parseInt(req.query.loaded) || 0;
        const limit = 10; // Load 10 jobs at a time

        let query = {};
        if (req.query.keyword) {
            query.title = { $regex: req.query.keyword, $options: 'i' };
        }

        const jobs = await Job.find(query)
            .sort({ updatedAt: -1 })
            .skip(loaded)
            .limit(limit + 1); // Fetch one extra to check if there are more

        const hasMore = jobs.length > limit;
        if (hasMore) {
            jobs.pop(); // Remove the extra job
        }

        console.log('jobs.length:', jobs.length);
        console.log('limit:', limit);
        console.log('hasMore:', hasMore);

        res.render('index', { 
            jobs: jobs, 
            loaded: loaded + jobs.length, 
            hasMore: hasMore,
            req: req
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send("Server Error");
    }
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/', async (req, res) => {
    const job = new Job({
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        description: req.body.description,
        email: req.body.email,
        website: req.body.website
    });
    await job.save();
    res.redirect('/');
});

app.get('/:id/edit', async (req, res) => {
    const job = await Job.findById(req.params.id);
    res.render('edit', { job: job });
});

app.post('/:id', async (req, res) => {
    const job = await Job.findById(req.params.id);
    job.title = req.body.title;
    job.company = req.body.company;
    job.location = req.body.location;
    job.description = req.body.description;
    job.email = req.body.email;
    job.website = req.body.website;
    await job.save();
    res.redirect('/');
});

app.post('/:id/delete', async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));