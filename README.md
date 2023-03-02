# cloudflare-workers-emails

A Cloudflare Worker for sending signed emails with MailChannels. You don't need to sign up for Mailchannels - as long as requests come from Cloudflare Workers, everything will work.

See [send email using Workers with MailChannels](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/)

```
const message = JSON.stringify({
  "from": {
    "email": "hello@example.com",
    "name": "John Smith"
  },
  "to": {
    "email": "me@you.com",
    "name": "Bob Odenkirk"
  },
  "subject": "Hello from John",
  "bodyType": "text/plain",
  "body": "Thanks for contacting us",
  "reply_to": {
    "email": "hello@example.com",
    "name": "John"
  }
});


fetch("https://email.hatc.workers.dev/", {
  method: 'POST',
  headers: {
    "X-Auth-Token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  body: message,
})
  .then(response => { console.log(response.status); return response.text() })
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

// Response (from MailChannels):
202 Accepted
null

```

## Setup
Clone this repo and update the wrangler.toml file:
```
name = "email"
main = "src/index.ts"
compatibility_date = "2023-03-02"
usage_model = "bundled"
env = { }

[triggers]
crons = [ ]

[vars]
AUTH_HEADER = "X-Auth-Token"                        # name of the header you'll have to pass the token below to to send mail
AUTH_TOKEN = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"      # make something up here, for your personal authentication
DKIM_DOMAIN = "example.com"                         # the domain you want to send mail through
DKIM_PRIVATE_KEY = "..."                            # private key
DKIM_SELECTOR = "mailchannels"                      # we're sending via mailchannels's free API
```

Deploy:
```
npx wrangler publish
```

## Security

This is an optional feature to prevent email spoofing. You can keep the DKIM variables blank and emails will still be sent:
```
DKIM_DOMAIN = ""
DKIM_PRIVATE_KEY = ""
DKIM_SELECTOR = ""
```

If you're keeping these blank, skip the next steps.


### Generate the keys

Private keys:
```
openssl genrsa -f4 -out private.pem 4096
openssl rsa -in private.pem -outform der | openssl base64 -A > priv_key.txt
```

Public keys:
```
openssl rsa -in private.pem -pubout -outform der | openssl base64 -A >> pub_key.txt
```

Put the contents of `priv_key.txt` in the `DKIM_PRIVATE_KEY` environment variable.

### Update DNS records

**DKIM record**
Create a TXT record in for the domain you are sending emails from. The domain doesn't have to be registered on Cloudflare.

```
Name: mailchannels._domainkey
Content: v=DKIM1;t=s;p=EVERYTHING FROM PUB_KEY.TXT
```

[More information](https://www.cloudflare.com/learning/dns/dns-records/dns-dkim-record/)

**DMARC record**
Create a TXT record 
```
Name: _dmarc
Content: v=DMARC1; p=reject; rua=mailto:YOUR EMAIL ADDRESS
```

Replace YOUR EMAIL ADDRESS with an email address if you'd like to recieve regular reports about emails sent with your domain.

[More information](https://www.cloudflare.com/learning/dns/dns-records/dns-dmarc-record/)