import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/" className="text-sm font-semibold leading-6 text-gray-900">
            Home
          </Link>
          <Link href="/products" className="text-sm font-semibold leading-6 text-gray-900">
            Products
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* Add cart icon here */}
        </div>
      </nav>
    </header>
  )
}
