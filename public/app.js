const form = document.getElementById('registration-form')
const messageEl = document.getElementById('message')

function showMessage(text, type) {
  messageEl.textContent = text
  messageEl.hidden = false
  messageEl.className = `message ${type}`
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const name = document.getElementById('name').value.trim()
  const email = document.getElementById('email').value.trim()

  if (name.length < 2) {
    showMessage('Введите имя (минимум 2 символа)', 'error')
    return
  }

  if (!isValidEmail(email)) {
    showMessage('Введите корректный email', 'error')
    return
  }

  showMessage(`Регистрация успешна! Добро пожаловать, ${name}!`, 'success')
})
