# scf.center GoDaddy to Vercel DNS Checklist

Domain: `scf.center`

## Current Screenshot Read

Visible website record:

```text
A    @    185.230.63.107    TTL 1 Hour
```

That IP is not Vercel. It likely points to an existing website provider.

Visible email / Microsoft records include:

```text
CNAME    autodiscover    autodiscover.outlook.com.
CNAME    email           email.secureserver.net.
CNAME    lyncdiscover    webdir.online.lync.com.
```

Do not delete email-related records.

## Important Warning

A temporary Vercel project named `my-medical-sanctuary` was created during connector testing, but it only contains a dummy `package.json`.

Do not connect `scf.center` to that dummy deployment.

Recommended action in Vercel:

1. Delete the dummy `my-medical-sanctuary` project, or ignore it.
2. Import the real project from GitHub as a new Vercel project.
3. Confirm the real deployment preview works.
4. Only then update GoDaddy DNS.

## Required Real Deployment Flow

1. Create/push the real code repository to GitHub.
2. Import GitHub repo into Vercel.
3. Set framework preset: Next.js.
4. Build command:

```bash
npm run build
```

5. Install command:

```bash
npm install
```

6. Confirm the Vercel deployment URL loads correctly.
7. Add domain in Vercel:

```text
scf.center
www.scf.center
```

8. Follow Vercel domain verification instructions.

## GoDaddy DNS Records for Vercel

After Vercel has the real project ready, update GoDaddy DNS:

### Root / Apex Domain

Edit the current A record:

```text
Type: A
Name: @
Value: 76.76.21.21
TTL: 1 Hour
```

This replaces:

```text
A    @    185.230.63.107
```

### WWW Domain

If a `www` record exists, edit it. If not, add:

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

## Records To Preserve

Do not delete:

- NS records
- MX records
- TXT records for email/SPF/DKIM/DMARC
- `autodiscover`
- `email`
- `lyncdiscover`
- Microsoft / Outlook records

## DNS Propagation

Expected:

- Some changes may work within minutes.
- Full propagation may take up to 24-48 hours.

## Post-Connection Checks

Check:

- `https://scf.center`
- `https://www.scf.center`
- HTTP redirects to HTTPS
- Either root or www is selected as primary in Vercel
- Email still works
- Vercel SSL certificate is issued

## Recommended Primary Domain

Use:

```text
scf.center
```

Redirect:

```text
www.scf.center -> scf.center
```

