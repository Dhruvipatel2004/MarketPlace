export const theme = {
    colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        background: '#f8f9fa',
        surface: '#ffffff',
        text: '#2d3436',
        textSecondary: '#636e72',
        error: '#e74c3c',
        border: '#dfe6e9',
        white: '#ffffff',
        black: '#000000',
        shadow: 'rgba(0,0,0,0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    roundness: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
        full: 999,
    },
    typography: {
        h1: {
            fontSize: 28,
            fontWeight: 'bold' as const,
        },
        h2: {
            fontSize: 22,
            fontWeight: 'bold' as const,
        },
        body: {
            fontSize: 16,
            fontWeight: 'normal' as const,
        },
        caption: {
            fontSize: 14,
            color: '#636e72',
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
        },
    },
};
