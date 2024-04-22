const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {logger} = require("firebase-functions");
const {remoteConfig} = require("firebase-admin");

initializeApp();

const getConfig = async () => {
  const remoteConfigValues = await remoteConfig().getTemplate();

  const EMAILER_API_TOKEN =
    remoteConfigValues.parameters["EMAILER_API_TOKEN"].defaultValue.value;

  return {
    EMAILER_API_TOKEN,
  };
};

const generateHtml = ({data, websiteRootUrl, websiteName}) => {
  let content = [];
  for (const item of data) {
    content.push(`
            <h2 class="sm-leading-8" style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #000">${item.key}</h2>
            <p style="margin: 0;">
            ${item.value}
            </p>
            <br>
        `);
  }
  const mappedContent = content.join("");

  return `
      <!DOCTYPE html>
      <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
        <meta charset="utf-8">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <style>
          td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
        </style>
        <![endif]-->
        <title>Confirm your email address</title>
        <style>
          @media (max-width: 600px) {
            .sm-my-8 {
              margin-top: 32px !important;
              margin-bottom: 32px !important
            }
            .sm-px-4 {
              padding-left: 16px !important;
              padding-right: 16px !important
            }
            .sm-px-6 {
              padding-left: 24px !important;
              padding-right: 24px !important
            }
            .sm-leading-8 {
              line-height: 32px !important
            }
          }
        </style>
      </head>
      <body style="margin: 0; width: 100%; background-color: #f8fafc; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
        <div role="article" aria-roledescription="email" aria-label="Confirm your email address" lang="en">
          <div class="sm-px-4" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
            <table align="center" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td style="width: 752px; max-width: 100%">
                  <div class="sm-my-8" style="margin-top: 48px; margin-bottom: 48px; text-align: center">
                    <a href="https://claster.cz">
                      <img src="https://claster.cz/brand/logo300x400.png" width="70" alt="Claster logo" style="max-width: 100%; vertical-align: middle; line-height: 1">
                    </a>
                  </div>
                  <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                    <tr>
                      <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 48px; font-size: 16px; color: #334155; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)">
                        <h1 class="sm-leading-8" style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #000">
                          Dostali jste nové upozornění z <a href="${websiteRootUrl}" style="color: #60a5fa; text-decoration-line: underline">${websiteName}</a>!
                        </h1>
                        <p style="margin: 0;">
                            Vážený zákazníku, obdržel jste tuto informaci:
                        </p>
                        <br>
                        <br>
                        ${mappedContent}
                        <div role="separator" style="background-color: #e2e8f0; height: 1px; line-height: 1px; margin: 32px 0">&zwj;</div>
                        <p style="margin: 0;">
                          S pozdravem,
                          <br>
                          Tým Claster Solutions
                        </p>
                      </td>
                    </tr>
                    <tr role="separator">
                      <td style="line-height: 48px">&zwj;</td>
                    </tr>
                    <tr>
                      <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                        <p style="margin: 0 0 16px; text-transform: uppercase">
                          Powered by Claster Solutions
                        </p>
                        <br>
                        <p style="margin-bottom: 2px; line-height: 8px">contact@claster.cz</p>
                        <p style="margin-bottom: 2px; line-height: 8px;"><a href="https://claster.cz" style="color: #3b82f6;">claster.cz</a></p>
                      </td>
                    </tr>
                    <tr role="separator">
                      <td style="line-height: 48px;">&zwj;</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </body>
      </html>
      `;
};

exports.email = onRequest(async (req, res) => {
  try {
    const recipients = req.body.recipients;
    const websiteRootUrl = req.body.websiteRootUrl;
    const websiteName = websiteRootUrl
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");
    const data = req.body.data;
    const {EMAILER_API_TOKEN} = await getConfig();

    // Validate data
    if (!recipients || !websiteRootUrl || !data) throw new Error("Missing required data");
    if (!Array.isArray(recipients)) throw new Error("Recipients must be an array");
    if (!Array.isArray(data)) throw new Error("Data must be an array");
    if (recipients.length === 0) throw new Error("Recipients array must not be empty");
    if (data.length === 0) throw new Error("Data array must not be empty");
    if (!EMAILER_API_TOKEN) throw new Error("Missing EMAILER_API_TOKEN");

    fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${EMAILER_API_TOKEN}`,
      },
      body: JSON.stringify({
        from: {
          email: "contact@claster.cz",
          name: "Claster Solutions",
        },
        to: recipients,
        subject: `Dostali jste nové upozornění z ${websiteName}!`,
        html: generateHtml({data, websiteRootUrl, websiteName}),
      }),
    }).then((mailerRes) => {
      if (!(mailerRes.status >= 200 && mailerRes.status < 300))
        throw new Error("Something went wrong");
    });
  } catch (error) {
    logger.error("Error:", error);
    res.status(500).send(error);
  } finally {
    res.status(200).send("OK");
  }
});
