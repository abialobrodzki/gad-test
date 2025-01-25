# Introduction to Coding Standards

Niniejszy przewodnik służy jako punkt odniesienia dla naszego zespołu, przedstawiając najlepsze praktyki i konwencje, których przestrzegamy podczas pisania kodu. Spójne standardy kodowania nie tylko zwiększają czytelność naszej bazy kodu, ale także promują współpracę i łatwość utrzymania.

## Model Names

Ścieżka dostępu: `src/models/`.

- Nazwy modeli powinny być zapisane w `PascalCase`.
- Modele powinny być nazwane w sposób, który wyraźnie odzwierciedla ich rolę lub zawartość.

**Examples:**

```typescript
// ✅
interface UserModel { ... }
interface OrderDetailsModel { ... }
// ❌
interface userData { ... }
interface data { ... }
```

## Locator Names

- Nazwy locatorów (elementy UI) powinny być zapisane w `camelCase.`
- Locatory powinny być nazwane w sposób opisowy, który wyraźnie wskazuje, co reprezentują.

**Examples:**

```typescript
// ✅
userEmailInput = this.page.getByPlaceholder('Enter User Email')
loginButton = this.page.getByRole('button', { name: 'LogIn' })
// ❌
Btn = this.page.getByPlaceholder('Enter User Email')
el1 = this.page.getByRole('button', { name: 'LogIn' })
```

## Method Names

- Nazwy metod powinny być zapisane w `camelCase`.
- Nazwa metody powinna być zgodna z formatem `verbNoun`.
- Nazwy metod powinny być tak dobrane, aby jasno opisywały ich działanie lub cel.

**Examples:**

```typescript
// ✅
function getUserData(userId: string): UserData { ... }
function validateUserInput(input: string): boolean { ... }
// ❌
function xyz() { ... }
function check() { ... }
```

## Extracting Expected Values from Assertions

- W asercjach wartości powinny być wyodrębniane i przypisywane do zmiennych przed ich użyciem w dalszym kodzie.

**Example:**

```typescript
// ✅
expectedValue = 'My expected text'
expect(result).toBe(expectedValue)
// ❌
expect(someFunction()).toBe('My expected text')
```

## AAA (Arrange-Act-Assert)

- Kod testowy powinien być zorganizowany zgodnie z zasadą AAA: Arrange, Act, Assert.
- `Arrange` to etap, w którym ustawiamy dane testowe i warunki.
- `Act` to etap, w którym wykonujemy testowaną akcję.
- `Assert` to etap, w którym sprawdzamy, czy akcja została wykonana poprawnie.

**Example:**

```typescript
// ✅
test('Some test description', () => {
  // Arrange
  const expectedError = 'xyz';
  const myPage = new myPage();
  const data = prepareData();
  const myPage.customAction(data);
  // Act
  const result = doSomethingWithData(data);
  // Assert
  expect(result).toBe(expectedError);
});
```

## Messages in Assertions

- Unikaj używania komunikatów w asercjach, chyba że jest to konieczne dla przejrzystości testu.

**Examples:**

```typescript
// ✅
await expect(page.getByText('Name'), 'User should be logged in').toBeVisible()
// ✅
await expect(page.getByText('Name')).toHaveText(expectedText)
```

## Access Modifiers

- Unikaj używania wyraźnych modyfikatorów dostępu (np. `public`, `private`) w deklaracjach zmiennych i metod, chyba że jest to konieczne do implementacji.

**Example:**

```typescript
// ✅
class MyClass {
  myProperty: string;
  constructor() {
      this.myProperty = 'Hello';
  }
  myMethod() {
      return this.myProperty;
  }
}
// ❌
class MyClass {
  public myProperty: string;
  constructor() {
      this.myProperty = 'Hello';
  }
  public myMethod() {
      return this.myProperty;
  }
}
```

## Returning Page Objects in Page Object Classes

- Podczas tworzenia metod w klasach obiektów stron, które wchodzą w interakcję z elementami interfejsu użytkownika i przechodzą do innych stron, metody te powinny zwracać nowe obiekty stron reprezentujące nawigowane strony.
- Nazwa metody powinna jasno opisywać podejmowane działanie, a typ zwracany powinien być klasą obiektu strony dla nowej strony.

**Examples:**

```typescript
class HomePage {
  // ... other elements and methods ...
  // ✅
  async clickSignInButton(): Promise<SignInPage> {
    // Clicking the sign-in button navigates to the SignInPage.
    await this.signInButton.click()
    return new SignInPage(this.page)
  }
  // ❌
  async clickContactUsButton(): Promise<void> {
    // Clicking the contact us button navigates to the ContactUs page.
    await this.contactUsButton.click()
  }
}
```

- Wykorzystanie metod obiektów strony, np. w testach:

```typescript
// ✅ using page object returned by method
const signInPage = await homePage.clickSignInButton()
// ❌ creating page object while it can be returned from method
const contactUsPage = new ContactUsPage(page)
await homePage.clickContactUsButton()
contactUsPage.doStuff()
```
