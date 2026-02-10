export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6] p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
