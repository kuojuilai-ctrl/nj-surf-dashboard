// 檔名：api/surf.js
export default async function handler(req, res) {
    // 取得前端傳來的浪點 ID，預設為 Manasquan
    const spotId = req.query.spotId || '5842041f4e65fad6a7708856';
    const surflineUrl = `https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}&days=1&intervalHours=1`;

    try {
        // 從 Vercel 的伺服器端發出請求（完全不受瀏覽器 CORS 阻擋）
        const response = await fetch(surflineUrl);
        const data = await response.json();
        
        // 允許你的前端讀取這個資料
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=300'); // 快取 5 分鐘，減輕 Surfline 負擔
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '無法抓取 Surfline 數據' });
    }
}