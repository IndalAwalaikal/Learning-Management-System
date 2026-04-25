import fs from 'fs';
console.log("Course Model createdBy:", fs.readFileSync('models/course.model.js', 'utf8').substring(0, 1000));
console.log("\nUser Model enum:", fs.readFileSync('models/user.model.js', 'utf8').substring(0, 1000));
