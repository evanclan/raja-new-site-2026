# RUNBOOK — Migrate raja-international.com web to Netlify, keep email on Google Workspace

**Scope:** Point the website (apex + www) at Netlify. Leave email 100% untouched.
**Email at stake:** tech@, info@, **salliee@ (boss)** — all on Google Workspace. This runbook is designed so they physically cannot break if you follow it.
**You will edit exactly TWO DNS records. Nothing else.**

---

## 1. The one rule that keeps email safe

**Email and the website are completely separate systems that happen to share a domain name.**

- **Incoming mail** to tech@/info@/salliee@ is delivered using the **MX record**, which points to **Google Workspace** (`aspmx.l.google.com`). Senders worldwide look up **MX**, never the website's **A** record, to deliver mail.
- **Outgoing transactional mail** (the contact form, `inquiry@info.raja-international.com` via Resend/AWS SES) is authenticated by records on the **`info` subdomain** — its own DKIM, SPF, and MX. None of these depend on the apex A record.
- **The website** is what the **A record** controls. Changing the A record moves where `https://raja-international.com` loads from — and nothing else.

> **An A record is NEVER consulted to deliver or authenticate email.** This is why repointing the apex A and www A to Netlify cannot break mail.

**THE ONE RULE:** You only ever edit **apex `A`** and **`www A`**. If you touch nothing else, email cannot break. You still verify it afterward (Section 5) because the real risk is a slip of the hand in the panel, not the plan.

---

## 2. Records you must NEVER touch

Leave every row below **byte-for-byte identical**. Do not "tidy up," reorder, re-type, or delete any of them.

| Record name | Type | Current value (must stay exactly this) | Why it matters |
|---|---|---|---|
| `raja-international.com` | **MX** | `1 ASPMX.L.GOOGLE.com`, `5 ALT1.ASPMX.L.GOOGLE.com`, `5 ALT2.ASPMX.L.GOOGLE.com`, `10 ALT3.ASPMX.L.GOOGLE.com` | **Inbound mail for all 3 users.** Losing this = boss's mailbox dies. |
| `raja-international.com` | TXT (SPF) | `v=spf1 +a:sv2145.xserver.jp +a:raja-international.com +mx include:spf.sender.xserver.jp ~all` | Outbound authorization. Leave as-is (SPF hygiene edit is optional — Section 7). |
| `raja-international.com` | TXT | `google-site-verification=AlemLzKwgKElH-QpuXjHDJcs2D2G5Gbqet3ZJrl7VTY` | Google Workspace ownership proof. |
| `send.info.raja-international.com` | **MX** | `10 feedback-smtp.ap-northeast-1.amazonses.com` | Resend/SES bounce + feedback path. |
| `send.info.raja-international.com` | TXT (SPF) | `v=spf1 include:amazonses.com ~all` | Resend/SES outbound SPF. |
| `resend._domainkey.info.raja-international.com` | TXT (DKIM) | (the existing Resend/SES DKIM key) | Signs the contact-form mail. |
| `info.raja-international.com` | A | `183.90.242.46` | Parked subdomain. **Not part of mail** — but leave it alone anyway. |

**Records you WILL change (only these two):**

| Record name | Type | From | To |
|---|---|---|---|
| `raja-international.com` (apex, host = blank) | A | `183.90.242.46` | **`75.2.60.5`** |
| `www.raja-international.com` | A | `183.90.242.46` | **`75.2.60.5`** |

> ⚠️ **Do NOT add any AAAA record.** Netlify's external-DNS path has no IPv6 target; a stray AAAA is a documented cause of TLS certificate failures. You have none today — keep it that way.

---

## 3. Pre-flight (do this in the days BEFORE the public change)

Nothing in this section changes what the public sees. It is all safe.

### 3.1 — T-minus 24–48h: lower the TTL on the two A records

This makes rollback fast (≈5 min instead of ≈1 hour). It only affects the website records, never mail.

1. XServer **Server Panel (サーバーパネル)** → **DNSレコード設定** → select `raja-international.com`.
2. On the **apex `A`** row and the **`www A`** row, click **編集 (Edit)** and set **TTL = `300`**. **Leave the IP at `183.90.242.46` for now.** Save each via **確認画面へ進む** → **設定を変更する**.
3. **Wait at least 1 hour** (the old TTL was 3600s) so resolvers pick up the new 300s value.
4. Confirm the low TTL is live before you ever touch the IP:

```bash
dig +nocmd raja-international.com A @8.8.8.8 +noall +answer
dig +nocmd www.raja-international.com A @8.8.8.8 +noall +answer
# Expect: TTL column ~300 (counting down), IP STILL 183.90.242.46
```

**STOP gate:** Do not proceed until both show TTL ≤ 300. If they still show ~3600, wait longer.

### 3.2 — Add the custom domain in Netlify (must happen BEFORE the DNS cutover)

Netlify needs the domain attached so its certificate retry loop is already running when DNS flips.

1. Site dashboard → **Domain management** → **Add a domain** → **Add a domain you already own** → enter `raja-international.com`.
2. Netlify detects it is not on Netlify DNS → choose **Use external DNS**. **Do NOT pick "Set up Netlify DNS"** (that would try to move your nameservers — exactly what you must not do).
3. Set **primary domain = apex** (`raja-international.com`). Add **`www` as a domain alias**. Netlify then auto-issues the `www → non-www` 301 (matches your current behavior). No `_redirects` rule needed.
4. Confirm Netlify's current apex IP is still **`75.2.60.5`** (Domain settings will show it). Optionally cross-check your site's load balancer:

```bash
dig +short <your-site-name>.netlify.app
```

### 3.3 — Dry-run the real domain on YOUR machine only (via /etc/hosts)

This loads the production hostname against Netlify, completes the real TLS handshake, and lets you submit the contact form — all before the public sees any change. `dig` ignores `/etc/hosts`, so use `curl`/`ping`/browser to test.

Edit the hosts file:

```bash
sudo nano /etc/hosts
```

Add exactly these two lines:

```
75.2.60.5   raja-international.com
75.2.60.5   www.raja-international.com
```

Flush macOS DNS cache:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

Verify the override is active and test the new site:

```bash
ping -c1 raja-international.com                                   # must hit 75.2.60.5
curl -sI https://raja-international.com | head -n1                # expect HTTP/2 200
curl -sI https://www.raja-international.com | grep -i location    # expect 301 -> https://raja-international.com/
curl -svo /dev/null https://raja-international.com 2>&1 | grep -i issuer   # expect Let's Encrypt
```

**Verify before going public (all must be green):**
- [ ] `https://raja-international.com` returns **200** and renders the Next.js 16 site.
- [ ] TLS cert: subject = `raja-international.com`, issuer = **Let's Encrypt**, **no browser warning**.
- [ ] `https://www.raja-international.com` → **301** → `https://raja-international.com`.
- [ ] **Submit the contact form for real.** Confirm it arrives at **info@** (Google Workspace) **and** the gmail. This proves Resend + the `send.info`/DKIM records work while pointed at Netlify.

**Revert /etc/hosts before going public** (otherwise you're testing blind):

```bash
sudo nano /etc/hosts        # delete the two lines you added
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
ping -c1 raja-international.com   # MUST go back to 183.90.242.46
```

**STOP gate:** Confirm you are back on `183.90.242.46` before touching the public panel.

---

## 4. Cutover — the actual change

Pick a **low-traffic window (Japan late night)**. Have a Google Workspace tab open in another window.

### 4.1 — Capture the BEFORE state (your source of truth for rollback)

```bash
dig +noall +answer raja-international.com A   @ns1.xserver.jp
dig +noall +answer www.raja-international.com A @ns1.xserver.jp
dig +short MX  raja-international.com                         @8.8.8.8 | sort > /tmp/mx_before.txt
dig +short TXT raja-international.com                         @8.8.8.8 > /tmp/txt_before.txt
dig +short MX  send.info.raja-international.com               @8.8.8.8 > /tmp/sendmx_before.txt
dig +short TXT send.info.raja-international.com               @8.8.8.8 > /tmp/sendtxt_before.txt
dig +short TXT resend._domainkey.info.raja-international.com  @8.8.8.8 > /tmp/dkim_before.txt
```

### 4.2 — Change the two records (lowest blast radius first)

In **Server Panel → DNSレコード設定 → raja-international.com**:

1. **`www A` first.** Click **編集 (Edit)** on the `www.raja-international.com … A` row → change 内容 (content) from `183.90.242.46` to **`75.2.60.5`** → **確認画面へ進む (Proceed to confirmation)** → **設定を変更する (Apply)**.
2. Confirm www at the authoritative server immediately:
   ```bash
   dig +short www.raja-international.com A @ns1.xserver.jp   # expect 75.2.60.5 instantly
   ```
3. **Apex `A` next.** Click **編集 (Edit)** on the `raja-international.com … A` row (host = blank / 空白) → change 内容 from `183.90.242.46` to **`75.2.60.5`** → **確認画面へ進む** → **設定を変更する**.

> ⚠️ **DO NOT:** change nameservers (ネームサーバー設定), delete the domain (ドメイン設定 → 削除), run domain reset (ドメインの初期化), or edit any MX/TXT row. The only screen you touch is **DNSレコード設定**, and only those two A rows.

> **Why www first:** smaller blast radius. If the panel behaves unexpectedly on the first save, you catch it before touching the apex.

---

## 5. Verify after cutover

### 5.1 — Website resolves to Netlify

```bash
# Authoritative (instant — confirms the panel saved):
for ns in ns1 ns2 ns3 ns4 ns5; do echo "== $ns =="; dig +short raja-international.com A @$ns.xserver.jp; done
# All five must return 75.2.60.5

# Public resolvers (flip within ~5 min at TTL 300):
dig +short raja-international.com A @8.8.8.8
dig +short raja-international.com A @1.1.1.1
```

### 5.2 — Site + SSL healthy on real DNS (no hosts file)

```bash
curl -sI https://raja-international.com | head -n1                 # HTTP/2 200
curl -sI https://www.raja-international.com | grep -i location     # 301 -> https://raja-international.com/
curl -svo /dev/null https://raja-international.com 2>&1 | grep -i issuer   # Let's Encrypt
```
Then load in a browser, hard-refresh, and submit the contact form once more on live DNS.

### 5.3 — EMAIL is byte-for-byte unchanged (the firing-risk check)

```bash
# MX — the one that matters most:
dig +short MX raja-international.com @8.8.8.8 | sort > /tmp/mx_after.txt
diff /tmp/mx_before.txt /tmp/mx_after.txt && echo "MX UNCHANGED — OK"
```

**Expected MX (and nothing else):**
```
1 aspmx.l.google.com.
5 alt1.aspmx.l.google.com.
5 alt2.aspmx.l.google.com.
10 alt3.aspmx.l.google.com.
```

> 🚨 **If the MX shows ANY `xserver.jp` host, or a Google host is missing — STOP and roll back immediately (Section 6).** That means XServer's panel auto-rewrote your mail zone. This is the single most important check in this runbook.

Diff the rest of the mail records too:

```bash
dig +short TXT raja-international.com                        @8.8.8.8 | diff /tmp/txt_before.txt - && echo "apex TXT OK"
dig +short MX  send.info.raja-international.com              @8.8.8.8 | diff /tmp/sendmx_before.txt - && echo "send.info MX OK"
dig +short TXT send.info.raja-international.com              @8.8.8.8 | diff /tmp/sendtxt_before.txt - && echo "send.info TXT OK"
dig +short TXT resend._domainkey.info.raja-international.com @8.8.8.8 | diff /tmp/dkim_before.txt - && echo "DKIM OK"
```

### 5.4 — Real send/receive mail tests

Do all four. Confirm with the users for tech@ and salliee@.

1. **TO info@** — from your gmail, send to `info@raja-international.com` → confirm it lands in Google Workspace.
2. **TO salliee@** — send a test to `salliee@raja-international.com` → **confirm with the boss it arrived** (this is the account that gets you fired).
3. **TO tech@** — send a test → confirm receipt.
4. **Contact form** — submit on the live site → confirm Resend delivers to info@ + gmail.

**Header check:** open a received test in Gmail → **Show original** → confirm **SPF: PASS** and **DKIM: PASS**. Since no record changed, this is a regression check, not a fix.

---

## 6. Rollback

**Roll back immediately if ANY of these is true after cutover:**
- `dig +short MX raja-international.com @8.8.8.8` differs from `/tmp/mx_before.txt` (a mail record was touched) — **highest priority**.
- A test to/from **info@, tech@, or salliee@** bounces or stops arriving.
- `https://raja-international.com` returns 5xx / connection refused / a TLS cert error for >5 min after propagation.
- `dig +short raja-international.com A @8.8.8.8` shows an IP that is neither `183.90.242.46` nor `75.2.60.5` (a typo).
- Boss or staff reports any of the above.

**Revert procedure (fast because TTL = 300):**

1. XServer → **DNSレコード設定** → set **apex `A`** and **`www A`** back to **`183.90.242.46`** (TTL stays 300). Save each via **確認画面へ進む**.
2. If an MX/TXT was accidentally altered, **restore it byte-for-byte from your `/tmp/*_before.txt` captures** (Section 4.1) — those are your source of truth.
3. Verify:
   ```bash
   for ns in ns1 ns2 ns3 ns4 ns5; do dig +short raja-international.com A @$ns.xserver.jp; done   # back to 183.90.242.46
   dig +short raja-international.com A @8.8.8.8
   dig +short MX raja-international.com @8.8.8.8 | sort | diff /tmp/mx_before.txt - && echo "MX restored"
   ```
4. Re-run all four mail tests + `curl -sI https://raja-international.com` to confirm the old site and email are healthy.
5. Only retry the cutover after root-causing the failure.

**Time to recover:** authoritative is instant; public ≈ 5 minutes thanks to the pre-lowered TTL.

---

## 7. Post-migration cleanup (later, done safely)

Do these **after** the cutover is stable — one change at a time, never during the cutover window.

**a) Raise the TTL back.** ~24–48h after a clean cutover, set apex `A` and `www A` TTL back to **`3600`** to reduce query load. (Leave the IP at `75.2.60.5`.)

**b) Decommission WordPress WITHOUT killing the DNS zone.**
- It is safe to **delete the WordPress install** (WordPress簡単インストール → delete the install, or remove files in `public_html`). No traffic reaches it once DNS points at Netlify, and this does **not** touch DNS or mail.
- 🚨 **NEVER** remove the domain from **ドメイン設定**, and **never** run **ドメインの初期化 (domain reset)**. Either one deletes the DNS zone — taking your **MX and all TXT records with it**. The domain entry must stay added, with nameservers at XServer, so the zone (Google MX, all TXT, Resend records) keeps being served. WordPress can go; the domain entry cannot.

**c) Optional SPF hygiene edit.** The `+a:raja-international.com` token in the apex SPF is **not load-bearing for any sender** (Google is authorized via `+mx`, XServer via `+a:sv2145.xserver.jp` / `include:spf.sender.xserver.jp`). After the repoint it harmlessly authorizes Netlify's shared IP — a minor spoofing-surface widening, not a delivery issue. If you want it tidy, change the apex SPF to:
```
v=spf1 +a:sv2145.xserver.jp +mx include:spf.sender.xserver.jp ~all
```
This is hygiene only and **not required** for email to work. Do it as its own change, then re-verify mail.

**d) Optional: add a DMARC record.** There is currently **no DMARC** — a pre-existing weakness, unrelated to this migration. Once everything is stable, add as a new TXT record (monitor mode, no enforcement):
```
Name:  _dmarc.raja-international.com
Type:  TXT
Value: v=DMARC1; p=none; rua=mailto:eoalferez@gmail.com
```
Start at `p=none` to observe before tightening. Never add it during the cutover window.

---

## 8. Final pre-cutover CHECKLIST

Tick every box before you change the apex A in the panel.

- [ ] TTL on apex `A` and `www A` lowered to **300**, and `dig @8.8.8.8` confirms TTL ≤ 300 on both (still IP `183.90.242.46`).
- [ ] Custom domain added in **Netlify** via **Use external DNS**; **apex = primary**, **`www` = alias**; `www→non-www` 301 confirmed.
- [ ] Netlify shows apex target **`75.2.60.5`** (verified current).
- [ ] No AAAA record exists on apex or www (and you will not add one).
- [ ] **/etc/hosts dry run passed**: site 200, Let's Encrypt cert valid, `www`→non-www 301, contact form delivered to info@ + gmail.
- [ ] **/etc/hosts reverted**; `ping` confirms back on `183.90.242.46`.
- [ ] BEFORE snapshots captured to `/tmp/*_before.txt` (MX, apex TXT, send.info MX+TXT, DKIM) and authoritative A records noted.
- [ ] Rollback value recorded and visible: **apex A & www A = `183.90.242.46`, TTL 300**.
- [ ] Low-traffic window (Japan late night) chosen; Google Workspace test tab open.
- [ ] You know **THE ONE RULE**: edit only apex `A` and `www A` → `75.2.60.5`. Touch nothing else. Never delete the domain or change nameservers.

---

**Reference values:**
- Netlify apex A target: **`75.2.60.5`** (re-confirm in Netlify Domain settings at cutover)
- Old IP (rollback): **`183.90.242.46`**
- Rollback snapshots: `/tmp/mx_before.txt`, `/tmp/txt_before.txt`, `/tmp/sendmx_before.txt`, `/tmp/sendtxt_before.txt`, `/tmp/dkim_before.txt`
- hosts file: `/etc/hosts`
