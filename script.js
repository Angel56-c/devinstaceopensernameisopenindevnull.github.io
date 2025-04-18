// Initialize user data
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing user data
    if (!localStorage.getItem('demoUser')) {
        localStorage.setItem('demoUser', JSON.stringify({
            username: 'DemoUser',
            balance: 10000.00
        }));
    }

    const userData = JSON.parse(localStorage.getItem('demoUser'));
    updateBalanceDisplay(userData.balance);

    // Login/Register buttons
    document.getElementById('loginBtn')?.addEventListener('click', function() {
        window.location.href = 'auth/login.html';
    });

    document.getElementById('registerBtn')?.addEventListener('click', function() {
        window.location.href = 'auth/register.html';
    });

    // Add Funds functionality
    const addFundsBtn = document.getElementById('addFundsBtn');
    if (addFundsBtn) {
        addFundsBtn.addEventListener('click', function() {
            // Show user panel if hidden
            document.getElementById('userPanel').style.display = 'flex';

            // In a real app, this would open the modal
            alert('Add Funds modal would appear here');
        });
    }
});

// Update balance display
function updateBalanceDisplay(balance) {
    const balanceEl = document.getElementById('balanceDisplay');
    if (balanceEl) {
        balanceEl.textContent = '$' + balance.toFixed(2);
    }
}

// Update balance (for game pages)
function updateBalance(amount) {
    const userData = JSON.parse(localStorage.getItem('demoUser'));
    userData.balance += amount;
    localStorage.setItem('demoUser', JSON.stringify(userData));
    updateBalanceDisplay(userData.balance);
    return userData.balance;
}
// Update the DOMContentLoaded event in script.js
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing user data
    const userData = JSON.parse(localStorage.getItem('currentUser')) || {
        username: 'Guest',
        balance: 1000.00
    };

    // Update UI if user is logged in
    const userPanel = document.getElementById('userPanel');
    if (userPanel) {
        document.getElementById('usernameDisplay').textContent = userData.username;
        document.getElementById('balanceDisplay').textContent = '$' + userData.balance.toFixed(2);

        // Show user panel if logged in
        if (userData.username !== 'Guest') {
            document.getElementById('userPanel').style.display = 'flex';
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('registerBtn').style.display = 'none';
        }
    }
});

// Update the updateBalance function
function updateBalance(amount) {
    const userData = JSON.parse(localStorage.getItem('currentUser')) || {
        username: 'Guest',
        balance: 1000.00
    };
    userData.balance += amount;
    localStorage.setItem('currentUser', JSON.stringify(userData));

    const balanceEl = document.getElementById('balanceDisplay');
    if (balanceEl) {
        balanceEl.textContent = '$' + userData.balance.toFixed(2);
    }
    return userData.balance;
}
// In script.js - Update the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data if it doesn't exist
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify({
            username: 'Guest',
            balance: 1000.00 // Starting balance
        }));
    }

    // Load user data
    const userData = JSON.parse(localStorage.getItem('currentUser'));

    // Update UI
    const userPanel = document.getElementById('userPanel');
    if (userPanel) {
        document.getElementById('usernameDisplay').textContent = userData.username;
        document.getElementById('balanceDisplay').textContent = '$' + userData.balance.toFixed(2);

        // Show user panel if logged in
        if (userData.username !== 'Guest') {
            document.getElementById('userPanel').style.display = 'flex';
            document.querySelectorAll('.auth-btn').forEach(btn => {
                btn.style.display = 'none';
            });
        }
    }
});

// Add this function to update balance globally
function updateBalance(amount) {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    userData.balance += amount;
    localStorage.setItem('currentUser', JSON.stringify(userData));

    const balanceEl = document.getElementById('balanceDisplay');
    if (balanceEl) {
        balanceEl.textContent = '$' + userData.balance.toFixed(2);
    }
    return userData.balance;
}
document.addEventListener('DOMContentLoaded', function() {
  // Connect to WebSocket server
  const socket = io(process.env.SERVER_URL || 'http://localhost:3000');

  // DOM elements
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const onlineCount = document.getElementById('online-count');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const userPanel = document.getElementById('userPanel');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const balanceDisplay = document.getElementById('balanceDisplay');
  const addFundsBtn = document.getElementById('addFundsBtn');

  let currentUser = null;

  // Check authentication status
  checkAuth();

  // Load previous messages
  socket.emit('load messages');

  // Socket event listeners
  socket.on('messages loaded', (messages) => {
    messages.forEach(msg => {
      addMessageToChat(msg.username, msg.content);
    });
  });

  socket.on('message received', (msg) => {
    addMessageToChat(msg.username, msg.content);
  });

  socket.on('users online', (count) => {
    onlineCount.textContent = `${count} online`;
  });

  // Add message to chat
  function addMessageToChat(username, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
      <div class="message-username">${username}:</div>
      <div class="message-content">${message}</div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message && currentUser) {
      socket.emit('new message', {
        userId: currentUser._id,
        content: message
      });
      chatInput.value = '';
    } else if (!currentUser) {
      alert('Please login to chat');
    }
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Auth functions
  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const user = await response.json();
        loginUser(user);
      } else {
        showAuthButtons();
      }
    } catch (err) {
      console.error('Auth check error:', err);
      showAuthButtons();
    }
  }

  function loginUser(user) {
    currentUser = user;
    usernameDisplay.textContent = user.username;
    balanceDisplay.textContent = `$${user.balance.toLocaleString()}`;
    userPanel.style.display = 'flex';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    addSystemMessage(`Welcome back, ${user.username}!`);
  }

  function showAuthButtons() {
    userPanel.style.display = 'none';
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
  }

  function addSystemMessage(message) {
    addMessageToChat('System', message);
  }

  // Auth button handlers
  loginBtn.addEventListener('click', showLoginModal);
  registerBtn.addEventListener('click', showRegisterModal);
  addFundsBtn.addEventListener('click', addFunds);

  function showLoginModal() {
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');

    if (username && password) {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          loginUser(data.user);
        } else {
          alert(data.message || 'Login failed');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login error');
      });
    }
  }

  function showRegisterModal() {
    const username = prompt('Choose a username:');
    const password = prompt('Choose a password:');

    if (username && password) {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          loginUser(data.user);
          addSystemMessage(`Welcome to Funds.co, ${data.user.username}!`);
        } else {
          alert(data.message || 'Registration failed');
        }
      })
      .catch(err => {
        console.error('Register error:', err);
        alert('Registration error');
      });
    }
  }

  function addFunds() {
    if (currentUser) {
      const amount = parseFloat(prompt('Enter amount to add:'));
      if (!isNaN(amount) && amount > 0) {
        // In a real app, this would call your backend
        currentUser.balance += amount;
        balanceDisplay.textContent = `$${currentUser.balance.toLocaleString()}`;
        addSystemMessage(`Added $${amount.toLocaleString()} to your balance`);
      }
    }
  }
});
document.addEventListener('DOMContentLoaded', async function() {
  // DOM elements
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const userPanel = document.getElementById('userPanel');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const balanceDisplay = document.getElementById('balanceDisplay');
  const addFundsBtn = document.getElementById('addFundsBtn');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');

  let currentUser = null;

  // Check authentication status on page load
  await checkAuth();

  // Check authentication status
  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const user = await response.json();
        loginUser(user);
      } else {
        showAuthButtons();
      }
    } catch (err) {
      console.error('Auth check error:', err);
      showAuthButtons();
    }
  }

  // Login user
  function loginUser(user) {
    currentUser = user;
    usernameDisplay.textContent = user.username;
    balanceDisplay.textContent = `$${user.balance.toLocaleString()}`;
    userPanel.style.display = 'flex';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    addSystemMessage(`Welcome back, ${user.username}!`);
  }

  // Show auth buttons
  function showAuthButtons() {
    userPanel.style.display = 'none';
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
  }

  // Auth button handlers
  loginBtn.addEventListener('click', showLoginModal);
  registerBtn.addEventListener('click', showRegisterModal);

  async function showLoginModal() {
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');

    if (username && password) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });

        const data = await response.json();
        if (data.user) {
          loginUser(data.user);
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Login error');
      }
    }
  }

  async function showRegisterModal() {
    const username = prompt('Choose a username:');
    const password = prompt('Choose a password:');

    if (username && password) {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });

        const data = await response.json();
        if (data.user) {
          loginUser(data.user);
          addSystemMessage(`Welcome to Funds.co, ${data.user.username}!`);
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (err) {
        console.error('Register error:', err);
        alert('Registration error');
      }
    }
  }
  // Show update popup when page loads
  document.addEventListener('DOMContentLoaded', function() {
      const updatePopup = document.getElementById('updatePopup');
      const closeBtn = document.getElementById('closeUpdatePopup');

      // Show popup after short delay
      setTimeout(() => {
          updatePopup.classList.add('active');
      }, 500);

      // Close popup when close button is clicked
      closeBtn.addEventListener('click', function() {
          updatePopup.classList.remove('active');
      });

      // Close popup when clicking outside the content
      updatePopup.addEventListener('click', function(e) {
          if (e.target === updatePopup) {
              updatePopup.classList.remove('active');
          }
      });

      // Other existing JavaScript code can go here
      // For example, your login/register button functionality
    <script>
    // EMERGENCY FOOLPROOF VERSION
    window.onload = function() {
      document.getElementById('updatePopup').style.display = 'flex';

      document.getElementById('closeUpdatePopup').onclick = function() {
        document.getElementById('updatePopup').style.display = 'none';
      };
    };
    </script>
  });
});