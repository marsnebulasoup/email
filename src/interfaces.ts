export interface EmailDetails {
  from: {
    email: string,
    name: string,
  }
  to: {
    email: string
    name: string
  }
  subject: string,
  bodyType: string; // e.g. text/html
  body: string,
  reply_to?: {
    email: string,
    name: string
  }
}

export interface EmailSecurity {
  dkim_domain: string,
  dkim_selector: string,
  dkim_private_key: string
}

export interface EmailRequest {
  personalizations: {
    to: {
      email: string,
      name: string
    }[],
    dkim_domain: string,
    dkim_selector: string,
    dkim_private_key: string,
    reply_to?: {
      email: string,
      name: string
    }
  }[],
  from: {
    email: string,
    name: string,
  },
  subject: string,
  content: {
    type: string,
    value: string
  }[],
}

// Environment Variables
export interface Environment {
  AUTH_HEADER: string,
  AUTH_TOKEN: string,
  DKIM_DOMAIN: string,
  DKIM_SELECTOR: string,
  DKIM_PRIVATE_KEY: string,
}