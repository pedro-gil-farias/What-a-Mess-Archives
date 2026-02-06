# Converting Your 3D Scans to GLB Format

Your 3D scanner might export files in various formats. Here's how to convert them to GLB for the web.

## Common 3D Scan Formats
- **OBJ** - Very common, but needs conversion
- **PLY** - Common from photogrammetry, needs conversion
- **STL** - 3D printing format, needs conversion
- **FBX** - From some scanning software, needs conversion
- **GLTF/GLB** - Web-ready! (GLB is better - it's a single file)

## Why GLB?
- **Single file** - Everything (model, textures) in one file
- **Optimized for web** - Loads fast
- **Widely supported** - Works in Model Viewer perfectly

---

## OPTION 1: Online Converter (Easiest)

### Using Aspose 3D Converter (Free)
1. Go to https://products.aspose.app/3d/conversion
2. Upload your scan file (OBJ, PLY, STL, etc.)
3. Select "GLB" as output format
4. Click "Convert"
5. Download the GLB file

### Other Online Options
- https://imagetostl.com/convert/file/gltf-to-glb (for GLTF → GLB)
- https://products.groupdocs.app/conversion/obj-to-glb (OBJ → GLB)

**Pros:** No software installation needed
**Cons:** File size limits, less control over optimization

---

## OPTION 2: Using Blender (Free, Most Control)

Blender is free, professional 3D software. Great for optimizing large scans.

### Install Blender
1. Download from https://www.blender.org/download/
2. Install (it's free!)

### Convert Your File
1. Open Blender
2. Delete the default cube (select it, press X, confirm)
3. File → Import → [Your format] (OBJ, PLY, STL, FBX)
4. Select your scan file
5. The model appears in the viewport
6. File → Export → glTF 2.0 (.glb/.gltf)
7. On the right panel:
   - Format: Choose "glTF Binary (.glb)"
   - Check "Remember Export Settings"
8. Choose where to save
9. Click "Export glTF 2.0"

### Optimize in Blender (Reduce File Size)
If your GLB is too large (over 20MB), try these:

**Reduce Polygon Count:**
1. Select your model
2. Add a "Decimate" modifier (right panel → Modifiers)
3. Change "Ratio" to 0.5 (reduces by half)
4. Lower more if needed (0.3 = 30% of original)
5. Re-export to GLB

**Compress Textures:**
1. Go to Shading workspace (top tabs)
2. Select your model
3. In Shader Editor, find texture nodes
4. Select each texture image
5. Image → Resize → choose smaller size (like 2048x2048)
6. Save and re-export

---

## OPTION 3: Using MeshLab (Free)

MeshLab is specifically for mesh processing.

### Install MeshLab
1. Download from https://www.meshlab.net/#download
2. Install

### Convert
1. Open MeshLab
2. File → Import Mesh → Select your file
3. File → Export Mesh As
4. Choose "GL Transmission Format (.gltf, .glb)"
5. Select GLB variant
6. Save

---

## File Size Targets

For good web performance:
- **Ideal:** Under 5MB
- **Good:** 5-15MB
- **Acceptable:** 15-30MB
- **Too large:** Over 30MB (needs optimization)

If your scans are consistently large, you likely need to:
1. Reduce polygon count (decimate)
2. Compress textures
3. Remove unnecessary geometry

---

## Checking Your GLB File

### Online GLB Viewer
Test your GLB before uploading:
1. Go to https://gltf-viewer.donmccurdy.com/
2. Drag your GLB file onto the page
3. Check if it displays correctly
4. Look at file size info

### What to Look For
- ✅ Model displays correctly
- ✅ Textures are visible
- ✅ File size is reasonable
- ✅ No errors in the console

---

## Tips for Different Scan Types

### Photogrammetry Scans (from RealityCapture, Metashape, etc.)
- Usually export as OBJ with textures
- Keep texture resolution reasonable (4K max)
- Clean up geometry before export
- Use Blender's Decimate modifier

### LiDAR Scans
- Often very dense point clouds
- May need significant decimation
- Consider keeping only the visible surface
- Remove noise/outliers before converting

### Structured Light Scans
- Usually already optimized
- Just convert the format
- Keep textures at scanner resolution

---

## Troubleshooting

**"File is too big to upload to GitHub"**
- GitHub limit is 100MB
- Decimate the mesh more
- Compress textures
- Remove unnecessary parts

**"Model looks broken after conversion"**
- Ensure textures are in the same folder during conversion
- Check that materials are assigned
- Try re-exporting with different settings

**"Model is all black/no textures"**
- Textures might not be embedded
- In Blender export: check all texture options
- Ensure texture files were included in original

**"Model loads but looks low quality"**
- Original scan might be low resolution
- Try without decimation
- Check texture resolution

---

## Recommended Workflow

1. **Scan** with your preferred method
2. **Clean** in scanning software (remove noise, fill holes)
3. **Import to Blender** for optimization
4. **Decimate** if needed (target 100k-500k polygons)
5. **Check textures** (compress to 2K or 4K)
6. **Export as GLB**
7. **Test** in online viewer
8. **Upload** to your archive

---

## Need More Help?

- **Blender Tutorials:** https://www.blender.org/support/tutorials/
- **GLTF Specification:** https://www.khronos.org/gltf/
- **Model Viewer Docs:** https://modelviewer.dev/

Remember: Start with one scan, get it working, then apply the same process to others!
