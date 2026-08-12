const nodemailer = require("nodemailer");

module.exports = async (req, res) => {

    // ==========================================
    // CORS
    // ==========================================

    const allowedOrigins = [
        "https://lunaxbotai.com",
        "https://www.lunaxbotai.com",
        "https://xhubai.vercel.app"
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader(
            "Access-Control-Allow-Origin",
            origin
        );
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ==========================================
    // HANDLE PREFLIGHT REQUEST
    // ==========================================

    if (req.method === "OPTIONS") {

        return res
            .status(200)
            .end();

    }


    // ==========================================
    // ONLY ACCEPT POST
    // ==========================================

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({
                success: false,
                message: "Method not allowed"
            });

    }


    try {

        // ==========================================
        // GET FORM DATA
        // ==========================================

        const {
            name,
            email,
            message
        } = req.body || {};


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !name ||
            !email ||
            !message
        ) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: "Please complete all fields."
                });

        }


        // ==========================================
        // CREATE SMTP CONNECTION
        // ==========================================

        const transporter =
            nodemailer.createTransport({

                host:
                    "mail.lunaxbotai.com",

                port:
                    465,

                secure:
                    true,

                auth: {

                    user:
                        process.env.SMTP_USER,

                    pass:
                        process.env.SMTP_PASS

                }

            });


        // ==========================================
        // SEND SUPPORT EMAIL
        // ==========================================

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

                    <h2 style="
                        color:#1f6fff;
                    ">
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


        // ==========================================
        // SUCCESS
        // ==========================================

        return res
            .status(200)
            .json({

                success:
                    true,

                message:
                    "Your message has been sent successfully."

            });


    } catch (error) {

        // ==========================================
        // ERROR
        // ==========================================

        console.error(
            "Support email error:",
            error
        );


        return res
            .status(500)
            .json({

                success:
                    false,

                message:
                    "Unable to send your message right now."

            });

    }

};


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
