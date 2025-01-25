# This file contain concept decisions for GAD automation framework

# Table of Contents

1. [Integration of code style tools in framework](#integration-of-code-style-tools-in-framework)
2. [Use of dotenv in automated tests](#use-of-dotenv-in-automated-tests)
3. [Use of design patterns like POM, AAA, and composition in automated tests](#use-of-design-patterns-like-pom-aaa-and-composition-in-automated-tests)
4. [Use of faker in automated tests](#use-of-faker-in-automated-tests)
5. [Introduction of New Methods Returning Page Objects in Page Objects Code](#introduction-of-new-methods-returning-page-objects)

# Decisions

## Integration of code style tools in framework <a id="integration-of-code-style-tools-in-framework"></a>

**ID**: 001  
**Status**: Decided  
**Date**: 2024/12/31  
**Context**: Potrzebujemy narzędzi statycznej analizy kodu do:

- ujednoliconego standardu,
- lepszej czytelności kodu,
- łatwego formatowania kodu.

**Proposed solution:** Przyjęte rozwiązania:

- ESLint do lintowania reguł kodowania dla plików TypeScript,
- Prettier do formatowania plików,
- Husky do uruchamiania skryptów przed commitem.

**Pros**: Narzędzia automatyzują czynności formatowania kodu.  
**Cons**: Nowe narzędzia zwiększają złożoność i wymagają utrzymania.  
**Decision**: Użycie Prettier, ESLint i Husky w celu zapewnienia standardu kodu.  
**Creator**: Adrian  
**Reviewer**: --

## Use of dotenv in automated tests <a id="use-of-dotenv-in-automated-tests"></a>

**ID**: 002  
**Status**: Decided  
**Date**: 2025/01/02  
**Context**: Sposób na zarządzenie konfiguracjami specyficznymi dla środowiska.  
**Proposed solution**: Wykorzystanie biblioteki „dotenv”.  
**Pros**: Bezpieczne zarządzanie konfiguracją / Uproszczona konfiguracja środowiska  
**Cons**: Dodatkowe kroki konfiguracyjne / Możliwość błędnej konfiguracji  
**Decision**: Uzycie dotenv w testach.  
**Creator**: Adrian  
**Reviewer**: --

## Use of design patterns like POM, AAA, and composition in automated tests <a id="use-of-design-patterns-like-pom-aaa-and-composition-in-automated-tests"></a>

**ID**: 003  
**Status**: Decided  
**Date**: 2025/01/02  
**Context**: Przyjęcie wzorców projektowych w celu poprawy ogólnej struktury testów i łatwości ich utrzymania.  
**Proposed solution**: Page Object Model (POM) dla testów UI, wzorzec Arrange-Act-Assert (AAA) dla testów oraz Composition do tworzenia modułowych i elastycznych komponentów testowych.  
**Pros**:

- _Page Object Model (POM)_: Ulepszona organizacja i rozwój testów / Ponowne wykorzystanie kodu
- _Arrange-Act-Assert (AAA)_: Przejrzysta struktura testów / Lepsza lokalizacja błędów
- _Composition_: Modułowość kodu

**Cons**:

- _Page Object Model (POM)_: Wymaga dodatkowej konfiguracji / Dodatkowa złożoność
- _Arrange-Act-Assert (AAA)_: Dodatkowa złożoność
- _Composition_: Nadużywanie może zaciemniać logike kodu / Dodatkowa złożoność

**Decision**: Przyjęto Page-Object-Model (POM) dla testów UI, wzorzec Arrange-Act-Assert (AAA) dla testów.  
**Creator**: Adrian  
**Reviewer**: --

## Use of faker in automated tests <a id="use-of-faker-in-automated-tests"></a>

**ID**: 004  
**Status**: Decided  
**Date**: 2025/01/05  
**Context**: Potrzeba wypełnienia danych testowych realistycznymi, ale losowymi wartościami, takimi jak imiona i nazwiska, adresy, daty i inne informacje specyficzne dla użytkownika.  
**Proposed solution**: Integracja biblioteki „faker” z testami, aby generować realistyczne i losowe dane testowe.  
**Pros**: Realistyczne dane testowe / Oszczędność czasu / Zwiększone pokrycie testami  
**Cons**: Zarządzanie zależnościami / Wolniejsze testy / Wyzwania związane z losowymi danymi  
**Decision**: Wykorzystanie biblioteki faker.  
**Creator**: Adrian  
**Reviewer**: --

## Introduction of New Methods Returning Page Objects in Page Objects Code <a id="introduction-of-new-methods-returning-page-objects"></a>

**ID**: 005  
**Status**: Decided  
**Date**: 2025/01/25  
**Context**: Wzorzec obejmuje tworzenie metod w obiektach stron, które zwracają nowe obiekty stron w celu poprawy przepływu testów i łatwości ich utrzymania.  
**Proposed solution**: Wdrożenie wzorca, w którym metody w obiektach stron zwracają nowe obiekty stron po interakcji. Takie podejście poprawia organizację kodu testowego i ułatwia jego utrzymanie.  
**Pros**: Lepsza czytelność testów / Zwiększona możliwość ponownego wykorzystania obiektów stron / Modułowe tworzenie testów  
**Cons**: Dodatkowe skomplikowanie kodu / Trudna obsługa przypadków brzegowych  
**Decision**: Użycie standardu zwracania Page Object w metodach.  
**Creator**: Adrian  
**Reviewer**: --
