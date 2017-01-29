const consoleError = require('../../utils/consoleError');

const acceptedICalVersions = [
    "2.0"
];

function validateIcs(lines) {
    if (lines[0] != "BEGIN:VCALENDAR") {
        consoleError("[validateIcs] The begin of the given ics file does not match the expectation!");
        return false;
    }

    // in case the last line is empty
    const lastLine = lines[lines.length - 1] === ''
        ? lines[lines.length - 2]
        : lines[lines.length - 1];

    if (lastLine !== "END:VCALENDAR") {
        consoleError("[validateIcs] The end of the given ics file does not match the expectation!");
        return false;
    }

    if (lines[1].indexOf("VERSION") !== -1) {
        var versionSplit = lines[1].split(":");

        if (versionSplit.length !== 2 || acceptedICalVersions.indexOf(versionSplit[1]) === -1) {
            consoleError("[validateIcs] The iCalendar version does not match any approved version!");
            return false;
        }

    } else {
        consoleError("[validateIcs] Invalid version format in ics file!");
        return false;
    }

    if (lines[2].indexOf("PRODID") === -1) {
        consoleError("[validateIcs] Missing PRODID in ics!");
        return false;
    }


    // TODO: check if ICS contains at least one event

    return true;
}

module.exports = validateIcs;
