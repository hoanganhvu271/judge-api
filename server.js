const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path'); // Thêm dòng này để import module path
const app = express();
const port = 3000;

// Middleware để xử lý dữ liệu POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));

// Sử dụng EJS làm template engine
app.set('view engine', 'ejs');

// Trang chủ của ứng dụng
app.get('/', async (req, res) => {
    try {
        var accessToken = '9b348449f67afb2fa93a5e53e417b609';
        var endpoint = 'ec2e5307.problems.sphere-engine.com';
        var problemId = 139274;

        // Gửi yêu cầu POST để nhận HTML body của vấn đề
        const postResponse = await axios.get(`https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`);
        const body = postResponse.data.body;
        const name = postResponse.data.name;

        // Render template index.ejs và truyền nội dung HTML từ yêu cầu POST vào
        res.render('index', { name, body });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Xử lý yêu cầu POST khi người dùng gửi mã
app.post('/submit', async (req, res) => {
    try {
        var accessToken = '9b348449f67afb2fa93a5e53e417b609';
        var endpoint = 'ec2e5307.problems.sphere-engine.com';

        // Dữ liệu để gửi yêu cầu POST
        const submissionData = {
            problemId: 139274,
            compilerId: 116,
            source: req.body.source // Lấy mã nguồn từ input của người dùng
        };

        // Gửi yêu cầu POST để nhận ID của submission
        const postResponse = await axios.post('https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken, submissionData);
        const submissionId = postResponse.data.id;

        // Gửi yêu cầu GET sử dụng submissionId để kiểm tra kết quả
        var getResponse = await axios.get('https://' + endpoint + '/api/v4/submissions/' + submissionId + '?access_token=' + accessToken);

        await new Promise(resolve => setTimeout(resolve, 3000));
        // Lặp lại việc gửi yêu cầu GET đến khi kết quả có sẵn
        // while (getResponse.data.result.status.name === 'compiling...' || getResponse.data.result.status.name === 'running...' || getResponse.data.result.status.name === 'waiting...') {
        //     await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi gửi lại yêu cầu GET
        getResponse = await axios.get('https://' + endpoint + '/api/v4/submissions/' + submissionId + '?access_token=' + accessToken);

        // }
        res.json({ result: getResponse.data.result.status.name });
        // Trả về kết quả từ yêu cầu GET

    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
