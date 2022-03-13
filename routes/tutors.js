const express = require('express');
const router = express.Router();
const tutors = require('../controllers/tutors');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTutor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Tutor = require('../models/tutor');

router.route('/')
    .get(catchAsync(tutors.index))
    .post(isLoggedIn, upload.array('image'), validateTutor, catchAsync(tutors.createTutor))


router.get('/new', isLoggedIn, tutors.renderNewForm)

router.route('/:id')
    .get(catchAsync(tutors.showTutor))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTutor, catchAsync(tutors.updateTutor))
    .delete(isLoggedIn, isAuthor, catchAsync(tutors.deleteTutor));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(tutors.renderEditForm))



module.exports = router;