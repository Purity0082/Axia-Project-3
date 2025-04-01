document.addEventListener("DOMContentLoaded", () => {
    const jobContainer = document.getElementById("jobContainer");
    const filterBar = document.getElementById("filterBar");

    let jobsData = [];
    let selectedFilters = [];

    // Fetch data from JSON file
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            jobsData = data;
            displayJobs(jobsData);
        })
        .catch(error => console.error("Error fetching data:", error));

    // Function to display jobs
    function displayJobs(jobs) {
        jobContainer.innerHTML = ""; // Clear previous jobs
        jobs.forEach(job => {
            const jobElement = document.createElement("div");
            jobElement.classList.add("job-listing");

            jobElement.innerHTML = `
                <div class="logo-area">
                    <div><img src="${job.logo}" alt="${job.company}"></div>
                    <div class="info-area">
                        <div class="featured">
                            <h6 class="company">${job.company}</h6>
                            ${job.new ? `<h6 class="new">NEW!</h6>` : ""}
                            ${job.featured ? `<h6 class="ft">FEATURED</h6>` : ""}
                        </div>
                        <h4 class="position">${job.position}</h4>
                        <p class="paragraph">${job.postedAt} • ${job.contract} • ${job.location}</p>
                    </div>
                </div>
                <div class="job-tags">
                    <span class="filter-btn">${job.role}</span>
                    <span class="filter-btn">${job.level}</span>
                    ${job.languages.map(lang => `<span class="filter-btn">${lang}</span>`).join("")}
                    ${job.tools.map(tool => `<span class="filter-btn">${tool}</span>`).join("")}
                </div>
            `;

            jobContainer.appendChild(jobElement);
        });

        // Add event listeners to filter buttons
        document.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", () => {
                const filterValue = button.textContent;
                if (!selectedFilters.includes(filterValue)) {
                    selectedFilters.push(filterValue);
                    updateFilters();
                    filterJobs();
                }
            });
        });
    }

    // Function to update filter bar
    function updateFilters() {
        filterBar.innerHTML = ""; // Clear previous filters

        selectedFilters.forEach(filter => {
            const filterTag = document.createElement("span");
            filterTag.textContent = filter;
            filterTag.classList.add("active-filter");

            const closeBtn = document.createElement("span");
            closeBtn.textContent = "✖";
            closeBtn.classList.add("remove-filter");
            closeBtn.addEventListener("click", () => {
                selectedFilters = selectedFilters.filter(f => f !== filter);
                updateFilters();
                filterJobs();
            });

            filterTag.appendChild(closeBtn);
            filterBar.appendChild(filterTag);
        });

        // Add Clear button if filters exist
        if (selectedFilters.length > 0) {
            const clearBtn = document.createElement("button");
            clearBtn.textContent = "Clear";
            clearBtn.classList.add("clear-filters");
            clearBtn.addEventListener("click", () => {
                selectedFilters = [];
                updateFilters();
                filterJobs();
            });
            filterBar.appendChild(clearBtn);
        }
    }

    // Function to filter jobs
    function filterJobs() {
        const filteredJobs = jobsData.filter(job => {
            const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
            return selectedFilters.every(filter => jobTags.includes(filter));
        });

        displayJobs(filteredJobs);
    }
});