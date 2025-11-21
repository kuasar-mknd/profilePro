/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'pacamara-primary': '#0F172A', // Slate 900
				'pacamara-secondary': '#6366F1', // Indigo 500
				'pacamara-accent': '#F43F5E', // Rose 500 (Vibrant)
				'pacamara-dark': '#0B0F19', // Richer Dark
				'pacamara-white': '#F8FAFC', // Slate 50
                'glass-white': 'rgba(255, 255, 255, 0.05)',
                'glass-black': 'rgba(0, 0, 0, 0.4)',
                'neon-blue': '#00f3ff',
                'neon-purple': '#bc13fe',
			},
			fontFamily: {
				'pacamara-inter': ['"Inter"', 'sans-serif'],
				'pacamara-space': ['"Space Grotesk"', 'sans-serif'],
                'outfit': ['"Outfit"', 'sans-serif'],
			},
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'blob': 'blob 20s infinite',
                'scroll-left': 'scrollLeft 40s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(50px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-30px, 40px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                scrollLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            },
			boxShadow: {
				'pacamara-shadow': '0px 25px 50px -12px rgba(0, 0, 0, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
                'glow-accent': '0 0 20px rgba(244, 63, 94, 0.5)',
			},
            aspectRatio: {
				'9/10': '9 / 16',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
