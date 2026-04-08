/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#9333ea',
                    600: '#7e22ce',
                    700: '#6b21a5',
                },
            },
        },
    },
    plugins: [],
}