import React from 'react'

function SocialButtons() {

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  // console.log("Google Client ID:", googleClientId);
    
  const handleExternalLogin = (provider) => {
    let authUrl = "";

    if (provider === "google") {
      const redirectUri = "http://localhost:5173/google/callback"; // Callback URL
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    } else if (provider === "microsoft") {
      const redirectUri = "http://localhost:5173/microsoft/callback"; // Callback URL
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;
    }

    if (authUrl) {
      window.location.href = authUrl;
    }
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
        onClick={() => handleExternalLogin("microsoft")}
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