var config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                background: '#0B1020',
                foreground: '#EEF2FF',
                panel: '#11192E',
                'panel-strong': '#16213A',
                muted: '#8A93AC',
                border: 'rgba(148, 163, 184, 0.12)',
                neon: {
                    cyan: '#4DE2FF',
                    blue: '#4F7CFF',
                    violet: '#8B5CF6',
                    magenta: '#E879F9'
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
            },
            boxShadow: {
                panel: '0 20px 45px rgba(4, 8, 20, 0.42)',
                glow: '0 0 0 1px rgba(255, 255, 255, 0.04), 0 22px 60px rgba(30, 41, 59, 0.48)',
                neon: '0 14px 40px rgba(79, 124, 255, 0.28)'
            },
            backgroundImage: {
                'hero-grid': 'radial-gradient(circle at top right, rgba(77, 226, 255, 0.14), transparent 30%), radial-gradient(circle at 20% 10%, rgba(139, 92, 246, 0.16), transparent 25%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent)',
                'gradient-cyber': 'linear-gradient(135deg, rgba(79, 124, 255, 0.92), rgba(77, 226, 255, 0.72))',
                'gradient-royal': 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(232, 121, 249, 0.72))',
                'gradient-panel': 'linear-gradient(180deg, rgba(17, 25, 46, 0.94), rgba(10, 15, 29, 0.94))'
            },
            borderRadius: {
                '4xl': '2rem'
            },
            backdropBlur: {
                xs: '2px'
            }
        }
    },
    plugins: []
};
export default config;
