import axios from "axios";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const sendEmail = {
  /**
   * Send a registration verification email to a user.
   * @param {string} userEmail - The recipient's email.
   * @returns {Promise} - Axios POST request to send the email.
   */
  async sendRegistrationVerificationMail(userEmail) {
    try {
      const token = uuidv4();
      const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verified-success?token=${token}`;

      console.log("Starting transaction: Updating user & sending email...");

      // Transaction logic
      const responses = await Promise.all([
        await axios.put(`/api/user/email/${userEmail}/${token}`),
        await axios.post("/api/send-email", {
          sender: `"FurLand - User Verification " <no-reply@furlandapp.com>`,
          to: userEmail,
          subject: "Verify Your FurLand Account",
          text: `Click the link below to verify your account`,
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
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
              This is an automated message. Please do not reply.
            </div>
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
      // todo: delete user
      await axios.delete(`/api/user/email/${userEmail}`);
      throw new Error("Failed to send verification email");
    }
  },
  /**
   * Send a approve reservation email to a user.
   * @param {string} userEmail - The recipient's email.
   * @param {string} title - The name of the reservated listing.
   * @param {int} totalPrice - The price user needs to pay for booking.
   * @param {string} image - The image url of the booked listing.
   * @param {date} startDate - Start date of the reservation.
   * @param {date} endDate - End date of the reservation.
   * @param {string} ban - Bank account number of the listing owner.
   * @returns {Promise} - Axios POST request to send the email.
   */
  async sendApprovedReservation(
    userEmail,
    title,
    totalPrice,
    image,
    startDate,
    endDate,
    ban
  ) {
    try {
      await axios.post("/api/send-email", {
        sender: `"FurLand - Reservation Approved " <no-reply@furlandapp.com>`,
        to: userEmail,
        subject: `Your reservation at ${title} has been approved`,
        text: ` `,
        html: `<div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Reservation Approved</h2>
                <img src="${image}" alt="Listing image" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;" />
                <h3 style="color: #4e89ff; margin-bottom: 5px;">${title}</h3>
                 <p style="margin: 0; font-size: 16px; color: #444;">
                  Your reservation has been approved for the following period:
                  <br />
                  <strong>Check-in:</strong> ${startDate}<br/>
                  <strong>Check-out:</strong> ${endDate}
                </p>
                <div style="margin-top: 20px; font-size: 16px; color: #333;">
                  ${
                    ban
                      ? `💸 Please make a payment of <strong>${totalPrice} RSD</strong> to the account number below:<br/>
                        <div style="font-weight: bold; font-size: 18px; margin-top: 10px;">${ban}</div>`
                      : `💸 Total price: <strong>${totalPrice} RSD</strong>`
                  }
                </div>
                <p style="margin-top: 30px; font-size: 14px; color: #777;">Thank you for choosing us! 🐾</p>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                  This is an automated message. Please do not reply.
                </div>
              </div>
            `,
      });

      return NextResponse.json(
        { message: "Sent mail for approved reservation successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending approved reservation email:", error);
      throw new Error("Failed to send approved reservation email");
    }
  },
  /**
   * Send a reject reservation email to a user.
   * @param {string} userEmail - The recipient's email.
   * @param {string} title - The name of the reservated listing.
   * @param {string} image - The image url of the booked listing.
   * @param {date} startDate - Start date of the reservation.
   * @param {date} endDate - End date of the reservation.
   * @param {string} rejectReason - Owner reason of rejection.
   * @returns {Promise} - Axios POST request to send the email.
   */
  async sendRejectedReservation(
    userEmail,
    title,
    image,
    startDate,
    endDate,
    rejectReason
  ) {
    try {
      await axios.post("/api/send-email", {
        sender: `"FurLand - Reservation Rejected " <no-reply@furlandapp.com>`,
        to: userEmail,
        subject: `Your reservation at ${title} has been rejected`,
        text: ` `,
        html: `<div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f2dede; border-radius: 10px; background-color: #fff5f5;">
                <h2 style="color: #d9534f;">Reservation Rejected</h2>
                <p style="font-size: 16px; color: #333;">We're sorry, but your reservation request for <strong>${title}</strong> 
                <br/>
                in period from <strong>${startDate}</strong> to <strong>${endDate}</strong> has been declined.</p>
                <img src="${image}" alt="Listing Image" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;" />
                
                <div style="margin-top: 20px; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px;">
                  <p style="margin: 0; font-size: 15px; color: #721c24;">
                    <strong>Reason provided by the owner:</strong><br/>
                    ${rejectReason}
                  </p>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #777;">
                  Feel free to browse other listings and make a new reservation. We hope you find the perfect stay for your pet soon! 🐾
                </p>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                  This is an automated message. Please do not reply.
                </div>
              </div>`,
      });

      return NextResponse.json(
        { message: "Sent mail for rejected reservation successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending rejected reservation email:", error);
      throw new Error("Failed to send rejected reservation email");
    }
  },
  /**
   * Send a made reservation email to a hotel owner.
   * @param {string} userEmail - The recipient's email.
   * @param {string} title - The name of the reservated listing.
   * @param {string} reserveeName - The name of the user who reserved stay.
   * @param {string} reserveeEmail - The email of the user who reserved stay.
   * @param {string} breed - Breed of the pet.
   * @param {int} totalPrice - The price user needs to pay for booking.
   * @param {date} startDate - Start date of the reservation.
   * @param {date} endDate - End date of the reservation.
   * @returns {Promise} - Axios POST request to send the email.
   */
  async sendReservationMade(
    userEmail,
    title,
    reserveeName,
    reserveeEmail,
    breed,
    totalPrice,
    startDate,
    endDate
  ) {
    try {
      await axios.post("/api/send-email", {
        sender: `"FurLand - Reservation requested at your object " <no-reply@furlandapp.com>`,
        to: userEmail,
        subject: `Reservation at ${title} has been requested`,
        text: ` `,
        html: `<div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Reservation Requested</h2>
                <h3 style="color: #4e89ff; margin-bottom: 5px;">${reserveeName}</h3>
                <h3 style="color: #5e99ff; margin-bottom: 5px;">${reserveeEmail}</h3>
                 <p style="margin: 0; font-size: 16px; color: #444;">
                  Reservation by ${reserveeName} (${reserveeEmail}) has been requested for the ${breed} for the following period:
                  <br />
                  <strong>Check-in:</strong> ${startDate}<br/>
                  <strong>Check-out:</strong> ${endDate}
                </p>
                <div style="margin-top: 20px; font-size: 16px; color: #333;">
                  ${`💸 Total price: <strong>${totalPrice} RSD</strong>`}
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                  This is an automated message. Please do not reply.
                </div>
              </div>
            `,
      });

      return NextResponse.json(
        { message: "Sent mail for approved reservation successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending approved reservation email:", error);
      throw new Error("Failed to send approved reservation email");
    }
  },
  /**
   * Send a request verification of listing to the admin.
   * @param {string} title - The name of the listing.
   * @param {uuidv4} listingId - Id of the listing to be verified.
   * @returns {Promise} - Axios POST request to send the email.
   */
  async sendRequestListingVerification(title, listingId) {
    try {
      // Transaction logic
      const responses = await Promise.all([
        await axios.post("/api/send-email", {
          sender: `"Listing verification for ${title} " <no-reply@furlandapp.com>`,
          to: "pet.hotel.official@gmail.com",
          subject: `${title} requires verification`,
          text: `Can you please review and verify ${title} listing with id: ${listingId}.`,
        }),
      ]);

      return NextResponse.json(
        { message: "Sent request verification email successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending request verification email:", error);
      throw new Error("Failed to send request verification email");
    }
  },
};

export default sendEmail;
