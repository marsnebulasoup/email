import { ResponseInvalid } from './responses';
import { EmailDetails, EmailRequest, EmailSecurity } from './interfaces';

const API_URL = "https://api.mailchannels.net/tx/v1/send";

export class Email {
  private readonly request?: EmailRequest;
  private readonly isValid: boolean;

  constructor(details: EmailDetails, security: EmailSecurity) {
    try {
      this.request = {
        personalizations: [{
          to: [{
            email: details.to.email,
            name: details.to.name
          }],
          dkim_domain: security.dkim_domain,
          dkim_selector: security.dkim_selector,
          dkim_private_key: security.dkim_private_key
        }],
        from: {
          email: details.from.email,
          name: details.from.name
        },
        subject: details.subject,
        content: [{
          type: details.bodyType,
          value: details.body
        }]
      }
      this.isValid = true;
    } catch {
      this.isValid = false;
    }
  }

  public async send(): Promise<Response> {
    let response = ResponseInvalid();

    if (this.isValid) {
      const apiResponse = await fetch(API_URL, {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
        },
        "body": JSON.stringify(this.request)
      });

      response = new Response(apiResponse.body, apiResponse);
    }

    return response;
  }
}