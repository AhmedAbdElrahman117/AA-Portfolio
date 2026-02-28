/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: '#000000',
                secondary: 'rgba(255, 255, 255, 0.05)',
                overlay: 'rgba(0, 0, 0, 0.75)',
                brand: {
                    light: '#2196F3',
                    dark: '#673AB7',
                    accent: '#E91E63'
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a0a0a0',
                    muted: 'rgba(255, 255, 255, 0.5)'
                },
                border: 'rgba(255, 255, 255, 0.1)',
                success: '#4CAF50',
                error: '#f44336'
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                'section': '100px',
                'navbar': '70px',
            },
            maxWidth: {
                'container': '1200px',
            },
            boxShadow: {
                'sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
                'md': '0 4px 12px rgba(0, 0, 0, 0.15)',
                'lg': '0 8px 24px rgba(0, 0, 0, 0.2)',
                'glow': '0 0 12px 4px rgba(33, 150, 243, 0.5), 0 0 12px 4px rgba(103, 58, 183, 0.5)',
            },
            animation: {
                'blink': 'blink 1s infinite',
                'shimmer': 'shimmer 2s infinite linear',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'dash': 'dash 1.5s ease-in-out alternate infinite',
            },
            keyframes: {
                blink: {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                dash: {
                    '0%': { strokeDasharray: '1, 200', strokeDashoffset: '0' },
                    '50%': { strokeDasharray: '89, 200', strokeDashoffset: '-35px' },
                    '100%': { strokeDasharray: '89, 200', strokeDashoffset: '-124px' }
                }
            }
        },
    },
    plugins: [],
}
