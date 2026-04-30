import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import User from '../models/usermodel.js';
import AppError from '../utils/error.util.js';
import sendEmail from '../utils/sendEmail.js';
import Contact from '../models/contact.model.js';

/**
 * @CONTACT_US
 * Handles the submission of the "Contact Us" form by the user.
 * Sends an email to the admin with the user's details.
 */
export const contactUs = asyncHandler(async (req, res, next) => {
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
      return next(new AppError('Name, Email, Message are required'));
    }
  
    try {
      const subject = 'Contact Us Form';
      const textMessage = `${name} - ${email} <br /> ${message}`;
  
      await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);

      // Save the message to Database
      await Contact.create({
          name,
          email,
          message
      });

    } catch (error) {
      console.log(error);
      return next(new AppError(error.message, 400));
    }
  
    res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully',
    });
});
/**
 * @USER_STATS
 * Fetches the statistics of the users (total users and active subscribers).
 */
export const userStats = asyncHandler(async (req, res, next) => {
    const allUsersCount = await User.count();
  
    res.status(200).json({
      success: true,
      message: 'All registered users count',
      allUsersCount,
      subscribedUsersCount: 0,
    });
  });