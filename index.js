const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
const port = 3000;

// Endpoint untuk mendapatkan link download, judul, dan thumbnail
app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL) {
        return res.status(400).json({ error: 'URL video tidak ditemukan' });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title;
        const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

        // Mendapatkan link download untuk audio
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const audioUrl = audioFormats[0].url;

        // Mendapatkan link download untuk video dengan resolusi yang bervariasi
        const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
        const videoResolutions = videoFormats.map(format => ({
            quality: format.qualityLabel,
            url: format.url,
        }));

        res.json({
            title: title,
            thumbnail: thumbnail,
            audioDownloadLink: audioUrl,
            videoResolutions: videoResolutions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan' });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
