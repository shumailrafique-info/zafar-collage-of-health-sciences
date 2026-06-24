import AdmissionFormPage from "@/components/shared/admission-form";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full mx-auto max-w-4xl p-5">
        <AdmissionFormPage />
      </main>
      <Footer />
    </>
  );
}



function Header() {
  return (
    <div className="w-full bg-blue-600 text-white shadow-md ">
      <header className="max-w-4xl mx-auto px-5">
        <div className="py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpeg"
              alt="Zafar College of Health Science"
              width={60}
              height={60}
              className="rounded-full border-2 border-white"
              priority
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Zafar College of Health Science
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">
                Excellence in Medical Education
              </p>
            </div>
          </Link>
        </div>
      </header>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Zafar College of Health Science. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          Near 231mor Dakota Road Adda Zakheea
        </div>
      </div>
    </footer>
  );
}
