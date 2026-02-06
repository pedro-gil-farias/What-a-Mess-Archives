// Example data structure for your archive
// Replace this with your actual 3D scans and metadata

const specimens = [
    {
        id: "spec001",
        title: "Street Corner, Berlin",
        location: "Kreuzberg, Berlin, Germany",
        date: "2024-03-15",
        description: "A weathered street corner capturing layers of urban history through posters, graffiti, and architectural details.",
        tags: ["urban", "berlin", "street art", "architecture"],
        modelPath: "models/example-model.glb", // Path to your 3D model file
        thumbnail: "images/placeholder-1.jpg", // Path to preview image
        coordinates: "52.5200° N, 13.4050° E"
    },
    {
        id: "spec002",
        title: "Metro Station Tile Wall",
        location: "Paris, France",
        date: "2024-04-22",
        description: "Iconic Art Nouveau ceramic tiles from a historic metro station, preserving decorative patterns and typography.",
        tags: ["paris", "metro", "art nouveau", "tiles"],
        modelPath: "models/example-model.glb",
        thumbnail: "images/placeholder-2.jpg",
        coordinates: "48.8566° N, 2.3522° E"
    },
    {
        id: "spec003",
        title: "Market Square Fountain",
        location: "Prague, Czech Republic",
        date: "2024-05-10",
        description: "Baroque fountain sculpture with intricate water-worn details and surrounding cobblestone patterns.",
        tags: ["prague", "fountain", "baroque", "sculpture"],
        modelPath: "models/example-model.glb",
        thumbnail: "images/placeholder-3.jpg",
        coordinates: "50.0755° N, 14.4378° E"
    },
    {
        id: "spec004",
        title: "Industrial Facade Fragment",
        location: "Manchester, UK",
        date: "2024-06-03",
        description: "Section of Victorian industrial brick facade showing texture evolution through pollution and weathering.",
        tags: ["manchester", "industrial", "victorian", "brick"],
        modelPath: "models/example-model.glb",
        thumbnail: "images/placeholder-4.jpg",
        coordinates: "53.4808° N, 2.2426° W"
    }
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
    {
        id: "agg002",
        title: "Water & Stone",
        description: "Architectural elements shaped by water over time, from fountains to drainage systems.",
        tags: ["thematic", "water", "architecture"],
        thumbnail: "images/placeholder-aggregate-2.jpg",
        specimenIds: ["spec003"],
        curatedBy: "Archive Team",
        dateCreated: "2024-07-15"
    },
    {
        id: "agg003",
        title: "Transit Spaces",
        description: "Fragments from transportation infrastructure across different eras and cities.",
        tags: ["thematic", "transit", "infrastructure"],
        thumbnail: "images/placeholder-aggregate-3.jpg",
        specimenIds: ["spec002", "spec004"],
        curatedBy: "Archive Team",
        dateCreated: "2024-08-01"
    }
];

// Export data for use in app.js
window.archiveData = {
    specimens,
    aggregates
};
