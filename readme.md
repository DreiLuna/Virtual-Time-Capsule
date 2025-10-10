# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Better comments

install the better comments plugin and use these addons in the settings.json config to make comments appear more relevant and usefull

'''
        { //+ added
            "tag": "+",
            "color": "#00ff2a",
            "strikethrough": false,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": true
        },
        { //- removed
            "tag": "-",
            "color": "#ff4000",
            "strikethrough": true,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": true
        },
        { //$ import assets
            "tag": "$",
            "color": "#9000ff",
            "strikethrough": false,
            "underline": true,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        },
        { //^ import css
            "tag": "^",
            "color": "#ff00d9",
            "strikethrough": false,
            "underline": true,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        }
'''

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
