# This file contain concept decisions for GAD automation framework

## Integration of code style tools in framework

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
