
# Replace remaining emojis with Lucide icons

## Scope

Codebase scan found emoji usage in exactly one file: `src/components/Sponsors.tsx`, lines 24, 34, 44 — the Platinum/Gold/Silver sponsor tier cards. No emojis exist anywhere else in `src/`, `public/`, or `index.html`.

## Changes

**`src/components/Sponsors.tsx`**

- Extend the existing `lucide-react` import to add `Trophy`, `Medal`, `Award`.
- Replace each emoji `<div>` with the matching icon, keeping current spacing.

| Tier      | Emoji | Replacement                                                          |
|-----------|-------|----------------------------------------------------------------------|
| Platinum  | 🏆    | `<Trophy className="h-10 w-10 text-primary mx-auto mb-4" />`         |
| Gold      | 🥇    | `<Medal className="h-10 w-10 text-primary mx-auto mb-4" />`          |
| Silver    | 🥈    | `<Award className="h-10 w-10 text-primary mx-auto mb-4" />`          |

Color uses semantic token `text-primary` (the SAF #690000) to stay on-brand and avoid hardcoded colors.

## Verification

- Re-run the emoji regex scan — expect zero matches.
- Visually confirm the Sponsors section on the homepage renders three icons in brand color, aligned where the emojis were.
