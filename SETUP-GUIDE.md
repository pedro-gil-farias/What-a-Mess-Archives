# YOUR SETUP CHECKLIST

Follow these steps in order to get your archive online.

## BEFORE YOU START

Download and install these programs:
- [ ] GitHub Desktop from https://desktop.github.com
- [ ] VS Code from https://code.visualstudio.com
- [ ] Create a GitHub account at https://github.com (if you don't have one)

---

## STEP 1: CREATE REPOSITORY ON GITHUB

1. Go to https://github.com and sign in
2. Click the green "New" button (or the "+" icon → New repository)
3. Repository name: `3d-scan-archive` (or any name you like)
4. Description: "Archive of artistic 3D scans from public spaces"
5. Choose **Public** (required for free GitHub Pages hosting)
6. ✅ Check "Add a README file"
7. Click "Create repository"

**✅ You should now see your new repository page**

---

## STEP 2: CLONE REPOSITORY TO YOUR COMPUTER

1. Open GitHub Desktop
2. Click "File" → "Clone repository"
3. Find your repository in the list (should be `yourusername/3d-scan-archive`)
4. Choose where to save it (like Documents/GitHub/)
5. Click "Clone"

**✅ You should now see the repository open in GitHub Desktop**

---

## STEP 3: ADD THE WEBSITE FILES

1. Download all the files I created for you from this folder
2. Open the folder where you cloned the repository (in Finder/Explorer)
3. Copy ALL these files and folders into it:
   - `index.html`
   - `css/` (folder)
   - `js/` (folder)
   - `models/` (folder)
   - `images/` (folder)
   - `README.md` (you can replace the existing one)

**✅ Your repository folder should now have all these files**

---

## STEP 4: PUSH FILES TO GITHUB

1. Go back to GitHub Desktop
2. You should see all the new files in the "Changes" tab
3. At the bottom left, write: "Add website files"
4. Click "Commit to main"
5. Click "Push origin" (button at the top)

**✅ Files are now on GitHub!**

---

## STEP 5: ENABLE GITHUB PAGES (MAKE SITE LIVE)

1. Go to your repository on GitHub.com
2. Click the "Settings" tab (top of page)
3. Click "Pages" in the left sidebar
4. Under "Branch", change "None" to "main"
5. Click "Save"
6. **Wait 2 minutes**, then refresh the page
7. You'll see a box that says "Your site is live at https://yourusername.github.io/3d-scan-archive/"

**✅ Your website is now LIVE on the internet!**

---

## STEP 6: TEST YOUR WEBSITE

1. Click the link from GitHub Pages
2. You should see your archive with example specimens
3. Click on a specimen card (it will show a placeholder since we don't have real 3D models yet)

**✅ If you see the website, everything is working!**

---

## NEXT: ADD YOUR FIRST REAL SPECIMEN

### Prepare Your Files
1. **3D Model:** Export one of your scans as `.glb` format
2. **Image:** Take a screenshot/render of the model (save as .jpg)

### Add Files to Project
1. Open your repository folder on your computer
2. Put your 3D model in the `models/` folder
3. Put your thumbnail in the `images/` folder

### Edit the Data
1. Right-click on the repository folder → "Open with VS Code"
2. Open the file `js/data.js`
3. Find the `specimens` array (around line 5)
4. Change the first specimen's data:

```javascript
{
    id: "spec001",
    title: "YOUR SCAN TITLE",              // ← Change this
    location: "YOUR LOCATION",              // ← Change this
    date: "2024-12-15",                     // ← Today's date
    description: "YOUR DESCRIPTION",        // ← Change this
    tags: ["tag1", "tag2"],                // ← Your tags
    modelPath: "models/your-file-name.glb", // ← Your model filename
    thumbnail: "images/your-image.jpg",     // ← Your image filename
    coordinates: "00.0000° N, 00.0000° E"  // ← GPS coordinates (optional)
}
```

4. Save the file (Ctrl+S or Cmd+S)

### Push to GitHub
1. Go to GitHub Desktop
2. Write commit message: "Add first specimen"
3. Click "Commit to main"
4. Click "Push origin"
5. Wait 2 minutes, then reload your website

**✅ You should see your scan on the website!**

---

## GIVING ACCESS TO YOUR COLLABORATOR

1. Go to your repository on GitHub.com
2. Click "Settings" → "Collaborators"
3. Click "Add people"
4. Enter their GitHub username or email
5. They'll receive an invitation

### What Your Collaborator Needs to Do:
1. Accept the email invitation
2. Install GitHub Desktop and VS Code
3. Clone the repository (same as your Step 2)
4. Follow the same workflow to add specimens

---

## DAILY WORKFLOW (After Initial Setup)

**Every time you want to add/edit:**

1. Open GitHub Desktop
2. Click "Fetch origin" (to get latest changes)
3. Make your changes in VS Code
4. Save files
5. Go to GitHub Desktop
6. Write what you changed
7. Click "Commit to main"
8. Click "Push origin"
9. Wait 2 minutes → changes appear on website

---

## GETTING HELP

**If something goes wrong:**
- Read the troubleshooting section in README.md
- Check that files are in the right folders
- Make sure you pushed to GitHub (check on GitHub.com)
- Wait a full 3 minutes for GitHub Pages to update

**Browser console errors:**
- Press F12 in your browser
- Click "Console" tab
- Look for red error messages
- These tell you what's wrong

---

## YOU'RE READY! 🚀

Start by adding one specimen at a time. Once you're comfortable, you and your collaborator can add as many as you want.

The example specimens in the data are just placeholders - replace them with your real scans!
