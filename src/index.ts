import { Email } from './email';
import { ResponseUnauthorized, ResponsePreflight } from './responses';
import { EmailDetails, EmailSecurity, Environment } from './interfaces';


export default {
  async fetch(request: Request, env: Environment) {
    let response = ResponseUnauthorized();

    // Allow to work with CORS
    if (request.method === "OPTIONS") {
      response = ResponsePreflight();
    }
    else {
      if (request.headers.get(env.AUTH_HEADER) === env.AUTH_TOKEN) {
        if (request.method === "POST") {
          const details: EmailDetails = await request.json();
          const security: EmailSecurity = {
            dkim_domain: env.DKIM_DOMAIN,
            dkim_selector: env.DKIM_SELECTOR,
            dkim_private_key: env.DKIM_PRIVATE_KEY,
            x_api_key: env.X_API_KEY
          }
          const email = new Email(details, security);

          response = await email.send();

        }
      }
    }

    
    response.headers.append("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Headers", `Content-Type, ${env.AUTH_HEADER}`);

    return response;
  }
}