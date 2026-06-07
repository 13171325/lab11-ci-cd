const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const { startServer, stopServer, BASE_URL } = require('./server')

function createDriver() {
  const options = new chrome.Options()
  options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu')

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()
}

describe('Форма регистрации на турнир', () => {
  let driver

  beforeAll(async () => {
    await startServer()
  })

  afterAll(async () => {
    await stopServer()
  })

  beforeEach(async () => {
    driver = await createDriver()
    await driver.get(BASE_URL)
  })

  afterEach(async () => {
    if (driver) {
      await driver.quit()
    }
  })

  it('страница загружается и отображает заголовок', async () => {
    const title = await driver.getTitle()
    expect(title).toBe('Регистрация на турнир')

    const heading = await driver.findElement(By.id('page-title'))
    expect(await heading.getText()).toBe('Регистрация на турнир')
  })

  it('пустая форма показывает ошибку валидации', async () => {
    const submitBtn = await driver.findElement(By.id('submit-btn'))
    await submitBtn.click()

    const message = await driver.wait(until.elementLocated(By.id('message')), 5000)
    await driver.wait(async () => !(await message.getAttribute('hidden')), 5000)

    const text = await message.getText()
    expect(text).toContain('Введите имя')
  })

  it('корректные данные показывают сообщение об успехе', async () => {
    await driver.findElement(By.id('name')).sendKeys('Иван Петров')
    await driver.findElement(By.id('email')).sendKeys('ivan@example.com')
    await driver.findElement(By.id('submit-btn')).click()

    const message = await driver.wait(until.elementLocated(By.id('message')), 5000)
    await driver.wait(async () => !(await message.getAttribute('hidden')), 5000)

    const text = await message.getText()
    expect(text).toContain('Регистрация успешна')
    expect(text).toContain('Иван Петров')
  })

  it('кнопка отправки имеет ожидаемый текст', async () => {
    const submitBtn = await driver.findElement(By.id('submit-btn'))
    expect(await submitBtn.getText()).toBe('Зарегистрироваться')
  })
})
