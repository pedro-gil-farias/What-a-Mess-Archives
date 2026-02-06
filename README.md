# 3D Scan Archive

A web-based archive for artistic 3D scans of public spaces. This project allows you to display, organize, and share your 3D scan collection with beautiful presentation and easy collaboration through GitHub.

## 🚀 Quick Start Guide

### What You Need
- A GitHub account (free at https://github.com)
- GitHub Desktop (download at https://desktop.github.com)
- VS Code (download at https://code.visualstudio.com)
- Your 3D scan files in GLB or GLTF format

### Step 1: Set Up GitHub Repository

1. **Create a new repository on GitHub:**
   - Go to https://github.com and sign in
   - Click the "+" icon in the top right → "New repository"
   - Name it something like `3d-scan-archive`
   - Choose "Public" (so GitHub Pages works for free)
   - Check "Add a README file"
   - Click "Create repository"

2. **Clone the repository to your computer:**
   - Open GitHub Desktop
   - Click "File" → "Clone repository"
   - Find your new repository and click "Clone"
   - Choose where to save it on your computer

### Step 2: Add the Website Files

1. **Copy all the files from this archive into your cloned repository folder:**
   - Copy: `index.html`, `css/`, `js/`, `models/`, `images/`
   - Your folder should now have all these files

2. **Commit and push to GitHub:**
   - Open GitHub Desktop
   - You'll see all the new files listed
   - In the bottom left, add a commit message: "Initial website setup"
   - Click "Commit to main"
   - Click "Push origin" (top right)

### Step 3: Enable GitHub Pages

1. **Go to your repository on GitHub.com**
2. **Click "Settings" (top menu)**
3. **Click "Pages" in the left sidebar**
4. **Under "Source", select "main" branch**
5. **Click "Save"**
6. **Wait 1-2 minutes, then refresh the page**
7. **You'll see a link like: `https://yourusername.github.io/3d-scan-archive/`**

🎉 **Your website is now live!**

---

## 📁 Project Structure

```
3d-scan-archive/
├── index.html              # Main HTML page
├── css/
│   └── style.css          # All styling
├── js/
│   ├── data.js            # Your specimen and aggregate data
│   └── app.js             # Application logic
├── models/                # Put your .glb/.gltf 3D models here
├── images/                # Put thumbnail images here
└── README.md              # This file
```

---

## 🔧 How to Add New Specimens

### Prepare Your Files

1. **3D Model:** 
   - Export as GLB or GLTF format
   - Keep file size under 50MB (GitHub limit is 100MB, but smaller is better)
   - Name it something descriptive: `berlin-street-corner-2024.glb`
   - Put it in the `models/` folder

2. **Thumbnail Image:**
   - Take a screenshot or render of your 3D model
   - Save as JPG or PNG
   - Recommended size: 800x600 pixels
   - Put it in the `images/` folder

### Edit data.js

1. **Open `js/data.js` in VS Code**

2. **Add a new specimen to the `specimens` array:**

```javascript
{
    id: "spec005",  // Give it a unique ID
    title: "Your New Scan Title",
    location: "City, Country",
    date: "2024-12-15",  // Date of the scan
    description: "Description of what you scanned and why it's interesting.",
    tags: ["tag1", "tag2", "tag3"],
    modelPath: "models/your-model-file.glb",  // Path to your 3D file
    thumbnail: "images/your-thumbnail.jpg",    // Path to your image
    coordinates: "40.7128° N, 74.0060° W"     // GPS coordinates
}
```

3. **Add a comma after the previous specimen entry (very important!)**

4. **Save the file**

### Example of Adding a Specimen

```javascript
const specimens = [
    {
        id: "spec001",
        title: "Street Corner, Berlin",
        // ... existing specimen
    },
    // Add comma here! ↓
    {
        id: "spec005",  // ← Your new specimen
        title: "Cathedral Door, Barcelona",
        location: "Barcelona, Spain",
        date: "2024-12-15",
        description: "Ornate Gothic doorway with detailed carved stone work.",
        tags: ["barcelona", "gothic", "cathedral", "architecture"],
        modelPath: "models/barcelona-door-2024.glb",
        thumbnail: "images/barcelona-door-thumb.jpg",
        coordinates: "41.3851° N, 2.1734° E"
    }
];
```

---

## 🎨 How to Add New Aggregates

Aggregates are collections of related specimens.

1. **Open `js/data.js`**

2. **Add to the `aggregates` array:**

```javascript
{
    id: "agg004",  // Unique ID
    title: "Collection Title",
    description: "What ties these specimens together.",
    tags: ["thematic", "keyword"],
    thumbnail: "images/aggregate-thumbnail.jpg",
    specimenIds: ["spec001", "spec003", "spec005"],  // IDs of included specimens
    curatedBy: "Your Name",
    dateCreated: "2024-12-15"
}
```

---

## 💾 Workflow: Making Changes

Every time you add or edit content:

1. **Make your changes in VS Code**
   - Edit `js/data.js` to add specimens/aggregates
   - Add 3D models to `models/`
   - Add images to `images/`

2. **Save all files**

3. **Open GitHub Desktop**
   - You'll see all changed files
   - Write a commit message describing what you did
   - Click "Commit to main"
   - Click "Push origin"

4. **Wait 1-2 minutes**
   - Your website will automatically update!

---

## 👥 Collaborating with Others

### Give Your Collaborator Access

1. **Go to your repository on GitHub.com**
2. **Click "Settings" → "Collaborators"**
3. **Click "Add people"**
4. **Enter their GitHub username**
5. **They'll receive an invitation email**

### Your Collaborator's Setup

1. **Install GitHub Desktop and VS Code**
2. **Accept the repository invitation**
3. **Clone the repository** (GitHub Desktop → File → Clone)
4. **Make changes** following the same workflow above

### Avoiding Conflicts

- **Before you start working:** Click "Fetch origin" in GitHub Desktop to get the latest changes
- **After you finish:** Commit and push right away
- **If there's a conflict:** GitHub Desktop will help you resolve it

---

## 🎯 Tips & Best Practices

### 3D Model Optimization
- **Use GLB format** (more compact than GLTF)
- **Optimize your models** before uploading (reduce polygon count, compress textures)
- **Keep models under 10MB** when possible for faster loading
- Tools like Blender can help optimize models

### File Naming
- Use lowercase and hyphens: `barcelona-door-2024.glb`
- Be descriptive: `berlin-wall-fragment-kreuzberg.glb`
- Include date or location for organization

### Thumbnails
- Take good screenshots with proper lighting
- Use consistent dimensions (800x600 works well)
- Show the most interesting angle of your scan

### Tags
- Use consistent terminology
- Include: location, type, era, material
- Examples: "urban", "baroque", "metal", "weathered"

---

## 🛠 Customization

### Change Colors
Edit `css/style.css`, look for the `:root` section at the top:

```css
:root {
    --color-bg: #faf8f5;        /* Background color */
    --color-text: #1a1714;      /* Text color */
    --color-accent: #d4462c;    /* Accent color (links, highlights) */
    --color-border: #ddd6ce;    /* Border color */
}
```

### Change Fonts
The site uses Google Fonts (Playfair Display and Crimson Pro). To change:
1. Go to https://fonts.google.com
2. Pick new fonts
3. Copy the import URL
4. Replace the `@import` line in `css/style.css`
5. Update the `--font-display` and `--font-body` variables

### Modify About Section
Edit `index.html`, find the section with `id="about"` and change the text.

---

## 📱 Mobile Responsive

The site automatically adapts to mobile devices. Test it by resizing your browser window or visiting on your phone.

---

## ❓ Troubleshooting

### My 3D model isn't showing
- Check the file path in `data.js` matches the actual file location
- Make sure the file is GLB or GLTF format
- Check the browser console for errors (F12 → Console tab)
- Ensure the file was pushed to GitHub (check on GitHub.com)

### Changes aren't appearing on the live site
- Wait 2-3 minutes after pushing (GitHub Pages needs time to rebuild)
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that you pushed to the correct branch (should be "main")

### Thumbnail isn't showing
- Check file path matches the actual file name
- Make sure the image is in the `images/` folder
- Image formats: JPG, PNG, WebP work best

### GitHub says file is too large
- GitHub has a 100MB limit per file
- Optimize your 3D model (reduce polygons, compress textures)
- Use online tools like gltf-transform or Blender to compress

---

## 🌐 Advanced: Custom Domain

Want to use your own domain name instead of `username.github.io`?

1. **Buy a domain** (from Namecheap, Google Domains, etc.)
2. **In your repository settings → Pages:**
   - Enter your custom domain
   - Wait for DNS check to complete
3. **At your domain registrar:**
   - Add a CNAME record pointing to `yourusername.github.io`

GitHub has detailed guides for this.

---

## 📚 Learning Resources

- **Model Viewer Documentation:** https://modelviewer.dev/
- **GitHub Pages Guide:** https://pages.github.com/
- **GitHub Desktop Help:** https://docs.github.com/en/desktop
- **3D Format Conversion:** https://products.aspose.app/3d/conversion

---

## 🎨 Example Data Format

Here's the complete structure for reference:

**Specimen:**
```javascript
{
    id: "spec001",              // Unique identifier
    title: "Street Corner",     // Display name
    location: "Berlin, Germany", // Where it was scanned
    date: "2024-03-15",         // Scan date (YYYY-MM-DD)
    description: "Description of the scan",
    tags: ["tag1", "tag2"],     // Keywords for categorization
    modelPath: "models/file.glb", // Path to 3D model
    thumbnail: "images/pic.jpg",  // Path to preview image
    coordinates: "52.52° N, 13.40° E" // GPS coordinates
}
```

**Aggregate:**
```javascript
{
    id: "agg001",
    title: "Collection Name",
    description: "What makes this collection special",
    tags: ["keyword1", "keyword2"],
    thumbnail: "images/collection.jpg",
    specimenIds: ["spec001", "spec002"], // Which specimens are included
    curatedBy: "Your Name",
    dateCreated: "2024-07-01"
}
```

---

## 📄 License

This template is free to use for your art project. The 3D scans and content you add are yours.

---

## 💬 Need Help?

- Check the GitHub Issues for this repository
- Review the troubleshooting section above
- Search for similar questions on Stack Overflow
- Consult the Model Viewer documentation

---

**Happy Archiving! 🎨📸✨**
