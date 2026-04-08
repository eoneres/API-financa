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
                    50: '#f3e8ff',
                    100: '#e9d5ff',
                    200: '#d8b4fe',
                    300: '#c084fc',
                    400: '#a855f7',
                    500: '#9333ea',
                    600: '#7e22ce',
                    700: '#6b21a5',
                    800: '#581c87',
                    900: '#3b0764',
                    950: '#2e1065',
                },
                dark: {
                    50: '#1a1a2e',
                    100: '#16162a',
                    200: '#121226',
                    300: '#0e0e22',
                    800: '#0a0a14',
                    900: '#05050a',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}