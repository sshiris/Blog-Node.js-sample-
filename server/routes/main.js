const express = require('express');
const router = express.Router();
const Post =  require('../models/Post');
const { render } = require('ejs');

//Routs
// get HOME
router.get('', async(req,res) => {
    try {
        const locals = {
        title: "Iris's Blog",
        description: 'Welcome to my blog, here you can find some weird * about me and my life.'
        }

        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort:{createdAt:-1}}])
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        res.render('index',{
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null});
            currentRoute = '/';
    } catch (error) {
        console.log(error); 
    }
    
});

// get Post :id
router.get('/post/:id', async(req,res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({_id:slug});

        const locals = {
            title: data.title,
            description: data.body
        }

        res.render('post',{
            locals,
            data,
            currentRoute: '/post/'+slug,
        });
    } catch (error) {
        console.log(error);
    }
});
//get post
router.post('/search', async(req,res) => {
    try {
        const locals = {
            title:"Search",
            description:"Search for post"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");

        const data = await Post.find({
            $or:[
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        });
        res.render("search",{
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});
// router.get('', async(req,res) => {
//     const locals = {
//         title: "Iris's Blog",
//         description: 'Welcome to my blog, here you can find some weird * about me and my life.'
//     }

//     try {
//         const data = await Post.find();
//         res.render('index',{locals,data});
//     } catch (error) {
//         console.log(error);
//     }
    
// });
 
// function insertPostDate(){
//     Post.insertMany([
//         {
//             title: 'Post One',
//             body: 'This is post one'
//         },
//         {
//             title: 'Post Two',
//             body: 'This is post two'
//         },
//         {
//             title: 'Post Three',
//             body: 'This is post three'
//         },
//         {
//             title: 'Post Four',
//             body: 'This is post four'
//         },
//         {
//             title: 'Post Five',
//             body: 'This is post five'
//         },
//         {
//             title: 'Post Six',
//             body: 'This is post six'
//         },
//         {
//             title: 'Post Seven',
//             body: 'This is post seven'
//         },
//         {
//             title: 'Post Eight',
//             body: 'This is post eight'
//         },
//         {
//             title: 'Post Nine',
//             body: 'This is post nine'
//         },
//         {
//             title: 'Post Ten',
//             body: 'This is post ten'
//         }
//     ]);
// }
// insertPostDate();

router.get('/about', (req,res) => {
    res.render('about',{
        currentRoute: '/about',
    });
});
router.get('/about', (req,res) => {
    res.render('about',{
        currentRoute: '/about',
    });
});

module.exports = router;