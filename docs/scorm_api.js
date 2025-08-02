// A mock SCORM 1.2 API for the Adapt course
// This will capture the course completion status and trigger certificate generation.

var API = {};
var findAPITries = 0;

function findAPI(win) {
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        if (findAPITries > 7) {
            console.error("Error finding API -- too deeply nested.");
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

function getAPI() {
    var theAPI = findAPI(window);
    if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
        theAPI = findAPI(window.opener);
    }
    if (theAPI == null) {
        console.error("Unable to find an API adapter");
    }
    return theAPI;
}

(function() {
    let _isInitialized = false;
    let _data = {
        'cmi.core.lesson_status': 'incomplete',
        'cmi.core.student_name': 'Guest',
        'cmi.completion_status': 'incomplete'
    };

    API.LMSInitialize = function() {
        console.log("LMSInitialize");
        _isInitialized = true;
        return "true";
    };

    API.LMSFinish = function() {
        console.log("LMSFinish");
        _isInitialized = false;
        return "true";
    };

    API.LMSGetValue = function(key) {
        console.log("LMSGetValue:", key);
        return _data[key] || "";
    };

    API.LMSSetValue = function(key, value) {
        console.log("LMSSetValue:", key, "->", value);
        _data[key] = value;

        // The key that indicates course completion in many SCORM courses
        if ((key === 'cmi.completion_status' && value === 'completed') || (key === 'cmi.core.lesson_status' && (value === 'completed' || value === 'passed'))) {
            console.log('Course completed! Triggering certificate generation...');
            generateCertificate();
        }

        return "true";
    };

    API.LMSCommit = function() {
        console.log("LMSCommit");
        return "true";
    };

    API.LMSGetLastError = function() {
        return "0";
    };

    API.LMSGetErrorString = function(errorCode) {
        return "No error";
    };

    API.LMSGetDiagnostic = function(errorCode) {
        return "No error";
    };

    // Make the API available to the window
    window.API = API;

    async function generateCertificate() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get user from Supabase
        const { data: { user } } = await supabaseClient.auth.getUser();
        const userName = user?.user_metadata?.full_name || 'Valued Student';
        const courseTitle = "Aileen Course"; // You can make this dynamic later
        const completionDate = new Date().toLocaleDateString();

        // Simple Certificate Design
        doc.setFontSize(40);
        doc.text("Certificate of Completion", 105, 40, null, null, "center");

        doc.setFontSize(20);
        doc.text("This is to certify that", 105, 70, null, null, "center");

        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.text(userName, 105, 95, null, null, "center");

        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text("has successfully completed the course", 105, 120, null, null, "center");

        doc.setFontSize(25);
        doc.setFont("helvetica", "italic");
        doc.text(courseTitle, 105, 145, null, null, "center");

        doc.setFontSize(16);
        doc.text(`Completed on: ${completionDate}`, 105, 170, null, null, "center");

        // Prompt user to download
        doc.save(`${userName}_${courseTitle}_Certificate.pdf`);
    }

})();
