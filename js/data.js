// Example data structure for your archive
// Replace this with your actual 3D scans and metadata

const specimens = [
    {
        id: "S022",
        title: "S022_MaritimeSnail",
        location: "Rotterdam, The Netherlands",
        date: "2024-03-15",
        description: "A weathered street corner capturing layers of urban history through posters, graffiti, and architectural details.",
        tags: ["urban", "berlin", "street art", "architecture"],
        modelPath: "models/S022_MaritimeSnail.glb", // Path to your 3D model file
        thumbnail: "images/S022_MaritimeSnail.png", // Path to preview image
        coordinates: "52.5200° N, 13.4050° E"
    },
];

const aggregates = [
    {
        id: "agg001",
        title: "Urban Textures",
        description: "A collection exploring the material language of European cities through weathered surfaces and accumulated marks.",
        tags: ["thematic", "texture", "urban"],
        thumbnail: "images/placeholder-aggregate-1.jpg",
        specimenIds: ["spec001", "spec002", "spec004"],
        curatedBy: "Archive Team",
        dateCreated: "2024-07-01"
    },
];

// Export data for use in app.js
window.archiveData = {
    specimens,
    aggregates
};
