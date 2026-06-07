# Лабораторная 11 — CI/CD с GitHub Actions

Простая веб-форма регистрации на турнир + 4 Selenium UI-теста + автоматический CI/CD.

## Структура проекта

```
11/
├── public/                  ← сайт для GitHub Pages
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── tests/
│   └── form.ui.spec.js      ← 4 UI-теста (Selenium)
├── .github/workflows/
│   └── ci.yml               ← CI (тесты) + CD (деплой на Pages)
└── package.json
```

## Локальный запуск

```powershell
cd "лабы\тпо\11"
npm install
npm test          # запуск Selenium-тестов
npm start         # открыть форму на http://localhost:3000
```

---

## Что сделать на GitHub (пошагово)

### Шаг 1. Создать репозиторий

1. Зайди на [github.com/new](https://github.com/new)
2. Название, например: `lab11-ci-cd`
3. **Public** (для бесплатного GitHub Pages)
4. **Не** ставь галочки «Add README» / «Add .gitignore» — репозиторий должен быть пустым
5. Нажми **Create repository**

### Шаг 2. Первый коммит в main

В PowerShell из папки `лабы\тпо\11`:

```powershell
git init
git add .
git commit -m "Initial commit: форма регистрации, Selenium-тесты, CI/CD"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/lab11-ci-cd.git
git push -u origin main
```

Замени `ТВОЙ_ЛОГИН` и имя репозитория на свои.

### Шаг 3. Создать ветки dev и fix

```powershell
git checkout -b dev
git push -u origin dev

git checkout -b fix
git push -u origin fix

git checkout dev
```

На GitHub должны быть три ветки: `main`, `dev`, `fix`.

### Шаг 4. Включить GitHub Pages

1. Репозиторий → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Сохрани — больше ничего настраивать не нужно, деплой идёт из `ci.yml`

### Шаг 5. Проверить, что CI работает

1. Открой вкладку **Actions** в репозитории
2. После push в `main` должен запуститься workflow **CI/CD**
3. Job **test** — зелёный (4 теста прошли)
4. Job **deploy** — только для `main`, после успешных тестов
5. Ссылка на сайт: **Settings → Pages** или в логе job **deploy**

---

## Сценарий для сдачи (ветки и PR)

### Часть A: fix → dev

```powershell
git checkout fix
```

Измени текст на кнопке в `public/index.html` (или `index.html` если меняешь там):

```html
<button id="submit-btn" type="submit">Отправить заявку</button>
```

**Важно:** тест ожидает текст «Зарегистрироваться» — CI упадёт. Это нужно для демонстрации.

```powershell
git add .
git commit -m "fix: изменён текст кнопки"
git push origin fix
```

На GitHub:

1. **Pull requests** → **New pull request**
2. Base: `dev` ← Compare: `fix`
3. Создай PR — тесты запустятся и **упадут** (красный ✗)
4. Сделай скриншот для отчёта

Исправь: верни текст кнопки на «Зарегистрироваться» **или** обнови тест в `tests/form.ui.spec.js`:

```javascript
expect(await submitBtn.getText()).toBe('Отправить заявку')
```

```powershell
git add .
git commit -m "fix: синхронизирован текст кнопки с тестом"
git push origin fix
```

Когда тесты зелёные → **Merge pull request** в `dev`.

### Часть B: dev → main

1. **New pull request**: Base `main` ← Compare `dev`
2. Дождись зелёных тестов
3. **Merge pull request**
4. После merge в `main` снова запустится CI + **деплой на GitHub Pages**

---

## Что показать преподавателю

| № | Что | Где |
|---|-----|-----|
| 1 | Веб-форма | GitHub Pages URL |
| 2 | 4 UI-теста | `tests/form.ui.spec.js` |
| 3 | CI workflow | `.github/workflows/ci.yml` |
| 4 | Зелёный CI | Actions → успешный run |
| 5 | Красный CI | PR с намеренно сломанным тестом |
| 6 | PR fix → dev | Pull requests |
| 7 | PR dev → main | Pull requests |
| 8 | Деплой только из main | deploy job только после push в main |

---

## UI-тесты (4 штуки)

| Тест | Что проверяет |
|------|---------------|
| Заголовок страницы | Title и h1 = «Регистрация на турнир» |
| Пустая форма | Ошибка «Введите имя» |
| Корректные данные | Сообщение «Регистрация успешна» |
| Текст кнопки | «Зарегистрироваться» |

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Тесты падают локально | Установлен Google Chrome; выполни `npm install` |
| `npm ci` падает в CI | Закоммить `package-lock.json` (`git add package-lock.json`) |
| Pages не деплоится | Settings → Pages → Source = **GitHub Actions** |
| deploy не запускается | Деплой только при push в **main**, не в dev/fix |
| Selenium не находит Chrome в CI | В workflow уже есть `browser-actions/setup-chrome` |
