
// Leaderboard data array
var leaderboard = [];

// Current page for pagination
var currentPage = 1;

// Number of rows to show per page
var rowsPerPage = 10;

// Object to keep track of current sort key and direction
var currentSort = { key: 'score', dir: 'desc' };

// Fetch leaderboard data from JSON file and process it
async function fetchLeaderboard() {
    // Fetch the leaderboard.json file
    var response = await fetch('leaderboard.json');
    var data = await response.json();

    // Transform each player object to add first and last name fields and rank
    var newLeaderboard = [];
    for (var i = 0; i < data.length; i++) {
        var player = data[i];
        // Split the name into first and last name
        var nameParts = player.name.split(' ');
        var firstName = nameParts[0];
        var lastName = nameParts.slice(1).join(' ');
        // Create a new player object with additional fields
        var newPlayer = {
            name: player.name, // Full name
            score: player.score, // Player score
            level: player.level, // Player level
            join_date: player.join_date, // Date joined
            country: player.country, // Country
            avatar_url: player.avatar_url, // Avatar image URL
            first: firstName, // First name for sorting
            last: lastName,   // Last name for sorting
            rank: i + 1       // Rank in the leaderboard
        };
        newLeaderboard.push(newPlayer);
    }
    leaderboard = newLeaderboard;
    // At this point, leaderboard contains all players with extra fields for sorting and display
    renderTable();
    updatePagination();
}

// Sort leaderboard by a given key (column)
function sortLeaderboard(key) {
    // If already sorting by this key, reverse direction
    if (currentSort.key === key) {
        if (currentSort.dir === 'asc') {
            currentSort.dir = 'desc';
        } else {
            currentSort.dir = 'asc';
        }
    } else {
        // Otherwise, set new key and default to ascending
        currentSort.key = key;
        currentSort.dir = 'asc';
    }

    // Sort the leaderboard array
    leaderboard.sort(function (a, b) {
        // For string columns, use localeCompare
        if (key === 'first' || key === 'last' || key === 'country' || key === 'join_date') {
            if (a[key] < b[key]) {
                return currentSort.dir === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return currentSort.dir === 'asc' ? 1 : -1;
            }
            return 0;
        } else {
            // For numeric columns, subtract values
            if (currentSort.dir === 'asc') {
                return a[key] - b[key];
            } else {
                return b[key] - a[key];
            }
        }
    });
    // Re-render the table after sorting
    renderTable();
}

// Render the leaderboard table for the current page
function renderTable() {
    // Get the table body element
    var tbody = document.querySelector('#leaderboard tbody');
    // Clear any existing rows
    tbody.innerHTML = '';

    // Calculate start and end indices for current page
    var start = (currentPage - 1) * rowsPerPage;
    var end = start + rowsPerPage;

    // Loop through players for this page
    for (var i = start; i < end && i < leaderboard.length; i++) {
        var player = leaderboard[i];
        // Create a new table row
        var tr = document.createElement('tr');
        // Fill the row with player data
        tr.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td><img class="avatar" src="' + player.avatar_url + '" alt="avatar"></td>' +
            '<td>' + player.first + '</td>' +
            '<td>' + player.last + '</td>' +
            '<td>' + player.score + '</td>' +
            '<td>' + player.level + '</td>' +
            '<td>' + player.join_date + '</td>' +
            '<td>' + player.country + '</td>';
        // Add the row to the table body
        tbody.appendChild(tr);
    }
}

// Update pagination controls and page info
function updatePagination() {
    // Get page info element
    var pageInfo = document.getElementById('page-info');
    // Calculate total number of pages
    var totalPages = Math.ceil(leaderboard.length / rowsPerPage);
    // Update page info text
    pageInfo.textContent = 'Page ' + currentPage + ' of ' + totalPages;
    // Enable/disable previous and next buttons
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage === totalPages;
}

// Add event listener for previous page button
document.getElementById('prev').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
    }
});

// Add event listener for next page button
document.getElementById('next').addEventListener('click', function () {
    var totalPages = Math.ceil(leaderboard.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
    }
});

// Add event listeners for sortable table headers
var sortableHeaders = document.querySelectorAll('#leaderboard th[data-sort]');
for (var i = 0; i < sortableHeaders.length; i++) {
    sortableHeaders[i].addEventListener('click', function () {
        var sortKey = this.getAttribute('data-sort');
        sortLeaderboard(sortKey);
    });
}

// Fetch and display leaderboard when page loads
fetchLeaderboard();
