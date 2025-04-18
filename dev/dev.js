<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | Funds.co</title>
    <style>
        :root {
            --primary: #0f1923;
            --secondary: #1a2a3a;
            --accent: #e8b730;
            --text: #ffffff;
            --text-secondary: #a0a0a0;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Rajdhani', 'Arial Narrow', Arial, sans-serif;
            background: var(--primary);
            color: var(--text);
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(30, 60, 90, 0.8) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(232, 183, 48, 0.3) 0%, transparent 50%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            width: 100%;
            max-width: 450px;
            padding: 2rem;
        }

        .logo {
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .register-card {
            background: var(--secondary);
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        h1 {
            margin-top: 0;
            font-size: 1.8rem;
            text-align: center;
            margin-bottom: 1.5rem;
            color: var(--accent);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-secondary);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        input {
            width: 100%;
            padding: 12px 15px;
            background: rgba(15, 25, 35, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            color: var(--text);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 2px rgba(232, 183, 48, 0.2);
        }

        .btn {
            width: 100%;
            padding: 14px;
            background: var(--accent);
            color: var(--primary);
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
        }

        .btn:hover {
            background: #f5c542;
            transform: translateY(-2px);
        }

        .btn:active {
            transform: translateY(0);
        }

        .login-link {
            text-align: center;
            margin-top: 1.5rem;
            color: var(--text-secondary);
        }

        .login-link a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 500;
        }

        .login-link a:hover {
            text-decoration: underline;
        }

        .terms {
            font-size: 0.8rem;
            color: var(--text-secondary);
            text-align: center;
            margin-top: 1.5rem;
            line-height: 1.5;
        }

        .error-message {
            color: #ff6b6b;
            margin-top: 5px;
            font-size: 0.9rem;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="logo">Funds.co</div>

        <div class="register-card">
            <h1>Create Account</h1>

            <form id="registerForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" required>
                    <div id="username-error" class="error-message"></div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                    <div id="email-error" class="error-message"></div>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                    <div id="password-error" class="error-message"></div>
                </div>

                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" required>
                    <div id="confirm-error" class="error-message"></div>
                </div>

                <button type="submit" class="btn" id="registerBtn">Register Now</button>
            </form>

            <div class="login-link">
                Already have an account? <a href="/login">Sign In</a>
            </div>

            <div class="terms">
                By registering, you agree to our Terms of Service and Privacy Policy
            </div>
        </div>
    </div>

    <script>
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const btn = document.getElementById('registerBtn');

            // Client-side validation
            let isValid = true;

            if (username.length < 4) {
                document.getElementById('username-error').textContent = 'Username must be at least 4 characters';
                isValid = false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email';
                isValid = false;
            }

            if (password.length < 8) {
                document.getElementById('password-error').textContent = 'Password must be at least 8 characters';
                isValid = false;
            }

            if (password !== confirmPassword) {
                document.getElementById('confirm-error').textContent = 'Passwords do not match';
                isValid = false;
            }

            if (!isValid) return;

            btn.disabled = true;
            btn.textContent = 'Creating Account...';

            try {
                // Get IP address
                let ip = 'unknown';
                try {
                    const ipResponse = await fetch('https://api.ipify.org?format=json');
                    const ipData = await ipResponse.json();
                    ip = ipData.ip || 'unknown';
                } catch (ipError) {
                    console.warn('Could not get IP address:', ipError);
                }

                const device = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';

                // Send registration data
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        ip,
                        device
                    })
                });

                // Handle response
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Registration failed (${response.status})`);
                }

                const result = await response.json();

                // Send admin notification
                try {
                    await fetch('/api/register-notification', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            email,
                            ip,
                            device,
                            timestamp: new Date().toISOString()
                        })
                    });
                } catch (notifyError) {
                    console.error('Admin notification failed:', notifyError);
                }

                // Redirect on success
                window.location.href = '/dashboard?newuser=true';

            } catch (error) {
                console.error('Registration error:', error);

                // Show appropriate error message
                if (error.message.includes('already exists')) {
                    document.getElementById('email-error').textContent = error.message;
                } else {
                    document.getElementById('username-error').textContent = error.message || 'Registration failed. Please try again.';
                }

            } finally {
                btn.disabled = false;
                btn.textContent = 'Register Now';
            }
        });
    </script>
</body>
</html>