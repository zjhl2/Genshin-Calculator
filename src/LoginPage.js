// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // 设置最小高度以确保内容居中
};
function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        // 在实际应用中，执行登录验证逻辑
        if (username === 'name' && password === 'pwd') {
            // 登录成功后跳转到仪表板页面
            navigate('/dashboard');
        } else {
            alert('登录失败，请检查用户名和密码');
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Login Page</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;