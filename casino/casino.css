/* ===== Stake.us Theme Variables ===== */
:root {
    --primary-bg: #121218;
    --secondary-bg: #1a1a23;
    --accent-purple: #7e57ff;
    --accent-blue: #3a7bd5;
    --text-primary: #ffffff;
    --text-secondary: #b8b8c8;
    --success: #00e676;
    --danger: #ff3d71;
    --warning: #ffaa00;
    --border-color: rgba(255,255,255,0.08);
}

/* ===== Base Styles ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
    background-color: var(--primary-bg);
    color: var(--text-primary);
    min-height: 100vh;
    background-image: 
        radial-gradient(circle at 20% 30%, rgba(126, 87, 255, 0.1) 0%, transparent 25%),
        radial-gradient(circle at 80% 70%, rgba(61, 126, 255, 0.1) 0%, transparent 25%);
}

/* ===== Header Styles ===== */
header {
    background-color: var(--secondary-bg);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
}

nav a {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

nav a:hover, nav a.active {
    color: var(--text-primary);
}

nav a.active {
    font-weight: 600;
}

/* ===== Auth Buttons ===== */
.auth-buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.auth-btn {
    padding: 0.7rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1rem;
}

#loginBtn {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--text-secondary);
}

#loginBtn:hover {
    border-color: var(--accent-purple);
    color: var(--accent-purple);
}

#registerBtn {
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue));
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(126, 87, 255, 0.3);
}

#registerBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(126, 87, 255, 0.4);
}

/* ===== User Panel ===== */
#userPanel {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

#balanceDisplay {
    background: rgba(126, 87, 255, 0.15);
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-weight: 600;
    color: var(--accent-purple);
    border: 1px solid rgba(126, 87, 255, 0.3);
}

#addFundsBtn {
    background: rgba(126, 87, 255, 0.3);
    color: var(--accent-purple);
    border: none;
    padding: 0.7rem 1.2rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(126, 87, 255, 0.2);
}

#addFundsBtn:hover {
    background: rgba(126, 87, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(126, 87, 255, 0.3);
}

/* ===== Main Content ===== */
main {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.hero {
    text-align: center;
    margin-bottom: 4rem;
    padding: 3rem 0;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #ffffff, #d1c8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero p {
    color: var(--text-secondary);
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
}

/* ===== Games Grid ===== */
.featured-games {
    margin-top: 2rem;
}

.section-title {
    font-size: 2rem;
    margin-bottom: 2.5rem;
    color: var(--text-primary);
    text-align: center;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue));
    border-radius: 3px;
}

.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    justify-content: center;
}

.game-card {
    background: var(--secondary-bg);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s;
    cursor: pointer;
    border: 1px solid var(--border-color);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.game-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.game-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--accent-purple);
}

.game-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.game-card p {
    color: var(--text-secondary);
    font-size: 1rem;
}

/* Game specific colors */
.game-card.crash:hover {
    border-color: rgba(126, 87, 255, 0.3);
}

.game-card.mines:hover {
    border-color: rgba(0, 230, 118, 0.3);
}

.game-card.slots:hover {
    border-color: rgba(255, 61, 113, 0.3);
}

.game-card.sports:hover {
    border-color: rgba(58, 123, 213, 0.3);
}

/* ===== Footer ===== */
footer {
    text-align: center;
    padding: 1.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    border-top: 1px solid var(--border-color);
    margin-top: 2rem;
}

/* ===== Update Popup Styles ===== */
.update-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.update-popup.active {
    display: flex;
    animation: fadeIn 0.3s ease-out;
}

.update-popup-content {
    background-color: var(--secondary-bg);
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transform: translateY(-20px);
    transition: transform 0.3s ease;
}

.update-popup.active .update-popup-content {
    transform: translateY(0);
}

.update-header {
    background-color: #2a2a3a;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
}

.update-badge {
    background-color: var(--accent-purple);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.close-btn {
    color: var(--text-secondary);
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
    background: none;
    border: none;
    padding: 0;
}

.close-btn:hover {
    color: var(--text-primary);
}

.update-body {
    padding: 20px;
    color: var(--text-primary);
}

.update-body p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
}
#updatePopup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
#updatePopup.active {
    display: flex;
}
.update-popup-content {
    background: #1e1e2d;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
    overflow: hidden;
}
.update-header {
    background: #2a2a3a;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333344;
}
.update-badge {
    background: #7e57ff;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
}
#closeUpdatePopup {
    background: none;
    border: none;
    color: #b8b8c8;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}
.update-body {
    padding: 20px;
    color: #e0e0e0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}