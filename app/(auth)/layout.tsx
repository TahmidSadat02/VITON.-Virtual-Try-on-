export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Dark background with subtle image */}
      <div className="fixed inset-0 bg-[#0A0A0A] -z-20"></div>
      <div className="fixed inset-0 -z-10 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>

      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
