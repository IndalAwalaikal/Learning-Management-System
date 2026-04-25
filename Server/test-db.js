import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(async () => {
    const C = mongoose.model('Course', new mongoose.Schema({ lectures: Array }, { strict: false }));
    const course = await C.findOne({ "lectures.0": { $exists: true } });
    if (course) {
        console.log("Lecture secure_url:", course.lectures[course.lectures.length - 1].lecture.secure_url);
    } else {
        console.log("no courses with lectures");
    }
    process.exit(0);
});
