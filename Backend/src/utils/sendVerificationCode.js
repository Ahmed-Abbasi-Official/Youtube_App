import { asyncHandler } from "./asyncHandler.js";
import { transporter } from "./emailConfig.js";
import { Verification_Email_Template } from "./emailTemplate.js";


export const sendVerificationCode=asyncHandler(async(email,verificationCode)=>{
      // send mail with defined transport object
      const response = await transporter.sendMail({
        from: `"From AhmiiPlay👻" ${process.env.OWNER_EMAIL}`, // sender address
        to: email, // list of receivers
        subject: "Email Verification ✔", // Subject line
        text: "Please Verified Through the Code", // plain text body
        html: Verification_Email_Template.replace("{verificationCode}",verificationCode), // html body
      });

      console.log("Email Send Succesfully : ",response)
     
})