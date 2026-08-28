module.exports = async (req, res) => {
    const spotId = req.query.spotId || '5842041f4e65fad6a7708856';
    const surflineUrl = `https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}&days=1&intervalHours=1`;

    try {
        const response = await fetch(surflineUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Surfline 回傳狀態碼: ${response.status}`);
        }

        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=300');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
