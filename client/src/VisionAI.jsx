async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    const options = {
        credentials: require('/path/to/key/json'),
        projectId: 'nimble-alpha-480523-k2'
    };

    // Creates a client
    const client = new vision.ImageAnnotatorClient(options);

    // Performs label detection on the image file
    const [result] = await client.labelDetection('./resources/wakeupcat.jpg');
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
}
quickstart();