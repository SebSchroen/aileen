const supabaseUrl = 'https://ckrziekrodmhidbrawpx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrcnppZWtyb2RtaGlkYnJhd3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDE0NDYsImV4cCI6MjA2OTcxNzQ0Nn0.1I5nc6AtS9s40Ks7vbC4vX9kiCuVarTysesOE87fX0c';
// The global 'supabase' object is exposed by the CDN script.
// We create a client instance from it.
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const loginButton = document.getElementById('login-button');

if (loginButton) {
    loginButton.addEventListener('click', async () => {
        console.log('Login button clicked. Attempting to sign in with Google...');
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index_lms.html'
            }
        });
        if (error) {
            console.error('Error logging in:', error.message);
            alert('Error logging in: ' + error.message);
        }
    });
}

async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/');

    if (session) {
        // User is logged in
        if (isLoginPage) {
            // If on login page, redirect to course
            window.location.href = 'index_lms.html';
        }
        // If on other pages (like index_lms.html), stay there.
    } else {
        // User is not logged in
        if (!isLoginPage) {
            // If not on login page, redirect to login
            window.location.href = 'login.html';
        }
    }
}

// Check the session when the script loads, except on the login page itself
// where we wait for a button click.
if (!window.location.pathname.endsWith('login.html')) {
    checkSession();
}

// Handle the redirect back from Google
supabaseClient.auth.onAuthStateChange((event, session) => {
    // This logic is mostly handled by the checkSession function now,
    // but we can keep it for specific events if needed.
    if (event === 'SIGNED_IN' && (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/'))) {
        window.location.href = 'index_lms.html';
    }
});
