const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

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
    },
    jobTypes: {
        type: [String],
        default: []
    },
    closingDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

// Routes
app.get('/admin', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ updatedAt: -1 });
        console.log(jobs);
        res.render('admin', { jobs: jobs });
    } catch (error) {
        console.error("Error fetching jobs for admin:", error);
        res.status(500).send("Server Error");
    }
});

app.get('/', async (req, res) => {
    try {
        const loaded = parseInt(req.query.loaded) || 0;
        const limit = 10; // Load 10 jobs at a time

        let query = {};
        if (req.query.keyword) {
            query.$or = [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
                { company: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }

        if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' };
        }

        if (req.query.jobTypes) {
            query.jobTypes = { $in: Array.isArray(req.query.jobTypes) ? req.query.jobTypes : [req.query.jobTypes] };
        }

        const jobs = await Job.find(query)
            .sort({ updatedAt: -1 })
            .skip(loaded)
            .limit(limit + 1); // Fetch one extra to check if there are more
        console.log(jobs);

        const hasMore = jobs.length > limit;
        if (hasMore) {
            jobs.pop(); // Remove the extra job
        }

        if (req.query.ajax) {
            return res.render('partials/_jobs', { jobs: jobs, layout: false, isAdmin: false });
        }

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
        website: req.body.website,
        jobTypes: req.body.jobTypes || [],
        closingDate: req.body.closingDate ? new Date(req.body.closingDate) : null
    });
    console.log(job);
    await job.save();
    res.redirect('/admin');
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
    job.jobTypes = req.body.jobTypes || [];
    job.closingDate = req.body.closingDate ? new Date(req.body.closingDate) : null;
    await job.save();
    res.redirect('/admin');
});

app.post('/:id/delete', async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

app.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send('Job not found');
        }
        res.render('show', { job: job }); // Assuming you'll create a show.ejs
    } catch (error) {
        console.error("Error fetching job details:", error);
        res.status(500).send("Server Error");
    }
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));