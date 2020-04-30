var mongoose = require("mongoose");
var Comment = require("./models/comments")
var Campground = require("./models/campgrounds");


seeds = [
    {
        name: "Clound's Rest",
        image: "https://res.cloudinary.com/simplotel/image/upload/x_0,y_528,w_3883,h_2184,r_0,c_crop,q_60,fl_progressive/w_400,f_auto,c_fit/youreka/Youreka_adventure_camps_for_kids_Kangra_3_dfndgn",
        description: "Lorem ipsum dolorLorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut accumsan quam. Mauris eget ullamcorper purus, eget suscipit arcu. Quisque dapibus mauris et nulla feugiat porta. Mauris est dolor, cursus eget placerat bibendum, volutpat ut tellus. Quisque molestie lobortis condimentum. Sed vitae turpis et dolor vestibulum malesuada. Integer laoreet quam egestas pulvinar consectetur. Duis eget arcu tristique, luctus ante sed, sodales lorem. Nullam mollis eget felis quis vehicula. sit amet, consectetur adipiscing elit. Aliquam ut accumsan quam. Mauris eget ullamcorper purus, eget suscipit arcu. Quisque dapibus mauris et nulla feugiat porta. Mauris est dolor, cursus eget placerat bibendum, volutpat ut tellus. Quisque molestie lobortis condimentum. Sed vitae turpis et dolor vestibulum malesuada. Integer laoreet quam egestas pulvinar consectetur. Duis eget arcu tristique, luctus ante sed, sodales lorem. Nullam mollis eget felis quis vehicula." 
    },
    {
        name: "Heavens's Rest",
        image: "https://res.cloudinary.com/simplotel/image/upload/x_0,y_528,w_3883,h_2184,r_0,c_crop,q_60,fl_progressive/w_400,f_auto,c_fit/youreka/Youreka_adventure_camps_for_kids_Kangra_3_dfndgn",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut accumsan quam. Mauris eget ullamcorper purus, eget suscipit arcu. Quisque dapibus mauris et nulla feugiat porta. Mauris est dolor, cursus eget placerat bibendum, volutpat ut tellus. Quisque molestie lobortis condimentum. Sed vitae turpis et dolor vestibulum malesuada. Integer laoreet quam egestas pulvinar consectetur. Duis eget arcu tristique, luctus ante sed, sodales lorem. Nullam mollis eget felis quis vehicula." 
    },
    {
        name: "Hello's Rest",
        image: "https://res.cloudinary.com/simplotel/image/upload/x_0,y_528,w_3883,h_2184,r_0,c_crop,q_60,fl_progressive/w_400,f_auto,c_fit/youreka/Youreka_adventure_camps_for_kids_Kangra_3_dfndgn",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut accumsan quam. Mauris eget ullamcorper purus, eget suscipit arcu. Quisque dapibus mauris et nulla feugiat porta. Mauris est dolor, cursus eget placerat bibendum, volutpat ut tellus. Quisque molestie lobortis condimentum. Sed vitae turpis et dolor vestibulum malesuada. Integer laoreet quam egestas pulvinar consectetur. Duis eget arcu tristique, luctus ante sed, sodales lorem. Nullam mollis eget felis quis vehicula." 
    }
]

 async function seedDB(){
    await Campground.deleteMany({});
    await Comment.deleteMany({});

    // for (const seed of seeds) {
    //     let campground = await Campground.create(seed);
    //     let comment = await Comment.create(
    //         {
    //             text: "This place is great, but I wish there was internet",
    //             author: "Homer"
    //         }
    //     );
    //     campground.comments.push(comment);
    //     campground.save();
    // }

}

module.exports = seedDB;