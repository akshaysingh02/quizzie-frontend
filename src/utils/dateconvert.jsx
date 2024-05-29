function formatCreatedAt(isoDateString) {
    // Parse the date string into a Date object
    let date = new Date(isoDateString);

    // Define options for the date format
    let options = { day: '2-digit', month: 'short', year: 'numeric' };

    // Format the date into the desired format
    let formattedDate = date.toLocaleDateString('en-GB', options);

    // Create the final string
    return `${formattedDate}`;
}

module.exports = formatCreatedAt;