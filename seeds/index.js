const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Tutor = require('../models/tutor');

mongoose.connect('mongodb://localhost:27017/tutors', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Tutor.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Tutor({
            //YOUR USER ID
            author: '6131eaf1e726503f4847182c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price, 
            email:'nhi@gmail.com',
           

             
            images: [
                {
                    url:  ' https://res.cloudinary.com/dyltwgtdz/image/upload/v1631260742/tutor/cj9ay8daghheuwscs6l4.jpg',
                    filename:  'tutor/cj9ay8daghheuwscs6l4'
                }
                 
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})