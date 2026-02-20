export const theme = {
    colors: {
        primary: '#1A237E', // Deep Indigo for premium feel
        secondary: '#00BFA5', // Teal accent
        accent: '#FFD600', // Yellow accent for highlights
        background: '#F5F7FA', // Soft cool grey background
        surface: '#FFFFFF',
        text: '#1C1C1E', // Almost black for text
        textSecondary: '#6B7280', // Grey for secondary text
        error: '#D32F2F',
        border: '#E5E7EB',
        white: '#FFFFFF',
        black: '#000000',
        success: '#10B981',
        warning: '#F59E0B',
        shadow: 'rgba(0,0,0,0.08)',
        cardBackground: '#FFFFFF',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    roundness: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 999,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '800' as const,
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700' as const,
            letterSpacing: -0.3,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as const,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodyBold: {
            fontSize: 16,
            fontWeight: '600' as const,
        },
        caption: {
            fontSize: 14,
            fontWeight: '400' as const,
            color: '#6B7280',
        },
        button: {
            fontSize: 16,
            fontWeight: '700' as const,
            textTransform: 'none' as const,
        },
    },
};

