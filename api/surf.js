module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const spotId = req.query.spotId || '5842041f4e65fad6a7708856';
    
    // 拔除所有多餘的參數 (days, intervalHours)，避免觸發 400 錯誤。直接存取最單純的預報節點。
    const surflineUrl = `https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}`;

    try {
        const response = await fetch(surflineUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `Surfline API 錯誤 (${response.status})`
            });
        }

        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=120'); // 減少快取時間以獲取最新資料
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
