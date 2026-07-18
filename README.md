# 🛡️ Sentinel AI

> An AI-powered cybersecurity assistant that helps detect, analyze, and respond to cyber threats using natural language.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-Web%20App-red)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📖 Overview

Sentinel AI is an intelligent cybersecurity assistant that combines AI with specialized security tools to simplify cyber threat analysis. Instead of using multiple security platforms, users can interact with Sentinel AI through natural language to investigate phishing emails, scan malicious URLs, retrieve vulnerability information, generate incident reports, and perform various cybersecurity tasks—all from a single interface.

Whether you're a security professional, student, or IT administrator, Sentinel AI makes cybersecurity investigations faster, easier, and more accessible.

---

# ✨ Features

### 📧 Phishing Email Analysis
- Detects phishing attempts and social engineering tactics
- Identifies domain impersonation
- Checks SPF, DKIM, and DMARC authentication
- Assigns risk scores
- Suggests mitigation steps

---

### 🌐 URL Threat Scanner
- Detects malicious and phishing URLs
- Identifies fake domains and typosquatting
- Checks HTTPS usage
- Evaluates URL reputation
- Provides threat explanations

---

### 🛡️ CVE Intelligence Lookup
- Search vulnerabilities using CVE IDs
- View CVSS scores
- Identify affected software
- View mitigation recommendations
- Understand severity and impact

---

### 📄 Executive Incident Report Generator
Generate professional incident reports containing:

- Executive Summary
- Timeline
- Threat Analysis
- Risk Assessment
- Recommended Actions

Perfect for SOC analysts and security teams.

---

### 💬 AI Security Assistant

Interact using natural language such as:

```
Analyze this email for phishing

Scan this URL

Look up CVE-2024-1234

Generate an incident report
```

No complicated commands required.

---

## 🎯 Who is Sentinel AI For?

Sentinel AI is built for:

- 🔐 Cybersecurity Professionals
- 🛡️ SOC Analysts
- 💻 IT Administrators
- 🎓 Students learning Cybersecurity
- 🧪 Security Researchers
- 🏢 Organizations looking to automate threat analysis

---

# 🚀 What Makes Sentinel AI Special?

Unlike traditional cybersecurity solutions that require multiple tools, Sentinel AI combines several security capabilities into one intelligent AI assistant.

### Traditional Workflow

Email Scanner

↓

URL Scanner

↓

CVE Database

↓

Threat Intelligence

↓

Report Generator

↓

Manual Analysis

---

### Sentinel AI Workflow

User Prompt

↓

Sentinel AI

↓

Automated Threat Analysis

↓

Comprehensive Results

Everything happens from one conversation.

---

# 🖥️ Tech Stack

- Python
- Streamlit
- OpenAI GPT
- MCP (Model Context Protocol)
- REST APIs
- HTML/CSS
- JavaScript

---

# 📂 Project Structure

```
Sentinel_AI/
│
├── app.py
├── pages/
├── tools/
├── widgets/
├── assets/
├── utils/
├── requirements.txt
├── README.md
└── .env
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Parth-Singhh/Sentinel_AI.git
```

Move into the project

```bash
cd Sentinel_AI
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file and add your API keys.

Example:

```env
OPENAI_API_KEY=your_key_here
```

Run the application

```bash
streamlit run app.py
```

---

# 📌 How to Use

## 1️⃣ Analyze a Phishing Email

Simply ask:

```
Analyze this email for phishing:

From: ...

Subject: ...

Body: ...
```

Sentinel AI will:

- Detect phishing indicators
- Calculate risk score
- Explain suspicious behavior
- Recommend mitigation

---

## 2️⃣ Scan a URL

Prompt:

```
Scan this URL

https://example.com
```

The assistant checks:

- Domain reputation
- HTTPS
- Phishing indicators
- Suspicious keywords
- Overall safety

---

## 3️⃣ Lookup a CVE

Example:

```
Look up CVE-2024-1234
```

Returns:

- Description
- CVSS Score
- Severity
- Affected Software
- Mitigation

---

## 4️⃣ Generate an Incident Report

Example:

```
Generate an executive incident report combining:

• Email Analysis

• URL Scan

• CVE Information
```

Produces a complete executive report ready for security teams.

---

# 💡 Example Prompts

```
Analyze this email

Scan this URL

Explain why this email is suspicious

Is this website safe?

Lookup CVE-2024-1234

Generate an executive incident report

Summarize this threat

Recommend mitigation steps
```

---

# 🔒 Security Features

- Phishing Detection
- URL Reputation Analysis
- Domain Impersonation Detection
- Threat Correlation
- Vulnerability Intelligence
- Risk Scoring
- Incident Reporting

---

# 🌟 Future Improvements

- Malware File Analysis
- VirusTotal Integration
- IOC Search
- SIEM Integration
- Threat Intelligence Feeds
- Real-Time Monitoring Dashboard
- Network Traffic Analysis
- Log Analysis
- Automated Playbooks
- Security Awareness Chatbot

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Parth Singh**

B.Tech CSE (Cybersecurity)

Amrita Vishwa Vidyapeetham

GitHub: https://github.com/Parth-Singhh

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
