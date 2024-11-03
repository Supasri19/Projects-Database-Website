document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const searchInput = document.getElementById('tableName');
    const resultContainer = document.getElementById('resultContainer');

    // Prevent the default form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchTable(searchTerm);
    });

    async function searchTable(searchTerm) {
        try {
            const response = await fetch('/all-data');
            const data = await response.json();
            resultContainer.innerHTML = ''; // Clear previous results

            if (data.error) {
                resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
                return;
            }

            // Find matching tables
            const matchingTables = Object.keys(data).filter(tableName => 
                tableName.toLowerCase().includes(searchTerm)
            );

            if (matchingTables.length === 0) {
                resultContainer.innerHTML = '<p>No matching tables found.</p>';
                return;
            }

            // Display only matching tables
            matchingTables.forEach(tableName => {
                const tableTitle = document.createElement('h2');
                tableTitle.textContent = tableName;
                resultContainer.appendChild(tableTitle);

                const table = document.createElement('table');
                table.border = '1';
                resultContainer.appendChild(table);

                if (data[tableName].length > 0) {
                    // Create header row
                    const headerRow = document.createElement('tr');
                    Object.keys(data[tableName][0]).forEach(key => {
                        const th = document.createElement('th');
                        th.textContent = key;
                        headerRow.appendChild(th);
                    });
                    table.appendChild(headerRow);

                    // Create data rows
                    data[tableName].forEach(row => {
                        const tr = document.createElement('tr');
                        Object.values(row).forEach(value => {
                            const td = document.createElement('td');
                            td.textContent = value;
                            tr.appendChild(td);
                        });
                        table.appendChild(tr);
                    });
                } else {
                    const noDataRow = document.createElement('tr');
                    const noDataCell = document.createElement('td');
                    noDataCell.colSpan = Object.keys(data[tableName][0] || {}).length || 1;
                    noDataCell.textContent = 'No data available';
                    noDataRow.appendChild(noDataCell);
                    table.appendChild(noDataRow);
                }
            });
        } catch (error) {
            console.error('Error:', error);
            resultContainer.innerHTML = '<p>Error loading data</p>';
        }
    }
    
});