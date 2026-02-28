## Packages
framer-motion | Page transitions and scroll-triggered animations
lucide-react | Icons and UI elements

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}
Web Share API used for sharing results, fallback to clipboard if unsupported.
Quiz state is persisted in localStorage to survive page reloads.
