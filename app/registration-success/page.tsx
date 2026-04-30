export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-12 max-w-md w-full text-center space-y-4">
        
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-[20px] font-bold text-slate-800">
          Application Submitted!
        </h1>

        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
          Your application has been successfully submitted. Your activation link will be sent to your registered email address once approved.
        </p>

        <p className="text-[11px] text-slate-400 italic">
          Please check your inbox and spam folder.
        </p>

      </div>
    </div>
  );
}