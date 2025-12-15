import axios from 'axios';

// Trỏ thẳng về Server Node.js của bạn
const prefix = 'http://localhost:3000/api/';

export default {
    async call(url, method="GET", body={}) {
        if (window.startLoading) window.startLoading();

        // In ra console để kiểm tra
        console.log(`📡 Vue đang gọi API: ${prefix + url}`);

        // Lấy sessionId từ localStorage
        const sessionId = localStorage.getItem('sessionId');

        var rs = await axios({
            method,
            url: prefix + url, 
            data: body,
            headers: {
                'x-session-id': sessionId || ''
            },
            withCredentials: false
        }).catch(e=> {
            console.error("❌ Lỗi gọi API:", e);
            return e.response ? e.response : e;
        });

        if (window.stopLoading) window.stopLoading();
        return rs;
    }
};