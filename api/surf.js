module.exports = async (req, res) => {
    // 允許跨網域
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const spotId = req.query.spotId || '5842041f4e65fad6a7708856';
    
    // 【關鍵修正】：改用 reports (即時報告) 端點，不使用 forecasts，避開所有參數 400 錯誤
    const surflineUrl = `https://services.surfline.com/kbyg/spots/reports?spotId=${spotId}`;

    try {
        const response = await fetch(surflineUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errBody = await response.text();
            return res.status(response.status).json({ 
                error: `Surfline API 錯誤 (${response.status})`,
                details: errBody 
            });
        }

        const data = await response.json();
        // 加上快取機制，避免頻繁重整被 Surfline 封鎖
        res.setHeader('Cache-Control', 's-maxage=180');
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
