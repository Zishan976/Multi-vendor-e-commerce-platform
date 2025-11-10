import { transporter } from '../config/emailConfig.js';

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
    const subject = 'Order Confirmation - Multi-Vendor E-Commerce';
    const html = `
        <h2>Thank you for your order!</h2>
        <p>Your order has been successfully placed.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderDetails.id}</p>
        <p><strong>Total Amount:</strong> $${orderDetails.total_amount}</p>
        <p><strong>Status:</strong> ${orderDetails.status}</p>
        <h4>Items:</h4>
        <ul>
            ${orderDetails.items.map(item => `<li>${item.name} - Quantity: ${item.quantity} - Price: $${item.price}</li>`).join('')}
        </ul>
        <p>We will notify you when your order is shipped.</p>
    `;

    return await sendEmail(userEmail, subject, html);
};

export const sendVendorApprovalEmail = async (vendorEmail, vendorDetails) => {
    const subject = 'Vendor Application Approved';
    const html = `
        <h2>Congratulations!</h2>
        <p>Your vendor application has been approved.</p>
        <h3>Vendor Details:</h3>
        <p><strong>Business Name:</strong> ${vendorDetails.business_name}</p>
        <p><strong>Email:</strong> ${vendorDetails.email}</p>
        <p>You can now start adding products to your store.</p>
    `;

    return await sendEmail(vendorEmail, subject, html);
};

export const sendVendorRejectionEmail = async (vendorEmail, reason) => {
    const subject = 'Vendor Application Update';
    const html = `
        <h2>Vendor Application Update</h2>
        <p>We regret to inform you that your vendor application has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>You can reapply after addressing the issues mentioned.</p>
    `;

    return await sendEmail(vendorEmail, subject, html);
};

export const sendOrderStatusUpdateEmail = async (userEmail, orderId, newStatus) => {
    const subject = 'Order Status Update';
    const html = `
        <h2>Order Status Update</h2>
        <p>Your order status has been updated.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
    `;

    return await sendEmail(userEmail, subject, html);
};
