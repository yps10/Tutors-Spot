const Tutor = require('../models/tutor');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const tutors = await Tutor.find({}).populate('popupText');
    res.render('tutors/index', { tutors })
}

module.exports.renderNewForm = (req, res) => {
    res.render('tutors/new');
}

module.exports.createTutor = async (req, res, next) => {
     
    const tutor = new Tutor(req.body.tutor);
     
    tutor.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tutor.author = req.user._id;
    await tutor.save();
    console.log(tutor);
    req.flash('success', 'Successfully made a new tutor!');
    res.redirect(`/tutors/${tutor._id}`)
}

module.exports.showTutor = async (req, res,) => {
    const tutor = await Tutor.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!tutor) {
        req.flash('error', 'Cannot find that tutor!');
        return res.redirect('/tutors');
    }
    res.render('tutors/show', { tutor });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const tutor = await Tutor.findById(id)
    if (!tutor) {
        req.flash('error', 'Cannot find that tutor!');
        return res.redirect('/tutors');
    }
    res.render('tutors/edit', { tutor });
}

module.exports.updateTutor = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const tutor = await Tutor.findByIdAndUpdate(id, { ...req.body.tutor });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tutor.images.push(...imgs);
    await tutor.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await tutor.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated tutor!');
    res.redirect(`/tutors/${tutor._id}`)
}

module.exports.deleteTutor = async (req, res) => {
    const { id } = req.params;
    await Tutor.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted tutor')
    res.redirect('/tutors');
}