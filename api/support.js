const nodemailer = require("nodemailer");

module.exports = async (req, res) => {

    // Allow requests from your website
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://lunaxbotai.com"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Handle browser CORS check
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only accept POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const {
            name,
            email,
            message
        } = req.body || {};


        // Validate fields
        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message: "Please complete all fields."
            });

        }


        // Create SMTP connection
        const transporter = nodemailer.createTransport({

            host: "mail.lunaxbotai.com",

            port: 465,

            secure: true,

            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }

        });


        // Send support email
        await transporter.sendMail({

            from:
                `"LUNAXBOT AI Support" <${process.env.SMTP_USER}>`,

            to:
                process.env.SUPPORT_TO,

            replyTo:
                email,

            subject:
                `Support Request from ${name}`,

            text:
`New LUNAXBOT AI Support Request

Name: ${name}
Email: ${email}

Message:
${message}
`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 650px;
                    margin: auto;
                    padding: 25px;
                    background: #f7f9fc;
                    border-radius: 12px;
                ">

                    <h2 style="color:#1f6fff;">
                        LUNAXBOT AI Support
                    </h2>

                    <p>
                        <strong>Name:</strong>
                        ${escapeHtml(name)}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${escapeHtml(email)}
                    </p>

                    <hr>

                    <h3>
                        Message
                    </h3>

                    <p style="
                        white-space: pre-wrap;
                        line-height: 1.6;
                    ">
                        ${escapeHtml(message)}
                    </p>

                </div>
            `

        });


        // Success
        return res.status(200).json({

            success: true,

            message:
                "Your message has been sent successfully."

        });


    } catch (error) {

        console.error(
            "Support email error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to send your message right now."

        });

    }

};


// Prevent HTML injection in the email
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
