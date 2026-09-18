import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Studbook',
  description: 'A registry for finding the right match, not just any match.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
