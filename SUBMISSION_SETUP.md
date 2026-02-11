# Specimen Submission Setup Guide

This guide explains how to set up specimen submissions on your website using **Formspree**, a free form backend service that sends you emails with submission data.

## Overview

Visitors can submit new specimens through the "Submit" page with the following capabilities:
- Fill out detailed specimen information
- Upload a 3D model (GLB format)
- Upload a thumbnail image (PNG/JPG)
- Upload an animated GIF (optional)
- **You receive an email** with all the information and file links

## Quick Setup (2 Steps)

### Step 1: Create a Formspree Account

1. Go to [formspree.io](https://formspree.io/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Create a Form & Get Your Form ID

1. In Formspree, click "New Form"
2. Name it something like "Specimen Submissions"
3. Add your email address where you want to receive submissions
4. Copy the **Form ID** (you'll see it in the form settings, looks like: `mlepqnxd`)
5. Open `index.html` in your editor
6. Find this line (around line 73):
```html
<form id="specimen-form" class="specimen-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" enctype="multipart/form-data">
```
7. Replace `YOUR_FORM_ID` with your actual Form ID:
```html
<form id="specimen-form" class="specimen-form" action="https://formspree.io/f/mlepqnxd" method="POST" enctype="multipart/form-data">
```

**That's it!** Your submission form is now live.

## How It Works

1. **Visitor submits the form** with specimen data and files
2. **Formspree receives the submission** and processes the files
3. **You get an email** with:
   - All form field values
   - Download links to uploaded files (3D model, images)
   - Visitor's email address
4. **You review and approve:**
   - Download the files
   - Add files to your GitHub repo (`models/`, `images/`)
   - Add entry to `js/data.json`
   - Optionally reply to the submission via Formspree

## Form Fields

The submission form collects:

**Required fields:**
- **Title**: Specimen ID/name (e.g., S012_BrokenTile)
- **Location**: City and country
- **Date**: When captured
- **Latitude/Longitude**: GPS coordinates
- **Description**: What makes this specimen interesting
- **Your Name**: For credit/contact
- **Your Email**: To contact you
- **Thumbnail Image**: PNG or JPG preview image

**Optional fields:**
- **Tags**: Categorization keywords
- **3D Model**: GLB or GLTF format
- **Animated GIF**: Plays on hover

## Data.json Entry Format

When you approve a submission, add it to `js/data.json`:

```json
{
    "id": "S012",
    "title": "S012_BrokenTile",
    "location": "Amsterdam, The Netherlands",
    "latitude": 52.3702,
    "longitude": 4.8952,
    "date": "2024-02-11",
    "description": "Description of the specimen...",
    "tags": ["industrial", "materials"],
    "modelPath": "models/S012_BrokenTile.glb",
    "thumbnail": "images/S012_BrokenTile.png",
    "gifPath": "images/S012_BrokenTile.gif"
}
```

Note: `gifPath` is optional and can be an empty string `""` if no GIF.

## Formspree Features

### Email Notifications
- You automatically receive an email for each submission
- Email includes all form data and file download links
- Files are stored temporarily on Formspree servers

### File Handling
- Files are uploaded with the form submission
- Download links are valid for 7 days
- Max total submission size varies by plan (free tier is generous)

### Dashboard
- View all submissions in your Formspree dashboard
- Reply to submissions (if you have a premium plan)
- Export submission data
- Spam filtering available

### SPAM & Moderation
- Formspree has built-in spam protection
- You can block specific emails/domains
- Mark submissions as spam directly from emails

## Managing Submissions Workflow

### 1. Review Incoming Email
When you receive a submission email:
- Review the specimen details
- Download the files
- Assess quality/appropriateness

### 2. Approve Submissions
If approved:
- Clone/pull your GitHub repo
- Create a new specimen ID (e.g., S012)
- Move the files to appropriate folders:
  - `models/` for the GLB file
  - `images/` for PNG/JPG and GIF files
- Rename files: `S012_[title].ext`
- Add entry to `js/data.json`
- Commit and push to GitHub

### 3. Reject Submissions
If not appropriate:
- Optionally reply with feedback (premium feature)
- Simply don't add it to data.json
- Archive/delete the email

## File Size Recommendations

- **GLB models**: Keep under 100MB (smaller = faster load)
- **Thumbnail images**: ~400x280px, 1-5MB
- **GIF animations**: Keep under 20MB for web performance

## Security & Privacy

✓ **Forms are secure:**
- Formspree uses HTTPS
- Your email is not exposed to visitors
- Files don't stay on Formspree permanently

✓ **No backend token exposed** (unlike the previous GitHub approach)

✓ **Visitor data:**
- Their email is collected but only used for replies
- Consider GDPR compliance if you have EU visitors
- You can export submissions

## Troubleshooting

### "Form not configured" error when visiting site
- Double-check you've replaced `YOUR_FORM_ID` with your actual ID
- Make sure the form action URL is correct

### Files not coming through in email
- Check Formspree file size limits
- Try smaller files first to test
- Verify the file types are allowed

### Not receiving emails
- Check spam/junk folder
- Verify email in Formspree settings
- Test with Formspree's test submission feature

### Want to move to a custom backend later?
- Export all submissions from Formspree
- Replace the form action URL with your backend endpoint
- Formspree can auto-forward to webhooks (premium)

## Advanced: Formspree Settings

In your Formspree dashboard, you can:
- **Custom redirect**: Send users somewhere after submit (optional)
- **Email templates**: Customize submission emails
- **Auto-responder**: Send a thank you email to visitors
- **Webhooks**: Forward submissions to another service
- **CAPTCHA**: Add bot protection

## Formspree Pricing

The **free tier** is perfect for this use case:
- Unlimited forms
- 50 submissions/month
- File uploads included
- Email notifications

Upgrade to premium if you get many submissions:
- Unlimited submissions
- Spam filtering dashboard
- Reply directly to submissions
- Export all data

## Next Steps

1. Sign up for Formspree (it's free!)
2. Create your form and get the ID
3. Update `YOUR_FORM_ID` in index.html
4. Test by submitting a form
5. Check your email!
6. You're ready to collect specimens!
