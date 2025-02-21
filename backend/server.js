const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const User = require('./src/models/User'); // 确保路径正确
const MySQLUser = require('./src/models/MySQLUser'); // 确保路径正确

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 数据库连接成功'))
  .catch((err) => console.error('MongoDB 数据库连接失败:', err));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'Bruce',
    password: '123456lzk',
    database: 'calendar'
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('MySQL 数据库连接失败:', err.stack);
        return;
    }
    console.log('成功连接到 MySQL 数据库');
});

// 路由
app.use('/api/auth', require('./src/routes/auth'));
const calendarRoutes = require('./src/routes/calendar');

app.use('/api/calendar', calendarRoutes);

app.get('/', (req, res) => {
  res.send('欢迎使用日历应用 API');
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用户已存在' });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: '注册成功' });
    } catch (error) {
        console.error('注册错误:', error); // 打印详细错误信息
        res.status(500).json({ message: '注册失败，请稍后再试', error: error.message });
    }
});

// 用户注册路由
app.post('/api/auth/register', async (req, res) => {
    // 注册逻辑
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 3001; // 确保使用 3001 端口
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
