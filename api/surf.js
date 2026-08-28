module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const spotId = req.query.spotId || '5842041f4e65fad6a7708856';
    const surflineUrl = `https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}&days=1&intervalHours=1`;

    try {
        const response = await fetch(surflineUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://www.surfline.com/'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `Surfline 回傳錯誤碼 ${response.status}` 
            });
        }

        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate');
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message || '後端請求失敗' });
    }
};
