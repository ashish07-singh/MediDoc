import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        // Log the email configuration (remove sensitive data in production)
        console.log('Email Configuration:');
        console.log('Host:', process.env.EMAIL_HOST);
        console.log('Port:', process.env.EMAIL_PORT);
        console.log('User:', process.env.EMAIL_USER);
        console.log('Pass:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
        
        // Validate environment variables
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Missing email environment variables. Please check your .env file.');
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('Email transporter verified successfully');

        const mailOptions = {
            from: `HealthLife <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        console.log('Sending email to:', options.email);
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        
        return result;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;