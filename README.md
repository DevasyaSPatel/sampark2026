# Sampark 2026 - IEEE Student Branch

Welcome to the official web application for **Sampark 2026**, the biggest tech event of the year hosted by the IEEE Student Branch.

## 🚀 Features

-   **Modern UI/UX**: Built with Next.js and Tailwind CSS for a premium, responsive experience.
-   **User Registration**: Simple and secure registration flow.
-   **Admin Dashboard**: comprehensive dashboard to manage registrations (Approve/Reject/Edit users).
-   **Google Sheets Integration**: Uses Google Sheets as a database for easy data management.
-   **Email Notifications**: Automated emails via Nodemailer.
-   **Themes & Details**: Explore event themes and schedules.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: Google Sheets (via `googleapis`)
-   **Authentication**: Custom Admin Login (Environment Variable based)
-   **Email Service**: Nodemailer

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sampark2026.git
cd sampark2026
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=your_google_sheet_id

# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Admin Access
ADMIN_PASSWORD=your_secure_admin_password
```

> **Note**: For `GOOGLE_PRIVATE_KEY`, ensure you include the newlines (`\n`) exactly as provided in your JSON key file.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

### Vercel (Recommended)

1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com/) and create a new project.
3.  Import your repository.
4.  In the "Environment Variables" section, add all variables from your `.env.local` file.
5.  Click **Deploy**.

### Netlify

1.  Push your code to GitHub.
2.  Go to [Netlify](https://www.netlify.com/) and "New site from Git".
3.  Connect your repository.
4.  In "Site settings" > "Build & deploy" > "Environment", add your environment variables.
5.  Deploy the site.

## 📄 License

This project is licensed under the MIT License.
