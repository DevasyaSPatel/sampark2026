import Link from "next/link";

export default function Register() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="container flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        Sampark 2026
                    </Link>
                    <Link href="/" className="text-gray-400 hover:text-white">
                        Back to Home
                    </Link>
                </div>
            </nav>

            <div className="container max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">Registration</h1>
                    <p className="text-gray-400">
                        Fill out the form below to secure your spot at Sampark 2026.
                        <br />
                        Once confirmed, you will receive your login credentials via email.
                    </p>
                </div>

                <div className="glass p-4 md:p-8 flex justify-center">
                    {/* Google Form Embed Placeholder */}
                    {/* Replace the src with the actual Google Form embed URL */}
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSfD_example_form_id/viewform?embedded=true"
                        width="100%"
                        height="800"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        className="bg-white rounded-lg"
                    >
                        Loading…
                    </iframe>
                </div>
            </div>
        </div>
    );
}
