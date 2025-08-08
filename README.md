# Típusméretezés Generátor

Egy modern, hatékony eszköz reszponzív típusméretezés létrehozásához. Az alkalmazás lehetővé teszi a betűméretek arányos skálázását, valós idejű előnézet megjelenítését, és gyönyörű SCSS változók generálását Monokai témával.

## ✨ Főbb jellemzők

- **Kompakt beállítási panel** - Az alap betűméret, méretarány és betűtípus egy sorban
- **Intelligens méretarány választás** - Előre definiált zene-elméleti skálák vagy egyéni értékek
- **Gazdag betűtípus választék** - 15 populáris webfont közül választhatsz
- **Fluid tipográfia** - Reszponzív betűméretek CSS clamp() funkcióval
- **Előnézeti elemek testreszabása** - H1-H6, bekezdés, kisbetűs szöveg kiválasztása
- **Egységváltás** - Váltás px és rem egységek között
- **Monokai témájú kód generátor** - Gyönyörű, sötét témájú SCSS kód megjelenítés
- **Valós idejű előnézet** - Azonnali visszajelzés a változtatásokról
- **Egy-kattintásos másolás** - SCSS kód egyszerű másolása a vágólapra
- **Teljesen reszponzív** - Minden képernyőméreten optimális élmény

## 🚀 Telepítés

1. Klónozd le a repository-t:
   ```bash
   git clone https://github.com/BerDanMyStro/typescale-generator.git
   cd typescale-generator
   ```

2. Telepítsd a függőségeket:
   ```bash
   npm install
   ```

3. Fordítsd le a SCSS fájlokat:
   ```bash
   npm run build:css
   ```

4. Indítsd el a fejlesztői szervert:
   ```bash
   npm start
   ```

## 💻 Használat

### Alapbeállítások
1. **Alap méret**: Állítsd be az alap betűméretet (általában 16px)
2. **Méretarány**: Válassz egy harmonikus arányt (pl. Major Third 1.200)
3. **Betűtípus**: Válassz a 15 népszerű webfont közül

### Speciális funkciók
- **REM egységek**: Kapcsold be a rugalmas méretezéshez
- **Fluid tipográfia**: Aktiváld a reszponzív betűméretekhez
- **Viewport beállítások**: Adj meg min/max viewport méreteket fluid módban

### Kód generálás
- A SCSS kód automatikusan frissül minden változtatásnál
- Monokai témájú kiemelés a jobb olvashatóságért
- Egy kattintással másolhatod a teljes kódot

## 🛠 Technológiai háttér

- **Frontend**: HTML5, CSS3, JavaScript (jQuery)
- **Styling**: SCSS preprocesszor Tailwind CSS-sel
- **Build**: Sass compiler
- **Dev Server**: Live Server
- **Code highlighting**: Prism.js Monokai témával

## 📁 Projekt struktúra

```
typescale-generator/
├── css/
│   ├── styles.scss      # Fő SCSS fájl
│   └── styles.css       # Fordított CSS (auto-generated)
├── js/
│   └── app.js          # Fő JavaScript logika
├── index.html          # Fő HTML fájl
├── package.json        # NPM konfiguráció
└── README.md          # Dokumentáció
```

## ⚡ Fejlesztői parancsok

```bash
# SCSS fordítás egyszer
npm run build:css

# SCSS figyelés (auto-rebuild)
npm run watch:css

# Fejlesztői szerver indítása
npm start
```

## 🎨 Testreszabás

A projekt könnyen testreszabható:

- **Színek**: Módosítsd a SCSS változókat a `css/styles.scss` fájlban
- **Betűtípusok**: Adj hozzá új fontokat a `js/app.js` fájlban
- **Méretarányok**: Bővítsd a skála opciók listáját
- **Témák**: Customizáld a Monokai színeket

## 🤝 Közreműködés

1. Fork-old a projektet
2. Hozz létre egy feature branch-et (`git checkout -b feature/UjFunkció`)
3. Commit-old a változásokat (`git commit -m 'Új funkció hozzáadása'`)
4. Push-old a branch-re (`git push origin feature/UjFunkció`)
5. Nyiss egy Pull Request-et

## 📝 Changelog

### v2.0 - 2025-08
- ✅ Kompakt beállítási layout
- ✅ Monokai témájú kód megjelenítő
- ✅ Fluid tipográfia támogatás
- ✅ Bővített betűtípus választék
- ✅ Jobb preview elemek
- ✅ Tisztább kód struktúra

### v1.0
- ✅ Alapvető típusméretezés generálás
- ✅ SCSS export
- ✅ Reszponzív design

## 📄 Licenc

Ez a projekt az MIT licenc alatt áll rendelkezésre. További információkért lásd a [LICENSE](LICENSE) fájlt.

## 🌐 Demo

Próbáld ki élőben: [Live Demo](https://berdanmystro.github.io/typescale-generator)

## 📧 Kapcsolat

Kérdésed van? Keress meg GitHub-on vagy nyiss egy Issue-t!

---

*Made with ❤️ for better web typography*
