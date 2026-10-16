# Manifestations Gallery

This folder contains images for the Gallery carousel.

## How to add images:

1. **Add your images**: Simply drop your image files into this folder
2. **Update the JSON file**: Edit `js/manifestations.json` and add the filename and caption:

```json
{
    "images": [
        {
            "filename": "photo1.jpg",
            "caption": "Description of photo 1"
        },
        {
            "filename": "photo2.png",
            "caption": "Description of photo 2"
        }
    ]
}
```

## Supported formats:

- JPG/JPEG
- PNG
- GIF
- Any web-compatible image format

## Tips:

- Keep filenames simple (no spaces, special characters)
- Images will appear in the order listed in the JSON file
- You can reorder images by changing their order in the JSON array
- Captions are optional but recommended
