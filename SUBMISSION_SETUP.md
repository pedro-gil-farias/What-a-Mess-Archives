# Specimen Submission Setup Guide

This guide explains how to set up the GitHub Issues integration for specimen submissions.

## Overview

Visitors can now submit new specimens through the "Submit" page on your website. Submissions are created as GitHub Issues in your repository, allowing you to:
- Review submissions before adding them to data.json
- Track contributions
- Communicate with submitters via GitHub

## Setup Instructions

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Give it a name like "Website Specimen Submissions"
4. Select **only** these scopes:
   - `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Configure Your Repository URL

Edit `js/app.js` and find the `submitToGitHub()` function. Replace:
```javascript
const GITHUB_REPO = 'your-username/your-repo'; // Replace with actual repo
const GITHUB_OWNER = 'your-username'; // Replace with actual owner
```

With your actual GitHub details:
```javascript
const GITHUB_REPO = 'your-username/What-a-Mess-Archives';
const GITHUB_OWNER = 'your-username';
```

### Step 3: Store the GitHub Token

**Option A: Local Setup (for development)**
1. Open your website in a browser
2. Open Developer Console (F12)
3. Run this command:
```javascript
localStorage.setItem('github_token', 'YOUR_TOKEN_HERE')
```
Replace `YOUR_TOKEN_HERE` with your actual token from Step 1.

**Option B: Environment Variable (for production)**
If you're using a build process or CI/CD, you can store the token as an environment variable and inject it into the app.

### Step 4: Test the Form

1. Navigate to the "Submit" page on your website
2. Fill in the form with test data
3. Click "Submit Specimen"
4. Check your GitHub repository's Issues tab - a new issue should appear with label `submission` and `pending-review`

## Workflow for Reviewing Submissions

When a specimen is submitted:

1. **A GitHub Issue is created** with all the submission details
2. **Review the submission** in your Issues tab
3. **If approved:**
   - Extract the specimen data from the issue
   - Add a new entry to `js/data.json` with the specimen details
   - Close the issue with a comment thanking them
   - Optionally, add their 3D model to the `models/` folder and thumbnail to `images/`

4. **If rejected:**
   - Close the issue with a comment explaining why
   - Suggest improvements if appropriate

## Form Fields Explained

- **Title**: Unique identifier (e.g., S012_BrokenTile)
- **Location**: City and country where specimen was found
- **Date**: When the specimen was captured
- **Latitude/Longitude**: GPS coordinates of the location
- **Description**: Detailed explanation of what makes this specimen interesting
- **Tags**: Categorization (e.g., industrial, furniture, graffiti)
- **Your Name**: Submitter's name for credit
- **Your Email**: Contact information (not publicly visible)

## Data.json Entry Format

When you approve a submission, add it to `js/data.json` following this format:

```json
{
    "id": "S012",
    "title": "S012_YourTitle",
    "location": "City, Country",
    "latitude": 51.917585,
    "longitude": 4.481677,
    "date": "2024-02-11",
    "description": "Your description here...",
    "tags": ["tag1", "tag2", "tag3"],
    "modelPath": "models/S012_YourTitle.glb",
    "thumbnail": "images/S012_YourTitle.png",
    "gifPath": "images/S012_YourTitle.gif"
}
```

Note: `gifPath` is optional and can be an empty string.

## Security Notes

- **Never commit your GitHub token to the repository**
- The token is only stored locally in the browser's localStorage
- Consider using a token with limited permissions and short expiration
- If you accidentally expose your token, delete it immediately and create a new one

## Troubleshooting

### Form submission fails with "Token not configured"
- Make sure you've set the token in localStorage (see Step 3)
- Check the browser console for error messages

### Issue not appearing in GitHub
- Check that your `GITHUB_OWNER` and `GITHUB_REPO` are correct in `app.js`
- Verify the token has `repo` scope permissions
- Check GitHub's API rate limits (60 requests/hour for authenticated requests)

### "API error: Not Found"
- Double-check the repository name spelling
- Ensure the repository exists and is accessible with your token

## Testing Without a Real Repository

For testing purposes, you can temporarily modify the form to display the JSON as a text area instead of submitting to GitHub:

```javascript
// In form submit handler
const specimenJSON = JSON.stringify(formData, null, 2);
console.log('Specimen data:', specimenJSON);
messageDiv.textContent = '✓ Copy the JSON below and add it to data.json manually\n' + specimenJSON;
```

## Future Enhancements

- [ ] Auto-generate specimen IDs
- [ ] Image upload support (requires backend)
- [ ] Model file upload (requires backend)
- [ ] Email notifications on submission
- [ ] Webhook to auto-sync approved submissions to data.json
