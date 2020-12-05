const dir = '/home/adrian/Y/home/www/pub/diashow/images';
const fs = require('fs');
const path = require('path');
const getVideoDuration = require('get-video-duration');

const diaporamaPathBeforeRef = './images/';
const imageDuration = 5000;
const transitionDuration = 1000;
const videoFileEndings = ['.MOV', 'MP4'];
const imageFileEndings = ['.JPG', 'PNG', 'TIF', 'TIFF'];

(async () => {
    fileList = fs.readdirSync(dir);
    timeLine = [];
    for (const fileName of fileList) {
        if (isVideo(fileName)) {
            timeLine.push(await videoEntry(dir, fileName));
        }
        if (isImage(fileName)) {
            timeLine.push(await imageEntry(fileName));
        }
    }
    const data = JSON.stringify({timeline: timeLine}, null, 4);
    fs.writeFileSync(path.join(dir, 'diaporama.json'), data);
})();  

function isVideo(fileName) {
    return videoFileEndings.find(ending => fileName.toUpperCase().endsWith(ending.toUpperCase()));
}

function isImage(fileName) {
    return imageFileEndings.find(ending => fileName.toUpperCase().endsWith(ending.toUpperCase()));
}

async function videoEntry(dir, fileName) {
    const file = path.join(dir, fileName);
    return {
        video: `${diaporamaPathBeforeRef}${fileName}`,
        duration: await getVideoDuration.getVideoDurationInSeconds(file) * 1000,
        volume: 1,
        loop: false,
        transitionNext: transition()
    }
}

async function imageEntry(fileName) {
    return {
        image: `${diaporamaPathBeforeRef}${fileName}`,
        duration: imageDuration,
        transitionNext: transition()
    }
}

function transition() {
    return {
        duration: transitionDuration
    };
}
