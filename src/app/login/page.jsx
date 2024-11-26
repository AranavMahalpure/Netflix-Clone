import Image from 'next/image'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    (<div
      className="relative flex items-center justify-center min-h-screen bg-black bg-opacity-75">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="opacity-60" />
      <div className="z-10">
        <LoginForm />
      </div>
    </div>)
  );
}

