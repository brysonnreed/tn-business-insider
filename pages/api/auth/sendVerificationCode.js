import { createTransport } from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { email, verificationCode } = req.body

  // Use your mailer settings here
  const transporter = createTransport({
    name: 'box5732.bluehost.com',
    host: 'box5732.bluehost.com', // Replace this with your email provider's SMTP host
    port: 465, // Replace this with your email provider's SMTP port (465 for SSL)
    secure: true, // Set to true for SSL, or false for TLS
    auth: {
      user: 'verify@tnbusinessinsider.com', // Your email address
      pass: process.env.VERIFY_EMAIL_PASSWORD, // Replace this with your email password
    },
  })

  try {
    // Send the verification email
    const mailData = {
      from: '"TNBusinessInsider" <verify@tnbusinessinsider.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }
  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }
  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #1a82e2;
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  
.shadow {
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

  </style>

</head>
<body style="background-color: #ffffff">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Before we can create an account for you, we need to verify your email address.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#ffffff">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 20px 10px;">
              <a href="https://www.tnbusinessinsider.com" target="_blank" style="display: inline-block;">
                <img src="https://cdn.sanity.io/images/yuy7c73l/production/b12a1a758aef8a689fa82d697ad1f865af09ca5e-4508x1503.jpg" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: 200px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->
    <div class='box'>
    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#ffffff">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Verify Your Email Address</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#ffffff">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Before we can create your account, we need to verify this email address. Listed below is your verifcation code. If you didn't create an account with <a href="https://tnbusinessinsider.com">TNBusinessInsider</a>, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="ED8936" style="border-radius: 6px;" class='shadow'>
                          <p style="display: inline-block; padding: 0px 32px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 24px; color: #ffffff; text-decoration: none; border-radius: 6px;">${verificationCode}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser and try again:</p>
              <p style="margin: 0;"><a href="https://tnbusinessinsider.com" target="_blank">https://tnbusinessinsider.com/register</a></p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Thank you,<br> TNBusinessInsider</p>
            </td>
          </tr>
          <!-- end copy -->
        </div>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->


  </table>
  <!-- end body -->

</body>
</html>`,
    }

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          console.log('Server is ready to take our messages')
          resolve(success)
        }
      })
    })

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          console.log(info)
          resolve(info)
        }
      })
    })

    // You can save the verification code in a database or session to check later
    // For simplicity, we're not saving it here.

    return res
      .status(200)
      .json({ message: 'Verification code sent successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error sending verification code' })
  }
}
