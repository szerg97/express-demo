const Joi = require('joi'); //returns a class
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const express = require('express'); //returns a function
const app = express();

// call express.json meta the returns a piece of middleware
// then call app.use() to use it in the request processing pipeline
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//connect to db
mongoose.connect('mongodb://localhost:27017/devconnector');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.route('/api/articles')

.get((req, res) => {
    Article.find((err, foundArticles) => {
        if(!err)
            res.send(foundArticles);
        else
            res.send(err);
    });
})

.post((req, res) => {

    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save((err) => {
        if(!err)
            res.send(article);
        else
            res.send(err);
    });
})

.delete((req, res) => {
    Article.deleteMany((err) => {
        if(!err)
            res.send("Deletion successful.");
        else
            res.send(err);
    });
});

app.route('/api/articles/:title')

.get((req, res) => {
    Article.findOne({title: req.params.title}, (err, foundArticle) => {
        if(foundArticle)
            res.send(foundArticle);
        else
            res.status(404).send('No article matching.');
    });
})

.put((req, res) => {
    Article.replaceOne(
        {title: req.params.title}, 
        {title: req.body.title, content: req.body.content}, 
        {overwrite: true},
        (err) => {
            if(!err)
                res.send('Article successfully updated.');
            else
                res.send(err.message);
        });
})

.delete((req, res) => {
    Article.deleteOne({
        title: req.params.title},
        (err) => {
            if(!err)
                res.send("Deletion successful for id-" + req.params.title);
            else
                res.send("Deletion failed.")
        });
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));