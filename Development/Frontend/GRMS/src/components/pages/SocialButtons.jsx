import React from 'react'

function SocialButtons() {

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


    const handleExternalLogin = (provider) => {
      window.location.href = `https://grms-dev.gdinexus.com:49181/api/v1/User/external/${provider}/callback?client_id=${googleClientId}`;
    };
      
  return (
    <div>
    {/* Social login buttons */}
    <button
        className="bg-gray-200 p-3 rounded-lg flex items-center justify-center gap-5 hover:opacity-90 disabled:opacity-70 w-full mb-2"
        onClick={() => handleExternalLogin("google")}
      >
        <img
          src="https://img.icons8.com/color/24/000000/google-logo.png"
          alt="Google"
        />
        Sign in with Google
      </button>

      <button
        className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-5 hover:opacity-90 w-full"
        onClick={() => handleExternalLogin("Microsoft")}
      >
        <img
          src="https://img.icons8.com/color/24/000000/microsoft.png"
          alt="Microsoft"
        />
        Sign in with Microsoft
      </button>

    </div>
  )
}

export default SocialButtons