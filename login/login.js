async function login() {
  try {
    const res = await fetch('https://matrix.org/_matrix/client/r0/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'm.login.password',
        user: this.username,
        password: this.password
      })
    });

    const data = await res.json();

    if (data.access_token) {
      // Зберігаємо токен і користувача
      this.accessToken = data.access_token;
      this.userId = data.user_id;
      this.error = '';

      // Після входу очищаємо попередні дані
      this.rooms = [];
      this.messages = [];
      this.newMessage = '';

      // Завантажуємо кімнати користувача
      await this.fetchRoomsWithNames();

      // Автооновлення списку кімнат
      setInterval(() => {
        this.fetchRoomsWithNames();
      }, 5000);

      console.log('Успішний вхід користувача:', this.userId);
    } else {
      this.error = 'Login failed: ' + (data.error || 'Unknown error');
      console.error('Login failed:', data);
    }
  } catch (e) {
    this.error = 'Error during login: ' + e.message;
    console.error('Помилка під час входу:', e);
  }
}
