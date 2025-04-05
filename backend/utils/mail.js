import nodemailer from "nodemailer"


export const mailer =  async(to, subject, html) => {

    const transporter = nodemailer.createTransport(
        {
            service : gmail,
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASSWORD
            }
        }
    )

    const mailOptions = {

        from : `ChoreLord Procrastitron  ${process.env.EMAIL_USER}`,
        to ,
        subject,
        html
    }


    await transporter.sendMail(mailOptions)
}