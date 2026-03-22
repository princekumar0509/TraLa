import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TraLa',
        short_name: 'TraLa',
        description: 'Smart Attendance for Field Teams',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '64x64',
                type: 'image/x-icon',
            },
        ],
    };
}
