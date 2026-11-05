<div style="display: flex; justify-content: space-between; align-items: center;">
  <h2>Frigus Fiesta Main-Website</h2>
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-production-brightgreen" /> -->
  <img alt="Status" src="https://img.shields.io/badge/status-under--development-orange" />
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-production--in--progress-yellow" /> -->
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-beta-blue" /> -->
</div>

## Frigus Fiesta – Event Management Platform

Frigus Fiesta is a full-featured event management platform designed to simplify the planning, hosting, and attending of events. From showcasing upcoming and past events to offering real-time booking, admin scheduling, and user reviews, it delivers a seamless end-to-end experience.

<div style="flex: 1; min-width: 250px;">
    <h3>Built With</h3>
    <p>
      <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
      <img alt="NextJS" src="https://img.shields.io/badge/-NextJS-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
      <img alt="Bun" src="https://img.shields.io/badge/-Bun.js-000000?style=flat-square&logo=bun&logoColor=white" />
      <img alt="TailwindCSS" src="https://img.shields.io/badge/-Tailwind CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
      <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=Cloudflare&logoColor=white" />
      <img alt="git" src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" />
      <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
      <img alt="Razorpay" src="https://img.shields.io/badge/Razorpay-02042B?style=flat-square&logo=razorpay&logoColor=white" />
      <img alt="Google OAuth" src="https://img.shields.io/badge/Google%20OAuth-via%20GCP-4285F4?style=flat-square&logo=google&logoColor=white" />
      <img alt="Supabase Auth" src="https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
      <img alt="Mailtrap" src="https://img.shields.io/badge/Mailtrap-Email%20Services-5A4FCF?style=flat-square&logo=mailtrap&logoColor=white" />
      <img alt="PayPal" src="https://img.shields.io/badge/PayPal-Payments-00457C?style=flat-square&logo=paypal&logoColor=white" />
      <img alt="Redis" src="https://img.shields.io/badge/Redis-InMemory%20Store-DC382D?style=flat-square&logo=redis&logoColor=white" />
    </p>

  </div>
</div>

## Developed and Maintained by **Team Electroplix** under an agreement

<br>

## Key Features
- 🗓 **Event Listings**: Explore detailed pages for each event with descriptions, media galleries, and attendee reviews  
- 🔐 **Admin Portal**: Easily manage, schedule, and update upcoming events through a secure admin dashboard  
- 💬 **User Reviews**: Share thoughts and feedback directly on event pages  
- 🎟 **Ticket Booking**: Reserve spots for upcoming events with real-time confirmation  
- 📅 **Host Booking**: Event organizers can book appointments to host their own experiences  
- 📧 **Bulk & Confirmation Emails**: Integrated email services for announcements and confirmations  
- 💳 **Payment Gateway Support**: Multiple domestic and international payment options for seamless transactions  
- 🤖 **AI Chatbot**: Real-time support and queries through an intelligent chatbot assistant  
- 🖼 **Gallery & Animations**: A vibrant gallery and smooth animations to capture the event atmosphere  

Frigus Fiesta is your all-in-one solution for seamless celebration planning, ticketing, and hosting.

## Getting Started

First, run the development server:

```bash
bun run dev
```
If bun is not installed 
<br>
For Windows
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```
For Mac
```bash
npm install bun -g
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Working Guidelines

## 1. Branching Strategy
Start from dev branch: When starting any work, always create your branch from the dev branch.
Branch naming convention:
* For new features: feat/feature-name
* For bug fixes: fix/whatyouarefixing
* For updating content: update/whereyouareupdating
* For documentation updates: docs/whatyouupdated
* For refactoring code: refactor/whatyourefactored
* For urgent hotfixes: hotfix/urgentfix

## 2. Pull Request (PR) Workflow
### Step 1: Development
After completing your task, push your changes and create a PR to merge your branch into the dev branch.
Provide a clear description of the changes in the PR.
### Step 2: Testing
Test your code locally before creating a Pull Request merge with the main.
```
bun run deploy
```
# For Windows systems use wsl
```
wsl --install
wsl --install -d Ubuntu-22.04
sudo apt update
sudo apt full-upgrade -y
sudo apt install curl
sudo apt install unzip
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```
**Verify Installation**
```
bun --version
```
**Now test the deployment locally**
```
bun run deploy
```

### Step 3: Production
After successful testing, create a PR from the test branch to the main branch.
## 3. Commit Message Guidelines
Use the following prefixes for clear and consistent commit messages:

```
feat: for new features.
fix: for bug fixes.
docs: for documentation updates.
refactor: for code refactoring.
style: for formatting and style changes (not affecting code logic).
test: for adding or updating tests.
chore: for maintenance tasks.
```
```
Example: feat: add user authentication to login page.
```
## 4. CI/CD Pipeline Requirements
The CI/CD pipeline must run error-free.
Both ESLint checks and Next.js build must pass successfully for the PR to be valid.
## 5. Conflict Resolution
If any merge conflicts arise, contributors should immediately contact CTO for resolution.
## 6. PR Review Time
All PRs should be reviewed and resolved within 5 days of submission.

### Deployed on CloudFlare
Frigus Fiesta is deployed on Cloudflare for enhanced speed, security, and scalability.

