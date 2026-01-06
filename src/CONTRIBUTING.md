# 🤝 Contributing to FinaryApp

Terima kasih atas minat Anda untuk berkontribusi pada FinaryApp! 

## 🚀 Quick Start

1. Fork repository
2. Clone fork Anda:
```bash
git clone https://github.com/YOUR-USERNAME/finary-app.git
cd finary-app
```

3. Install dependencies:
```bash
npm install
```

4. Buat branch baru:
```bash
git checkout -b feature/nama-fitur
```

5. Jalankan development server:
```bash
npm run dev
```

## 📝 Development Guidelines

### Code Style

- Gunakan TypeScript untuk type safety
- Follow existing code structure
- Gunakan functional components dengan hooks
- Tambahkan types untuk semua props
- Gunakan meaningful variable names

### Commit Messages

Format:
```
type(scope): subject

body (optional)
```

Types:
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting, styling
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

Contoh:
```bash
git commit -m "feat(chart): tambah export chart ke PDF"
git commit -m "fix(modal): perbaiki date picker di mobile"
git commit -m "docs: update README deployment section"
```

### Pull Request Process

1. Update README jika ada perubahan features
2. Pastikan code berjalan tanpa error:
```bash
npm run build
npm run lint
```

3. Submit PR dengan deskripsi jelas:
   - Apa yang diubah
   - Kenapa perubahan diperlukan
   - Screenshot (jika UI changes)

## 🎯 Areas to Contribute

### 🐛 Bug Fixes
- Cek [Issues](https://github.com/username/finary-app/issues)
- Report bug baru dengan detail

### ✨ Feature Ideas
- Export data ke CSV/PDF
- Dark mode auto (system preference)
- Budget planning
- Recurring transactions
- Multi-currency support
- Cloud sync (optional)
- Desktop app (Electron)

### 📚 Documentation
- Tutorial videos
- Blog posts
- Translation ke bahasa lain
- API documentation

### 🎨 Design
- UI/UX improvements
- New themes
- Icons & illustrations
- Animations

## 🧪 Testing

Sebelum submit PR:

```bash
# Build test
npm run build

# Lint check
npm run lint

# Manual testing
npm run dev
```

Test checklist:
- [ ] Tambah transaksi berfungsi
- [ ] Edit/delete berfungsi
- [ ] Chart update dengan benar
- [ ] Laporan generate dengan benar
- [ ] Settings tersimpan
- [ ] Responsive di mobile
- [ ] Dark mode berfungsi
- [ ] Bahasa ID/EN berfungsi

## 📂 Project Structure

```
src/
├── components/     # React components
├── constants/      # Static data & translations
├── types/         # TypeScript interfaces
├── utils/         # Helper functions
├── App.tsx        # Main component
├── main.tsx       # Entry point
└── index.css      # Global styles
```

## 🎨 Design Tokens

Gunakan Tailwind classes yang sudah ada. Untuk custom colors, update di `src/constants/index.ts`:

```ts
export const CATEGORY_COLORS = {
  "New Category": "#HEX_COLOR"
}
```

## 🌐 Adding Translations

Update `src/constants/index.ts`:

```ts
export const TRANSLATIONS = {
  id: {
    newKey: "Teks Indonesia"
  },
  en: {
    newKey: "English Text"
  }
}
```

## 💡 Tips

- Keep it simple
- Mobile-first approach
- Accessibility matters (keyboard navigation, screen readers)
- Performance: avoid unnecessary re-renders
- Use semantic HTML

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Questions?

Feel free to open an issue for discussion!

---

**Thank you for making FinaryApp better! 🎉**
