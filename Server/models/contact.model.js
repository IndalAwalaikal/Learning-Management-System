import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxLength: [50, 'Name must be less than 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please fill in a valid email address',
            ],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            maxLength: [1000, 'Message must be less than 1000 characters']
        }
    },
    {
        timestamps: true
    }
);

const Contact = model('Contact', contactSchema);

export default Contact;
