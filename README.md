# GAD Test

[![Playwright](https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/docs/en/)
[badges](https://github.com/Ileriayo/markdown-badges)

<img src="https://con.jaktestowac.pl/wp-content/uploads/GAD/2/gad-screen.jpg" width="88" height="88"/>

## Spis treści:

- [I. Linki testowanych stron](#i-linki-testowanych-stron)
- [II. Konfiguracja środowiska ](#ii-konfiguracja-środowiska-testowego)
- [III. Komendy - terminal](#iii-przydatne-komendy---terminal)
- [IV. Kod - poradnik](#iv-przydatny-kod)
- [V. Konfiguracja playwright.config.ts](#v-konfiguracje-pliku-playwrightconfigts)
- [VI. Markdown Toolbox](#vi-markdown-toolbox)
- [VII. Lokatory i selektory](#vii-lokatory-i-selektoryadresy-elementów)
- [VIII. DevTools](#viii-chrome---devtools)
- [IX. Konfiguracja package.json](#ix-aktualizacja---playwright-packagejson)
- [X. Standard ESLint](#x-standardy-kodu---eslint)
- [XI. Standard Prettier](#xi-standardy-kodu---prettier)
- [XII. Standard Husky](#xii-standardy-kodu---husky)
- [XIII. Standard TSC](#xiii-standardy-kodu---typescript-compiler)
- [XIV. Wzorzec AAA](#xiv-wzorzec-aaa)
- [XV. Wzorzec DRY](#xv-wzorzec-dry)
- [XVI. Wzorzec POM](#xvi-wzorzec-pom)
- [XVII. Wzorzec GIT](#xvii-wzorzec-git---conventional-commits)
- [XVIII. Tagi - raporty](#xviii-tagi-i-adnotacje---raporty)
- [XIX. Biblioteka faker](#xix-biblioteka-faker)
- [XX. Struktura danych](#xx-struktura-danych---model)

## I. Linki testowanych stron:

- strona demo np. [GAD web app](https://proud-long-iris.glitch.me)
- rejestr informacji na temat podjętych decyzji w `DECISION_LOG.md`
- plik ze standardami formatowania kodu w `CODING_STANDARDS.md`

## II. Konfiguracja środowiska testowego:

- pobranie IDE `Visual Studio Code` ->
  https://code.visualstudio.com/
- pobranie środowiska dla JavaScript, TypeScript `Node.js` ->  
  https://nodejs.org/en/
- wtyczki VSC - rekomendowana konfiguracja zapisana w pliku `extensions.json` ->
  ```javascript
  "recommendations": [
   "ms-playwright.playwright", //'Playwright Test for VSCode' – zarządzanie testami
   "eamodio.gitlens", //'GitLens' – zaawansowana kontrola wersji
   "esbenp.prettier-vscode", //'Prettier' - formater kodu
   "dbaeumer.vscode-eslint", //'ESLint' - statyczna analiza kodu
   "pkief.material-icon-theme", //'VSCode-icons' - ikonki plików w projekcie
   "streetsidesoftware.code-spell-checker", //'Code Spell Checker' - j. angielski
   "streetsidesoftware.code-spell-checker-polish" //'Code Spell Checker' - j. polski (Spell: Language -> en,pl)
  ]
  ```
- globalne ustawienia formatowania VSC - konfiguracja zapisana w pliku `settings.json` ->
  ```javascript
  "editor.formatOnSave": true, //formatowanie przy zapisie
  "editor.defaultFormatter": "esbenp.prettier-vscode", //'Prettier' jako domyślny formater
  "editor.codeActionsOnSave": { //usuwanie nieużywanych importów
    "source.organizeImports": "explicit"
  },
  "cSpell.words": [
    // tutaj dodawane wyjątki do słownika 'Code Spell Checker'
  ]
  ```

### **_W przypadku nowego repo:_**

1. Tworzymy katalog z repo 'Projects/repo' na dysku C:/
1. Po uruchomieniu VSC otwieramy katalog 'C:/Projects/repo' i tworzymy (inicjalizujemy) projekt node.js za pomocą komendy (w oknie terminalu):
   ```javascript
   npm init playwright@latest
   ```
   Komenda pobiera najnowszą wersję Playwright - zaakceptować domyślne ustawienia.
1. Usuwamy zawartość pliku `example.spec.ts` i katalog `test-examples`, który znajduje się w katalogu tests, który został utworzony po inicjalizacji projektu.

### **_W przypadku repo na GIT:_**

1.  Pobieramy repozytorium (np. jako zip).
1.  Rozpakowujemy zip z projektem w dowolnym katalogu np Projects
1.  W VSC otwieramy folder, który zawiera `package.json`, jako nowy projekt
1.  W konsoli/terminalu wykonujemy polecenie do instalacji wymaganych paczek:

    - (opcjonalnie) instalacja rekomendowanych plug-inów VSC
    - instalacja dependencies:
      ```javascript
      npm install
      ```
    - `ustawienie 'Playwright'` w projekcie:
      ```javascript
      npx playwright install
      ```
    - `ustawienie 'Husky'` w projekcie:
      ```javascript
      npx husky
      ```
    - przygotowanie lokalnego pliku `.env`:
      ```console
      cp .env-template .env
      ```
    - sprawdzenie ustawień w pliku `env.config.ts` lub `global-setup.ts` (skrypt wykonywany przed testem):

      ```javascript
      import * as dotenv from 'dotenv'
      dotenv.config({ override: true })
      function requireEnvVariable(envVariableName: string): string {
        const envVariableValue = process.env[envVariableName]
        if (envVariableValue === undefined) {
          throw new Error(`Environment variable ${envVariableName} is not set.`)
        }
        return envVariableValue
      }
      export const BASE_URL = requireEnvVariable('BASE_URL')
      export const USER_EMAIL = requireEnvVariable('USER_EMAIL')
      export const USER_PASSWORD = requireEnvVariable('USER_PASSWORD')
      ```

    - ustaw adres URL aplikacji dla wartości `BASE_URL` oraz inne wymagane wartości w pliku lokalnym `.env`:
      ```javascript
      BASE_URL = ''
      USER_EMAIL = ''
      USER_PASSWORD = ''
      ```

### **Instalacja zakończona**

1. W tej chwili mamy gotowe środowisko do uruchomienia testów
1. Modyfikacja pliku konfiguracyjnego Playwright dokonywana w pliku `playwright.config.ts.` (np. wybór przeglądarki)
1. Konfiguracja VSC (poza ustawieniami zapisanymi w _extensions.json_ oraz w _settings.json_):
   - zmiana reguł sprawdzających kod: **Settings -> “JS/TS › Implicit Project Config: Target” -> z listy: ESNext**
   - w pliku README.md możliwość włączenia podglądu pliku: **Preview**
   - podgląd zmian: **PPM na pliku -> Open Timeline**
   - formatowanie kodu: **PPM -> Menu kontekstowe -> Format Document**
   - wyszukiwanie/zmiana danych: **CTRL + F**
   - kopiowanie zaznaczonej linijki kodu: **ALT + SHIFT + :arrow_down:**
   - komentowanie/odkomentowanie: **Ctrl + /**
   - przesunięcie linii w górę: **Alt + :arrow_up:**
   - tworzenie nowej zmiennej: **PPM -> Refaktoryzuj** lub **Ctrl + Shift + R** -> 'Extract to constant in enclosing scope'
   - wyświetlenie sugestii autozupełniania: **Ctrl + Spacebar**
   - formatowanie kodu podczas zapisu: w górnym pasku wyszukaj **>Preferences: Open User Settings** -> szukaj **format on save** -> zaznacz **Editor Format On Save**
   - przeładowanie okna: **Ctrl + Shift + P** -> 'Developer: Reload Window'
   - szybka zmiana nazwy pliku: **F2**
   - pokaż szybki fix: **Ctrl + .**

## III. Przydatne komendy - terminal:

Oficjalna dokumentacja:  
https://playwright.dev/docs/test-cli#reference

1. Aby nagrać test za pomocą `codegen` użyj polecenia:
   ```javascript
   npx playwright codegen [adres url strony]
   ```
1. Aby uruchomić testy z katalogu `test` użyj polecenia:
   ```javascript
   npx playwright test
   ```
1. Aby uruchomić interfejs graficzny Playwright:
   ```javascript
   npx playwright test --ui
   ```
1. Aby uruchomić testy z katalogu test z widocznym oknem przeglądarki użyj polecenia:
   ```javascript
   npx playwright test --headed
   ```
1. Aby wyświetlić raport z testów użyj polecenia:
   ```javascript
   npx playwright show-report
   ```
1. Aby uruchomić Trace Viewer z pliku `.zip`:
   ```javascript
   npx playwright show-trace trace.zip //trace.zip to ścieżka do pliku .zip
   ```
1. Aby uruchomić testy z konkretnego pliku:
   ```javascript
   npx playwright test tests/login.spec.ts
   ```
1. Aby uruchomić testy kilka razy z uzyciem `--repeat-each`:
   ```javascript
   npx playwright test --repeat-each=5
   ```
1. Aby uruchomić testy z tagiem `@login`:
   ```javascript
      npx playwright test --grep "@login"
   ```
1. Aby sprawdzić wersję **'Node.js'** użyj polecenia:
   ```javascript
   node - v
   ```
1. Aby przerwać wykonywanie polecenia w terminalu:
   ```javascript
   Ctrl + C //powtórzone dwukrotnie
   ```
1. Aby otworzyć plik ze ścieżki w terminalu:
   ```javascript
   Ctrl + LPM
   ```
1. Aby autozupełnić komendę podczas wpisywania użyj przycisku:
   ```javascript
   Tab
   ```
1. ...

## IV. Przydatny kod:

1. Aby wyświetlić podgląd testów:
   ```javascript
   await page.pause()
   ```
1. Aby usunąć focus z elementu:
   ```javascript
   await page.blur()
   ```
1. Aby zastosować asercję typu soft (do sprawdzania mniej ważnych rzeczy, a błąd nie przerywa testu):
   ```javascript
   await expect.soft()
   ```
1. Aby zastosować asercję z uwzględnieniem znaków formatowania:
   ```javascript
   await expect().toHaveText(, { useInnerText: true })
   ```
1. Aby zastosować zaznaczyć/odznaczyć i sprawdzić checkbox zamiast click() i asercji:
   ```javascript
   await page.check()
   await page.uncheck()
   ```
1. Aby zaczekać na pełne załadowanie strony, tzw.'inteligentne czekanie':
   ```javascript
   await page.waitForLoadState('domcontentloaded')
   ```
1. Aby uruchomić tylko 1 test:
   ```javascript
   test.only('test')
   ```
1. Import:
   ```javascript
   import { expect, test } from '@playwright/test'
   ```
1. Szablon przypadku testowego:
   ```javascript
   test('test description', async ({ page }) => {})
   ```
1. Opis dla scenariusza testów:
   ```javascript
   test.describe('Group description', () => {})
   ```
1. Funkcje do wykonania przed testem - **hook beforeEach**:
   ```javascript
   test.beforeEach(async ({ page }) => {
     //kod
   })
   ```
1. `Testy e2e` - wykonywanie testów w jednej sekwencji - dodanie ponad linię `test.describe`:
   ```javascript
   test.describe.configure({ mode: 'serial' })
   ```
1. `page.on` - nasłuchiwanie zdarzeń (asynchroniczna/działa w tle) - obsługa dialogu np. jego zamknięcie:
   ```javascript
   this.page.on('dialog', async (dialog) => {
     //nasłuchiwanie zdarzenia 'dialog' na obiekcie 'page'
     await dialog.accept() //akceptacja okna dialogowego (czyli kliknięcie OK/Accept)
   })
   ```
1. ...

## V. Konfiguracje pliku `playwright.config.ts`:

1. Obecna konfiguracja:

   ```javascript
   export default defineConfig({
     testDir: './tests',
     globalSetup: require.resolve('./src/global-setup.ts'), //skrypt wykonywany przed wszystkimi testami (przestarzały) - obecnie korzystamy z 'env.config.ts'
     timeout: 60_000, //konfiguracja timeout
     expect: { timeout: 10_000 }, //konfiguracja timeout
     fullyParallel: true,
     retries: 0,
     workers: undefined, //liczba workerów, gdzie undefined to liczba rdzeni procesora/2
     reporter: 'html',
     use: {
       baseURL: BASE_URL, //adres pobierany ze zmiennej środowiskowej
       actionTimeout: 0, //konfiguracja timeout
       trace: 'retain-on-failure', //Trace Viewer dla testu zakończonego niepowodzeniem
       video: 'retain-on-failure', //zapis wideo dla testu zakończonego niepowodzeniem
       screenshot: 'only-on-failure', //screenshots dla testu zakończonego niepowodzeniem
     },

     projects: [
       //przeglądarki dla projektu
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
     ],
   })
   ```

## VI. Markdown Toolbox:

https://www.markdowntoolbox.com/pl/blog/  
https://github.com/markdown-templates/markdown-emojis

## VII. Lokatory i selektory(adresy elementów):

- **`getByTestId`** i.e. **`getByTestId('login-input')`** for element with data-testid="login-input"
- **`getByRole`** i.e. **`getByRole('button', { name: 'wykonaj' })`**
- **`locator`** i.e. **`locator('#some-id')`** for element with attribute id="some-id", #some-id is css selector

## VIII. Chrome - DevTools:

- open DevTools **F12** or **right click Inspect**
- get selector: **right click on element -> Copy -> Copy selector**
- testing CSS selectors in Console: **$$('selector')**
  ```
  $$('.nazwa_klasy')
  ```
- testing XPath selectors in Console: **$x('selektor_XPath')**
  ```
  $x('//*[@class="nazwa_klasy"]')
  ```
- wyszukiwanie elementów CSS/XPath:
  - po nazwie klasy:
    ```
    .nazwa_klasy  //CSS
    //*[@class="nazwa_klasy"]  //XPath
    ```
  - po ID elementu:
    ```
    #id_elementu  //CSS
    //*[@id="id_elementu"]  //XPath
    ```
  - po wartości atrybutu:
    ```
    [atrybut = "wartosc"]  //CSS
    //*[@atrybut="wartosc"]  //XPath
    ```

## IX. Aktualizacja - Playwright `package.json`:

- Informacje o zależnościach i wersjach paczek w projekcie znajdują się w pliku `package.json`.
- Wersja paczki np. 1.48.1 odczytywana jako **major.minor.patch**:
  - **major** jest główną wersją – zmiany, które mogą spowodować brak kompatybilności między wersjami;
  - **minor** oznacza dodatkowe funkcjonalności;
  - **patch** oznacza pomniejsze poprawki w danej bibliotece.
- W zależności od systemu przeglądarki są instalowane w różnych lokalizacjach:
  - Windows: **`%USERPROFILE%\AppData\Local\ms-playwright`**
  - MacOS: **`~/Library/Caches/ms-playwright`**
  - Linux: **`~/.cache/ms-playwright`**
- Przydatne skrypty w sekcji **`scripts`** (widoczne w zakładce **EXPLORER** -> włączone **NPM SCRIPTS**) :

  ```json
  "scripts": {
   "format:text": "npx prettier --write .", //komenda formatu z Prettier
   "format:check": "npx prettier . --check \"!**.ts\"", //sprawdzenie formatowania dla plików z wyjątkiem formatu '.ts'
   "lint": "npx eslint . --max-warnings=0", //lintowanie z ostrzeżeniem przy 'warningach'
   "tsc:check": "npx tsc --noEmit --pretty --strict", //sprawdzenie przez TSC
   "test": "npx playwright test", //pojedyncza komenda
   "test:headed": "npx playwright test --headed", //komenda z parametrem podglądu testów
   "test:ui": "npm run test -- --ui", //ui mode
   "show-report": "npx playwright show-report", //raport z testów
   "test:tag": "npx playwright test --grep \"@GAD-R01-01|@GAD-R01-03\"", //uruchomienie testów dla wybranych tagów
   // "test:tag": "npm run test -- --grep", //alternatywa dla wywołania z komendy np: npm run test:tag "@smoke"
   // "test:tag:login": "npx playwright test --grep \"@login\"",
   "test:pulpit:headed": "npm run test tests/pulpit.spec.ts -- --headed", //inny skrypt z dodanym parametrem
  },
  ```

1. Aby sprawdzić wersję danej paczki wykonaj w konsoli komendę:
   ```javascript
   npx playwright --version
   ```
1. Aby sprawdzić czy dana wersja paczki nie jest przestarzała wykonaj w konsoli komendę:
   ```javascript
   npm outdated @playwright/test
   ```
1. Aktualizacja paczki **@playwright/test**:
   ```javascript
   npm i @playwright/test
   ```
1. Aktualizacja przeglądarek:
   ```javascript
   npx playwright install
   ```

## X. Standardy kodu - **`ESLint`**

Wykorzystany linter kodu to **`ESLint`**.

1. Zainstalowanie paczki ESLint:
   ```javascript
   npm init @eslint/config@latest
   ```
1. Konfiguracja ESLint:

   - ustawione reguły `eslint.config.mjs`:

   ```mjs
   import pluginJs from '@eslint/js'
   import eslintPluginPlaywright from 'eslint-plugin-playwright'
   import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
   import globals from 'globals'
   import tseslint from 'typescript-eslint'

   /** @type {import('eslint').Linter.Config[]} \*/
   export default [
     { ignores: ['package-lock.json', 'playwright-report/**', 'test-results/**'] }, //ignorowane
     { files: ['**/\*.ts'] }, //wspierany format plików
     { languageOptions: { globals: globals.node } },
     pluginJs.configs.recommended,
     {
       rules: {
         'no-console': 'error', //zasada no-console, zgłaszana jako błąd
       },
     },
     ...tseslint.configs.recommended,
     {
       rules: {
         '@typescript-eslint/explicit-function-return-type': 'error', //zwracany typ przez funkcję 'Promise<>'
       },
     },
     eslintPluginPlaywright.configs['flat/recommended'], //ustawienia dla paczki https://www.npmjs.com/package/eslint-plugin-playwright
     {
       rules: {
         'playwright/no-nested-step': 'off',
       },
       settings: {
         playwright: {
           globalAliases: {
             test: ['setup'],
           },
         },
       },
     },
     eslintPluginPrettierRecommended,
   ]
   ```

1. Uruchomienie formatowania z ESLint:
   ```javascript
   npx eslint .
   //lub
   npx eslint . --max-warnings=0 //zgłaszanie wszystkich błędów
   ```

## XI. Standardy kodu - **`Prettier`**

Formatowanie kodu wg standardu dla całego projektu realizowane przez **`Prettier`**.
Reguły formatowania: https://prettier.io/docs/en/options.html.

1. Zainstalowanie paczki Prettier:
   ```javascript
   npm install --save-dev --save-exact prettier
   ```
1. Konfiguracja Prettier:
   - ignorowane pliki `.prettierignore`:
   ```json
   package-lock.json
   playwright-report
   test-results
   .env
   .env-template
   ```
   - ustawione reguły `.prettierrc.json`:
   ```json
   {
     "singleQuote": true, //pojedyncze apostrofy
     "endOfLine": "auto", //zachowane istniejące zakończenia linii
     "tabWidth": 2, //wielkość wcięć
     "semi": false, //zakończenia
     "printWidth": 120, //długość linii
     "importOrderSeparation": true, //sortowanie importów dla plug-inu "@trivago/prettier-plugin-sort-imports"
     "importOrderSortSpecifiers": true,
     "plugins": ["@trivago/prettier-plugin-sort-imports"]
   }
   ```
1. Uruchomienie formatowania z Prettier:
   ```javascript
   npx prettier --write .
   ```

## XII. Standardy kodu - **`Husky`**

**`Husky`** służy do wykonywania skryptów w powiązaniu z akcjami w repozytorium kodu.
Dokumentacja: https://typicode.github.io/husky/.
Każdy problem znaleziony przez Linter (ESLint + Husky) będzie blokować commit. Błędy i problemy można:

- poprawić
- wykonać operację _stash_ na zmianach jakie mamy
- ukryć przed lintowaniem (zignorowanie w Prettier i ESLint)

1. Zainstalowanie paczki Husky:

   ```javascript
   npm install husky --save-dev
   ```

1. Zainstalowanie paczki w projekcie:

   ```javascript
   npx husky init
   ```

1. Dodanie polecenia lintowania do Husky przed akcją commit:

```javascript
   echo "npm run lint" > .husky/pre-commit
```

1. Konfiguracja Husky:

- zawartość pliku **[pre-commit]**:

  ```json
  npm run lint //lintowanie plików '.ts'
  npm run format:check //sprawdzenie formatowania plików z wyjątkiem '.ts'
  npm run tsc:check //sprawdzanie przez TSC
  ```

- Aktywacja Husky w pobranym projekcie:

  ```javascript
     npx husky
  ```

## XIII. Standardy kodu - **`TypeScript Compiler`**

**`TypeScript Compiler(TSC)`** (kompilator) używany do przekształcania kodu napisanego w TypeScript na zwykły kod JavaScript. Z jego pomocą możemy zweryfikować, czy nasz kod się poprawnie kompiluje.

1. Plik konfiguracyjny TSC `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "target": "ESNext", //uzywana wersja standardów JS
       "strict": true, //restrykcyjne zasady sprawdzania
       "module": "CommonJS", //importy dla aplikacji
       "sourceMap": true //mapa elementów do refactoringu
     },
     "exclude": ["node_modules", "playwright-report", "test-results"] //ignorowane
   }
   ```

1. Polecenie do uruchamiania TSC:

   ```javascript
   npx tsc --noEmit --pretty --strict
   ```

## XIV. Wzorzec AAA

W testach użyty został pattern AAA, gdzie:

- **`Arrange`**: przygotowanie danych testowych.
- **`Act`**: wykonanie akcji testowych.
- **`Assert`**: zweryfikowanie oczekiwanych rezultatów.
  Przykład:

```javascript
// Arrange
// [kod przygotowania do testów np. wczytanie danych]
// Act
// [kod wykonania akcji]
// Assert
// [kod sprawdzenia rezultatów]
```

## XV. Wzorzec DRY

W testach użyty został pattern **DRY (czyli Don’t Repeat Yourself)**, poprzez zastosowanie hook(funkcji) **`beforeEach()`**.
Przykład:

```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('/')
})
```

## XVI. Wzorzec POM

Prosta implementacja **Page Object Model** może opierać się na klasach. Klasy te zawierają lokalizatory elementów, które są używane w testach, np. przyciski, dane wejściowe itp.

- Przykładowa struktura katalogów:

  ```javascript
  +-- Projects
  |   +-- pages
  |       +-- login.page.ts
  |       +-- ...
  |   +-- tests
  |       +-- login.spac.ts
  |       +-- ...
  ```

- Implementacja strony - Przykładowa implementacja strony logowania w **`./pages/login.page.ts`**:

  ```javascript
  import { Locator, Page } from '@playwright/test'

  export class LoginPage {
  loginInput: Locator
  passwordInput: Locator
  loginButton: Locator

  constructor(private page: Page) {
     this.loginInput = this.page.getByTestId('login-input')
     this.passwordInput = this.page.getByTestId('password-input')
     this.loginButton = this.page.getByTestId('login-button')
  }
  }
  ```

- Zastosowanie w testach - Przykładowy import wybranej strony:

  ```javascript
  import { LoginPage } from '../pages/login.page'
  ```

- Przykład użycia w testach:
  ```javascript
  // Act
  const loginPage = new LoginPage(page)
  await loginPage.loginInput.fill(userId)
  await loginPage.passwordInput.fill(userPassword)
  await loginPage.loginButton.click()
  ```

## XVII. Wzorzec GIT - **Conventional Commits**:

Commity wykonywane wg standardów -> dokumentacja:
[wersja polska](https://www.conventionalcommits.org/pl/v1.0.0-beta.2/)
lub
[wersja angielska](https://www.conventionalcommits.org/en/v1.0.0/)

## XVIII. Tagi i adnotacje - raporty

1. **Tagi** służą do kategoryzacji testów. Można dodawać tagi do pojedynczych testów lub grup testów podczas ich deklarowania:

- dodanie tagu do nazwy testu:

  ```javascript
  // stary format
  test('unsuccessful login with too short username @login', async ({ page }) => {})
  // nowy format - zalecany
  test('unsuccessful login with too short username', { tag: '@login' }, async ({ page }) => {})
  ```

- polecenie uruchomienia testów z tagiem z terminalu:

  ```javascript
  npx playwright test --grep "@login"
  ```

- dodanie skryptu uruchamiania testów z tagiem w pliku **[package.json]**:

  ```javascript
  "test:tag:login": "npx playwright test --grep \"@login\""
  ```

- przykłady -> więcej w https://playwright.dev/docs/test-cli#reference oraz https://playwright.dev/docs/test-annotations#tag-tests
- Uruchamianie testów, które zawierają w nazwie ciąg znaków @login:

  ```javascript
  npx playwright test --grep "@login"
  ```

- Uruchamianie testów, które **nie zawierają** w nazwie ciągu znaków @login:

  ```javascript
  npx playwright test --grep-invert "@login"
  ```

- Uruchamianie testów, które zawierają w nazwie ciąg znaków @payment lub @login:

  ```javascript
  npx playwright test --grep "@payment|@login"
  ```

- Uruchamianie testów, które zawierają w nazwie ciąg znaków @integration oraz @pulpit:

  ```javascript
  npx playwright test --grep "(?=.*@integration)(?=.*@pulpit)"
  ```

1. **Adnotacje** w Playwright to specjalne oznaczenia dodawane do testów, obiekt składa się z 2 pól – **type**(obowiązkowe) oraz **description**:

   ```javascript
   annotation: [
        { type: 'happy path', description: 'Basic happy path test' },
        { type: 'documentation', description: 'Mozna dać opis i link do dokumentacji: https://playwright.info/' }
      ],
   ```

## XIX. Biblioteka `faker`

Biblioteka do generowania danych losowych.

- Oficjalna strona z dokumentacją:  
   https://fakerjs.dev/

- Możliwość usunięcia specjalnych znaków za pomocą wyrażenia regularnego:`replace(/[^A-Za-z]/g, '')`:

  ```javascript
  const userFirstName = faker.person.firstName().replace(/[^A-Za-z]/g, '')
  ```

- Losowy tekst `lorem ipsum`:

  ```javascript
  faker.lorem.sentence() //losowe zdanie
  faker.lorem.words() //losowa liczba słów
  faker.lorem.paragraph(5) //losowe 5 zdań
  faker.lorem.paragraphs(5) //losowe 5 zdań ze znakami formatowania
  ```

- Optymalizacja testów z faker poprzez zawężenie importowanych danych:

  ```javascript
  import { faker } from '@faker-js/faker'; //standardowy import
  import { faker } from '@faker-js/faker/locale/en'; //skrócony import do nazw angielskich
  ```

- Dodanie parametrów opcjonalnych `?` lub z domyślną wartością przekazywanych do funkcji:

  ```javascript
  export function prepareRandomArticle(titleLength?: number, bodyParagraphs = 5): AddArticleModel {
  let title: string

  if (titleLength) title = faker.string.alpha(titleLength)
  else title = faker.lorem.sentence()

  const body = faker.lorem.paragraphs(bodyParagraphs)

  const newArticle: AddArticleModel = { title: title, body: body }
  return newArticle
  }
  ```

## XX. Struktura danych `src`

### 1. komponenty strony -> folder `components`

Elementy kompozycji, w kontekście testów automatycznych, kompozycja pozwala na tworzenie modułów testowych i łączenie ich (zamiast dziedziczenia) np. komponent MainMenu - paska nawigacji. Taki komponent (klasa/obiekt) może być użyty w wielu innych klasach.

### 2. generowanie danych -> folder `factories`

Fabryka danych - generowanie obiektów w tym przypadku danych testowych np. danych rejestracji z użyciem modułu faker.

### 3. modele / interfejsy -> folder `models`

Model jako Typescript interface jest to najprostsza reprezentacja, jednak możemy tworzyć różne interface w naszym frameworku nie będącymi modelami. Model to reprezentacja biznesowej struktury danych z naszej aplikacji. Odnosi się on do jakiegoś konkretnego bytu, którym posługujemy się w aplikacji (model to nie to samo co interface).

Rejestracja przyjmuje kilka wymaganych pól, które możemy opisać jako model korzystając z konstrukcji dostępnej w TypeScript jaką jest `interface`.
W pliku `src/models/user.model.ts` możemy zaimplementować to tak:

```javascript
export interface RegisterUserModel {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPassword: string;
}
```

### 4. page object pages -> folder `pages`

Osobne moduły (Page Object), zawierające opis elementów na stronie, z których następnie korzystamy w testach.

### 5. zmienne środowiskowe -> folder `test-data`

Konfiguracje zmiennych środowiskowych wykorzystywanych w dotenv.

### 6. widoki -> folder `views`

Czym się różni strona (page) od widoku (view)? -> strona posiada własny adres (url), widok nie posiada własnego adresu (url) i możemy na niego wejść jedynie po wykonaniu jakiejś akcji na stronie.
Rozdzielenie page i widoków pozwala lepiej zorientować się, którą stronę można odwiedzić za pomocą adresu URL, a które elementy są dostępne jedynie przez interakcje z elementami.

Jeśli aplikacja zawiera okna `modal`/`pop-up` wyskakujące po naciśnięciu jakiegoś guzika na konkretnej stronie i są one przywiązane do danego page to proponowana struktura, gdzie strona ma nazwę users a modal to delete:

```javascript
pages
|–users //folder dla danego page i w nim umieszczamy page i components
…|–users.page.ts
…|–delete.modal.component.ts
```

```javascript
deleteModal = new DeleteModal(this.page) //import komponentu do strony
```

```javascript
users.deleteModal.close() //bezpośrednie odwołanie z poziomu page w testach
```

Podobnie w testach importujemy komponent z `/components`.

### 7. plik konfiguracji -> plik `global-setup.ts` lub `global-setup.ts`(\*obecnie nieużywany)

Plik zawierający skrypt wykonywany przed każdym testem.
