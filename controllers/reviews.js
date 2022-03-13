const Tutor = require('../models/tutor');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const tutor = await Tutor.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    tutor.reviews.push(review);
    await review.save();
    await tutor.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/tutors/${tutor._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Tutor.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/tutors/${id}`);
}
