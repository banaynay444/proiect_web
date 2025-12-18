📰 News Analyser Web Application – Visual User Guide
1️⃣ Opening the Application

Open your browser and go to:

http://localhost:3000


You will see the Login / Sign Up page.

2️⃣ Creating an Account

Click Sign Up.

Fill in the fields:

Field	Example
Email	example@domain.com

Password	your_secure_password

Click Sign Up.

You will be automatically redirected to the dashboard.

🔹 If you already have an account, go to Login and enter your email and password.

3️⃣ Dashboard – Creating a Project

On the dashboard, click Create New Project.

Fill in:

Field	Example
Project Name	Daily News Analysis
News URLs	https://example1.com
, https://example2.com

Click Create Project.

The app will:

Scrape the content of the articles

Send the content to Google Gemini AI

Display Topics, Sentiment, and Perspectives for each article

4️⃣ Viewing Analysis Results

Your projects will appear in a list on the dashboard.

Click on a project to view results:

Information	Description
Topics	Key topics extracted from articles
Sentiment	Positive, Negative, or Neutral
Perspectives	Compares viewpoints across sources

You can navigate between articles within a project to see each analysis.

5️⃣ Managing Projects

Create: Click Create New Project

View: Click on the desired project

Delete / Edit (if implemented)

🔹 All data is stored in MongoDB, so projects are saved even after closing the application.

6️⃣ Useful Tips

Use valid news article URLs for accurate analysis.

If results don’t appear: check your Google Gemini API key.

If the dashboard doesn’t load: make sure the backend is running (npm start) and ports match.

For CORS issues: check CLIENT_ORIGIN in the backend .env file.

7️⃣ Quick User Flow

Sign Up → Login

Create a project → Add news URLs

App analyzes articles automatically

View results: Topics, Sentiment, Perspectives

Manage your projects
