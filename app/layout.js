export const metadata = {
  title: 'Content Brainstormer',
  description: 'Bantu tim kreatif cari ide konten',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fef9e7' }}>
        {children}
      </body>
    </html>
  );
}