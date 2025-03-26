import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const sendEmail = {
  /**
   * Send a registration verification email to a user.
   * @param {string} userEmail - The recipient's email.
   * @returns {Promise} - Axios POST request to send the email.
   */
  async sendRegistrationVerificationMail(userEmail) {
    try {
      token = uuidv4();
      const verificationLink = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

      console.log("Starting transaction: Updating user & sending email...");

      // Transaction logic
      const responses = await Promise.all([
        await axios.put(`/api/${userEmail}/${token}`),
        await axios.post("/api/send-email", {
          sender: `"FurLand - User Verification " <no-reply@furlandapp.com>`,
          to: userEmail,
          subject: "Verify Your FurLand Account",
          text: `Click the following link to verify your account: ${verificationLink}`,
          html: `
          <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333;">Verify Your Account</h2>
            <p>Click the button below to verify your email.</p>
            <a href="${verificationLink}" 
               style="display: inline-block; background-color: #ff6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; margin-top: 10px;">
              Verify My Account
            </a>
            <p style="color: #777; font-size: 12px; margin-top: 20px;">
              If you did not request this, please ignore this email.
            </p>
          </div>
        `,
        }),
      ]);

      console.log(
        "Transaction completed:",
        responses.map((res) => res.status)
      );

      return NextResponse.json(
        { message: "Sent verifiation email successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  },
};

export default sendEmail;
