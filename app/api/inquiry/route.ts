import { Resend } from "resend";

// Sender uses the Resend-verified subdomain; replies go back to the visitor.
const FROM = "RaJA International <inquiry@info.raja-international.com>";
// Staff notifications go to the company inbox plus a personal copy.
const COMPANY = "info@raja-international.com";
const TO = [COMPANY, "eoalferez@gmail.com"];

type Payload = {
  name?: string;
  email?: string;
  program?: string;
  message?: string;
  locale?: string;
  // Honeypot: real users never see or fill this. Bots that auto-fill all
  // fields will populate it, letting us silently drop the submission.
  company?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

// Basic in-memory rate limit: max 3 submissions per IP per 10 minutes.
// Note: serverless instances are ephemeral, so this is a soft guard against
// casual abuse, not a hard limit. Pair with the honeypot above.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Auto-reply copy, per locale.
const AUTOREPLY = {
  ja: {
    subject: "【RaJA International】お問い合わせを受け付けました",
    body: (name: string, program: string, message: string) => `
      <p>${esc(name)} 様</p>
      <p>この度はお問い合わせいただき、誠にありがとうございます。<br />
      以下の内容で受け付けいたしました。担当者より追ってご連絡いたします。</p>
      <hr />
      <p><strong>ご興味のあるプログラム：</strong> ${esc(program)}</p>
      <p><strong>お問い合わせ内容：</strong></p>
      <p style="white-space:pre-wrap">${esc(message)}</p>
      <hr />
      <p>RaJA International<br />
      〒890-0051 鹿児島県鹿児島市高麗町40-39<br />
      TEL +81 99-204-7730</p>
      <p style="color:#888;font-size:12px">※このメールは自動送信です。ご返信いただけます。</p>
    `,
  },
  en: {
    subject: "We received your inquiry — RaJA International",
    body: (name: string, program: string, message: string) => `
      <p>Dear ${esc(name)},</p>
      <p>Thank you for reaching out to RaJA International.<br />
      We've received your inquiry below and a member of our team will be in touch soon.</p>
      <hr />
      <p><strong>Program of interest:</strong> ${esc(program)}</p>
      <p><strong>Your message:</strong></p>
      <p style="white-space:pre-wrap">${esc(message)}</p>
      <hr />
      <p>RaJA International<br />
      40-39 Korai-cho, Kagoshima City, Kagoshima, JAPAN 890-0051<br />
      TEL +81 99-204-7730</p>
      <p style="color:#888;font-size:12px">This is an automated confirmation — you can reply to it directly.</p>
    `,
  },
} as const;

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot tripped → pretend success, send nothing.
  if (body.company && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const program = body.program?.trim() ?? "—";
  const message = body.message?.trim() ?? "";
  const locale = body.locale === "ja" ? "ja" : "en";

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  const resend = new Resend(key);

  // 1) Notify staff. This is the one that must succeed.
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `New inquiry — ${program} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nProgram: ${program}\n\n${message}`,
    html: `
      <h2>New website inquiry</h2>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Program:</strong> ${esc(program)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${esc(message)}</p>
    `,
  });

  if (error) {
    console.error("Resend error (staff notification):", error);
    return Response.json({ error: "Failed to send. Please try again." }, { status: 502 });
  }

  // 2) Confirmation auto-reply to the visitor. Best-effort: if this fails the
  // inquiry still succeeded, so we only log and don't fail the request.
  const copy = AUTOREPLY[locale];
  const ack = await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: COMPANY,
    subject: copy.subject,
    html: copy.body(name, program, message),
  });
  if (ack.error) {
    console.error("Resend error (auto-reply):", ack.error);
  }

  return Response.json({ ok: true, id: data?.id });
}
