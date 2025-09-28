---
title: "API Testing Deep Dive (REST & SOAP)"
publishDate: 2025-09-27 08:00:00
description: "Complete guide to REST & SOAP API testing."
tags:
  - API Testing
  - PortSwigger
  - Web Security
heroImage:
  src: './api-thumbnail.jpg'
  color: '#FF6F3C'
language: 'English'
---

<div style="text-align: justify;">

APIs (Application Programming Interfaces) enable software systems to communicate, but they also expand the attack surface. API testing focuses on discovering endpoints, understanding request/response formats, and probing for weaknesses. Vulnerabilities in APIs can undermine a system’s confidentiality, integrity and availability. OWASP’s API Security Top 10 (2023) highlights issues like broken object-level authorization, broken authentication, SSRF (Server-Side Request Forgery) and security misconfiguration as top risks. This guide covers both modern REST/JSON APIs and classic SOAP/XML APIs from a mid-to-advanced AppSec perspective, integrating key points and a built-in “cheat sheet” of test ideas.

## Reconnaissance and Documentation

Effective API testing begins with reconnaissance: find all exposed endpoints and docs. Start by crawling the application or reviewing its JavaScript/code for URLs containing `/api/` or similar patterns.

Common entry points include `/api`, `/swagger` or `/openapi.json`, which often return API documentation. For example, in one PortSwigger lab simply sending a GET request to `/api/` revealed the full Swagger doc (listing GET, DELETE, PATCH endpoints) for user accounts. Use tools like Burp Suite’s crawler, Content Discovery, or JS Link Finder to enumerate hidden APIs. If machine-readable docs are found (JSON/YAML), tools like the OpenAPI Parser, Postman or SoapUI can import them to generate test requests. In SOAP scenarios, look for WSDL endpoints (e.g. `?wsdl`) and review the WSDL file to discover services, methods and data schemas.

**Endpoints & Docs:** Search for `/api` or `/soap` patterns and common paths (e.g. `/api`, `/swagger`, `/api-docs`, `/v1/users`), and use Burp Spider or automated tools to crawl. If you find a URL for one resource (e.g. `/api/user/wiener`), try trimming it (e.g. to `/api/`) to locate base documentation.

**API Documentation:** Always check for open docs. If accessible, export or view Swagger/OpenAPI or WSDL. Public docs can expose functionality that isn’t used by the front end. If docs are absent, use Intruder with wordlists to fuzz for endpoints (e.g. try common words like `delete`, `add` in the path). Tools like Postman or SoapUI are invaluable for constructing and replaying API requests once you know the schema.

## Interacting with Endpoints (Methods, Content-Types)

Once endpoints are identified, interact with each to map behavior. Try every HTTP method (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`, `OPTIONS`) on each endpoint. Use Burp Repeater or similar: change the method and observe responses. For example, if `/api/tasks` returns a list on `GET`, try a `POST` or `DELETE` on the same path. Enabling `OPTIONS` requests can reveal supported methods: PortSwigger labs often show that hidden endpoints accept `PATCH` or `DELETE` methods not obvious from the UI.

Also vary the `Content-Type` header and request body format. An API may behave very differently to JSON vs. XML input. Changing the content type might trigger errors or bypass filters. For instance, setting `Content-Type: application/json` and adding an empty JSON body may elicit a `400` or `500` error that leaks parameter names. In one lab, a `PATCH` to `/api/products/1/price` first returned “missing price” errors; adding `"price":0` in JSON changed a product’s price to `0`, effectively bypassing intended logic. Always test with missing/extra parameters, invalid JSON/XML, and different media types to uncover such behaviors.

**Tips**
- Test all methods: cycle through `GET`, `POST`, `PUT`/`PATCH`, `DELETE`, `OPTIONS` on each endpoint. Burp Intruder’s built-in HTTP verb list can automate method fuzzing.
- Alter content types: modify `Content-Type` (JSON, XML, form-data) and reformat the body. A JSON endpoint might accept the same data as XML or vice versa. Some APIs validate JSON safely but mishandle XML, leading to injection opportunities.
- Error messages: closely examine responses and error details. Detailed errors often reveal valid field names or logic (for example, “missing price” tells you exactly which param is required). Use any leaked info to craft further requests.

## Hidden Endpoints and Parameters

APIs often have hidden functionality not exposed in the frontend. Use the endpoints you know as templates to find others. For example, if `/api/user/update` exists, Intruder can substitute words like `delete` or `add` in place of `/update` to find similar endpoints. Also inspect any responses for unused fields. A hidden endpoint or parameter might appear in an API’s schema or data dump.

**Hidden endpoints:** Run Intruder on known paths to replace segments (e.g. `/user/update` ⇒ `/user/delete`). Also review JavaScript or mobile app code for API references.

**Param mining:** Use tools like Burp’s Content Discovery or Param Miner to guess undocumented parameters (names) that the API might accept. For example, if you see in a GET response `{"isAdmin": false}`, try adding `isAdmin` to a subsequent `POST`/`PATCH` to see if you can change it.

A classic hidden-parameter issue is mass assignment. Many frameworks auto-bind JSON/XML fields to internal objects. Suppose the API’s `PUT`/`PATCH` `/api/users/{id}` normally lets you update email. If the GET response also includes `"isAdmin": "false"`, it suggests `isAdmin` is a hidden property. You can test adding `"isAdmin": true` in a `PATCH` – if the app accepts it, you’ve escalated privileges. (PortSwigger’s lab 3, for instance, involved adding a hidden `choose_discount` field to a checkout request to exploit a mass-assignment bug.)

## Authentication & Access Control

APIs must enforce authentication and per-resource authorization. Broken object-level authorization (IDOR) is a top API risk. Test by modifying IDs or usernames in URLs and in request bodies to access or modify other users’ data. Also check broken function-level authorization (calling admin functions as a normal user). Use different user roles/accounts to confirm restrictions. For example, attempt admin-only actions (delete user, change prices, etc.) using a low-privilege account’s token; or try replaying a normal user’s token on admin endpoints.

**Role testing:** Log in as a normal user, then try accessing admin endpoints (e.g. `/api/admin/*`). Conversely, if you have admin creds, see if admin endpoints have weak checks (sometimes an “admin” token is accepted even when an `isAdmin` flag is missing or manipulated).

**JWT/Session tokens:** If the API uses JWT or cookies, inspect them. Check for unverified JWT algorithms (`alg:none`) or replay other users’ tokens. Verify session timeout and token scopes.

**Expiry and replay:** Try replaying previously valid requests, or altering timestamps and signatures in tokens. Also test logout and token revocation.

## Parameter Tampering and Injection

APIs can be vulnerable to parameter pollution and injection attacks. A notable class is Server-Side Parameter Pollution (SSPP). If an API call is made from the server using a user-supplied URL, an attacker can inject extra query parameters or fragment markers to alter the parsed request. For example, injecting `%26` (`&`) or `%23` (`#`) into a query string can create an unintended parameter or truncate the request. In one lab, entering `administrator%26field=reset_token%23` into a password-reset endpoint caused the backend to parse a new `field=reset_token` parameter and leak the admin’s reset token. Always test critical API endpoints by appending `&param=x` or `#param=x` (URL-encoded) and observe the server’s reaction.

Similarly, try path-based tampering. In a RESTful API, a clever input like `../../v1/users/administrator/field/passwordResetToken#` injected into a username field retrieved internal data because the server concatenated it into a REST path. This kind of SSRP via URL/path (including path traversal tricks) can expose sensitive fields. As a rule, fuzz any user-controlled input that might be inserted into a URL path or query string, checking for SSRF or traversal.

**SSRF (Server-Side Request Forgery):** If the API fetches remote resources, test for SSRF by supplying URLs pointing to internal services (e.g. `http://127.0.0.1/admin`) or using common SSRF payloads. OWASP highlights SSRF as a top API risk.

**Injection (SQL/NoSQL/XML):** APIs often feed user input into back-end databases or parsers. Test for SQL or NoSQL injection via API parameters (e.g. `id=1 OR 1=1`). For SOAP/XML APIs, also test XML injection/XXE (inserting `<!ENTITY>` payloads into XML bodies). Also try injecting control characters or script tags in JSON/XML fields to see if the server unsafely embeds input.

## REST vs SOAP Specifics

REST APIs typically use HTTP verbs and JSON (or XML) payloads. The focus is on endpoints and JSON fields as described above. SOAP APIs, however, use XML envelopes and have some special considerations. SOAP services are defined by WSDL files; once you fetch the WSDL, you can generate a list of operations and expected XML schemas. Use a tool like SoapUI or Burp’s WSDler to import the WSDL and craft SOAP requests. Key SOAP tests include:

- **WSDL/Service discovery:** Try appending `?wsdl` to service URLs, or browse to common SOAP endpoints. The WSDL itself may contain sensitive comments or default credentials.
- **XML structure:** Alter namespaces, modify or inject extra XML elements into the SOAP body. Check how the server handles unexpected XML structure or encoding.
- **SOAPAction header:** Many SOAP APIs rely on the `SOAPAction` HTTP header to route requests. Fuzz or omit this header to see if the API mistakenly processes or rejects the call.
- **XML injection/XXE:** Since SOAP uses XML, try classic XML attacks (XXE, entity expansion). For example, inserting `<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>` into a SOAP field may return file contents if XXE is not disabled.
- **WS-Security:** If the API uses WS-Security, test for issues like weak digest, missing signature validation, or replay of timestamps.

Overall, many REST techniques apply to SOAP (authentication checks, parameter tampering), but always pay attention to the XML nature and WSDL-defined fields.

### BOLA vs BOPLA vs Broken Function Level Authorization

When diving into API security, authorization issues are often the trickiest. Three risks from the OWASP API Security Top 10 — **API1:2023 (BOLA)**, **API3:2023 (BOPLA)**, and **API5:2023 (Broken Function Level Authorization)** — are related but distinct, and understanding them is key to a solid AppSec approach.

**BOLA (Broken Object Level Authorization, API1)** occurs when an API fails to check whether a user should access a specific object. For example, if `/api/orders/42` returns order data without verifying ownership, an attacker could simply change the ID to access someone else’s order. This is often the simplest to test: enumerate IDs, switch accounts, and see what leaks. Fixing it requires proper server-side ownership checks and object-level access control.

**BOPLA (Broken Object Property Level Authorization, API3)** is subtler. Here, the API correctly checks object ownership but misses field-level restrictions. Attackers can manipulate hidden or writable properties, like flipping `isAdmin` in a JSON payload, to escalate privileges or bypass business logic. Testing involves inspecting GET responses for extra fields and attempting to update them. Remediation involves strict property allowlists and using well-defined data schemas.

**Broken Function Level Authorization (API5)** happens when the API exposes sensitive operations to the wrong roles. Even if object and field checks are correct, endpoints meant for admins — like `/api/admin/rebuild-cache` — might be callable by normal users. Detecting this requires role testing and endpoint fuzzing. Proper role-based checks and denying access by default are essential fixes.

In short, **BOLA** asks *who can access this object*, **BOPLA** asks *which fields can be changed*, and **function-level authorization** asks *who can perform this action*. Combining all three checks ensures robust API security, preventing unauthorized data access, privilege escalation, and abuse of sensitive operations.

## API Testing Cheat Sheet (Checklist)

- **Endpoint Discovery:** Look for `/api`, `/v1`, `/soap`, `/wsdl` and similar URL patterns. Crawl the app and review JavaScript code for API calls.
- **Documentation Retrieval:** Try `/api`, `/openapi.json`, `/swagger/index.html` to fetch API docs. In SOAP, fetch WSDL. Analyze any machine-readable docs with tools (OpenAPI Parser, SoapUI).
- **Supported Methods:** Use `GET`, `POST`, `PUT`/`PATCH`, `DELETE`, `OPTIONS` on each endpoint. Check `OPTIONS` to list allowed methods, and use Intruder to brute verbs if needed.
- **Content Types:** Vary `Content-Type` (JSON, XML, form data). Convert between JSON/XML to test different parsing logic. Observe if `application/json` vs `text/xml` yields different results or errors.
- **Hidden Parameters:** Compare GET vs POST/PUT responses. If responses show fields (e.g. `isAdmin`, `id`, `choose_discount`) that aren’t in requests, try including them in your requests.
- **Mass Assignment:** Try adding sensitive fields (e.g. `"isAdmin": true`) to JSON or XML payloads. If the server binds them, you may escalate privileges or manipulate business logic.
- **Server-Side Parameter Pollution:** Inject `%26` (`&`) or `%23` (`#`) in query parameters or JSON values to add or remove params in backend requests. Also try path-based injections like `../../../` payloads in REST URLs.
- **Authentication/Authorization:** Test resource access using other users’ IDs or tokens (IDOR). Try common JWT attacks (`alg:none`, unverified signature) and check role-based access.
- **Injection Testing:** Attempt SQL/NoSQL injection in API parameters. For SOAP/XML, test XML injection and external entities. Also consider HTTP header injection if the API uses headers (e.g. Host, Referer) to fetch data.
- **Resource Limits:** Rapidly fire requests or use large payloads to test rate limiting and DoS defenses. Check if repetitive API calls (e.g. auto-purchasing flow) are throttled or if business limits (like credit checks) can be bypassed.
- **Misconfiguration Checks:** Look for default credentials, exposed debug endpoints, or overly permissive CORS on API endpoints. Ensure that sensitive API versions or old endpoints aren’t reachable.

By systematically following this checklist and leveraging the techniques above, you’ll cover most common API vulnerabilities. Each portswigger-style lab combines these elements: for example, one lab showed an attacker trimming a URL to get Swagger docs and then using a hidden DELETE endpoint to remove any user; another exploited parameter pollution via URL-encoded characters to steal an admin reset token. Keeping these tactics in mind helps ensure comprehensive coverage.

## Testing Tools and Practices

Use a mix of manual and automated tools. Burp Suite (Repeater, Intruder, Scanner) is central: it can crawl APIs, brute methods, inject parameters and automate scans. The OpenAPI Parser BApp can load swagger files. Postman or SoapUI are invaluable for composing and replaying REST/SOAP requests. For SOAP, Burp’s WS Dispatcher (Wsdler) can parse WSDL. Remember to work in a dev/test environment and have appropriate credentials. Always refresh the session or use new logins as needed during testing. Document each endpoint’s expected vs actual behavior.

## Conclusion

API testing demands a holistic approach: treat every endpoint as potential attack surface, and apply both standard web tests and API-specific checks. By combining thorough reconnaissance (endpoints, docs), active probing (methods, content types, injection), and business logic abuse (mass assignment, SSRF, resource limits), you can uncover critical flaws. The PortSwigger API labs and accompanying guides demonstrate these principles in action. Use the above checklist as a cheat sheet for future reference. In-depth API testing is a cornerstone of modern AppSec, and mastery of these techniques will greatly strengthen your security posture.

If you want the full, kitchen-sink writeups or the Python PoCs I used to automate extractions, you’ll find everything in my lab index and GitHub repo.
</div>

- [Official Portswigger Labs](https://portswigger.net/web-security/all-labs#api-testing)
- [My PortSwigger lab index(Writeups)](https://shubhamranpise.com/portswigger-labs)  
- [My exploit scripts(Exploits)](https://github.com/ShubhamNR007/portswigger-labs-exploits/tree/main/API)

---

— Shubham Ranpise

---
