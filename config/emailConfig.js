import nodemailer from 'nodemailer';

// Email transporter configuration
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465, // অথবা 587
    secure: true, // 465 হলে true, 587 হলে false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email connection (optional, for debugging)
export const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email server is ready to send messages');
    } catch (error) {
        console.error('Email server connection failed:', error);
    }
};
