export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>UPPERMOON Admin</title>
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
