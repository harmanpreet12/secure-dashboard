🛡️ Secure User Profile Dashboard
A Node.js-based user dashboard that demonstrates secure input handling, encryption, and session management. This project is built for (Web Security Fundamentals) Phase 3 and includes protection against common web vulnerabilities like XSS and SQL Injection.
📁 1. Setup Instructions
🔃 Clone the Repository
git clone https://github.com/your-username/secure-dashboard.git
cd secure-dashboard
📦 Install Dependencies
Make sure you have Node.js and npm installed. Then run:
npm install
⚙️ Environment Setup
Create a .env file in the root directory with the following content:
SESSION_SECRET=yourStrongSecretKey
▶️ Run the Application
node server.js
Then open your browser and go to:
http://localhost:3000
🔐 2. Input Validation Techniques
We use express-validator to validate and sanitize user inputs on the /profile/update route. Key rules include:

name: Must be 3–50 characters long, letters/spaces only

email: Must be a valid email format

bio: Must be under 500 characters and contain only safe punctuation

🧼 3. Output Encoding Methods
Output encoding is handled via EJS templating. Data is injected into views using <%= %>, which automatically escapes characters like <, >, and " to prevent XSS when displaying.
🔐 4. Encryption Techniques
We use the built-in crypto module with AES-256-CBC to encrypt and decrypt sensitive data stored in the session.
All emails and bios are encrypted before saving to the session and decrypted only when rendering the dashboard.
📚 5. Third-Party Libraries & Dependency Management
Main dependencies listed in package.json:

express: Web framework

express-session: Session handling

express-validator: Input validation/sanitization

ejs: Templating engine

dotenv: Environment variable support

crypto: Node.js built-in encryption

Install and manage all dependencies using:
npm install

🔒 Part B: Design a Secure User Profile Update Form


🧠Part B Reflection:

What types of vulnerabilities can arise from improper input validation?
Improper validation can lead to attacks like cross-site scripting (XSS), command injection, or database injection. Without validating and sanitizing user input, attackers can store malicious code that runs when others view the content.

How does output encoding prevent XSS attacks?
Output encoding ensures that any HTML or JavaScript-like content from user input is displayed as plain text, not executed by the browser. Templating engines like EJS automatically escape characters like <, >, and " to prevent script execution.

What challenges did you encounter with encryption, and how did you resolve them?
One challenge was choosing a secure encryption method for session storage. I used AES-256-CBC with an initialization vector (IV) and a secret key. It was tricky to handle both encryption and decryption while maintaining data format and avoiding padding errors, but careful use of crypto.createCipheriv() and createDecipheriv() resolved it.

🧠 Part C Reflection : 
Why is it risky to use outdated third-party libraries?
Outdated libraries may contain known security vulnerabilities that attackers can exploit. Using them can expose your application to security breaches, data loss, or unauthorized access. Additionally, older versions might lack important bug fixes and performance improvements.

How does automation help with dependency management?
Automation tools like GitHub Actions can regularly check your dependencies for vulnerabilities without manual effort. This ensures you are notified promptly about security issues and can update dependencies quickly, reducing the window of exposure.

What risks does automation have?
Automated updates may sometimes introduce breaking changes or bugs if dependencies are updated without thorough testing. Relying solely on automation without review can cause stability issues. Also, automation tools might miss certain context-specific security risks.

🧠 Reflection: Part D
Which vulnerabilities were most challenging to address?
The most challenging vulnerability to address was Cross-Site Scripting (XSS). It required carefully validating and sanitizing all user inputs, especially the bio and name fields, to ensure no HTML or JavaScript could be injected. Handling XSS was tricky because even simple mistakes like missing one unsafe character (<, >, etc.) could lead to the execution of malicious scripts. Ensuring the application both blocked dangerous input and displayed user input safely was key.

What additional testing tools or strategies could improve the process?
To improve testing and catch hidden vulnerabilities, tools like OWASP ZAP, Burp Suite, and Postman can be very helpful. These allow automated scanning and manual input manipulation to simulate real attack scenarios. Adding unit tests for input validation logic and using Content Security Policy (CSP) headers would further strengthen the app against XSS. Additionally, setting up automated test scripts with GitHub Actions to simulate and catch security flaws during development would enhance ongoing protection.

| Field | Input to Test                      | Expected Result                 |
| ----- | ---------------------------------- | ------------------------------- |
| Name  | `<img src=x onerror=alert('XSS')>` | ❌ Rejected (invalid characters) |
| Email | `abc@site.com`                     | ✅ Accepted                      |
| Email | `abc@site` or `' OR 1=1 --`        | ❌ Rejected (invalid email)      |
| Bio   | `<script>alert('hacked')</script>` | ❌ Rejected (invalid characters) |
| Bio   | `Hi there! I'm a student.`         | ✅ Accepted                      |

💡 Lessons Learned
🔍 Challenges Faced:
XSS prevention: It was difficult to ensure all user inputs were safe to render. Proper sanitization and using EJS encoding helped fix this.

Email validation: Invalid or manipulated inputs caused form errors and security concerns.

Session data encryption: Implementing AES encryption required careful handling of keys and IVs to avoid data loss or crashes.

✅ Solutions:
Used express-validator for robust input validation

Handled errors gracefully and displayed them in the UI

Applied encryption only to sensitive data (email, bio), not the whole session

Tested with fake XSS payloads like <script>alert(1)</script> to confirm input/output safety
