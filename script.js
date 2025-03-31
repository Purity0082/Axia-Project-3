let jobs = [];
let activeFilters = [];

const jobContainer = document.getElementById("jobContainer");
const filterBar = document.getElementById("filterBar");


async function fetchData() {
    try {
        const res = await fetch("data.json"); 
        jobs = await res.json(); 
        renderJobs();
    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}


function renderJobs() {
    jobContainer.innerHTML = "";
    
    
    const filteredJobs = jobs.filter(job =>
        activeFilters.every(tag =>
            [job.role, job.level, ...job.languages, ...job.tools].includes(tag)
        )
    );

    
    filteredJobs.forEach(job => {
        const jobEl = document.createElement("div");
        jobEl.classList.add("job-listing");
        jobEl.innerHTML = `
            <div>
                <h3>${job.position}</h3>
                <p>${job.company}</p>
            </div>
            <div class="job-tags">
                ${[job.role, job.level, ...job.languages, ...job.tools]
                    .map(tag => `<span onclick="addFilter('${tag}')">${tag}</span>`).join(" ")}
            </div>
        `;
        jobContainer.appendChild(jobEl);
    });

    
    if (activeFilters.length > 0) {
        filterBar.innerHTML += `<button class="clear-filters" onclick="clearFilters()">Clear Filters</button>`;
    }
}


function addFilter(tag) {
    if (!activeFilters.includes(tag)) {
        activeFilters.push(tag);
        renderFilters();
        renderJobs();
    }
}


function removeFilter(tag) {
    activeFilters = activeFilters.filter(f => f !== tag);
    renderFilters();
    renderJobs();
}


function renderFilters() {
    filterBar.innerHTML = activeFilters.map(tag =>
        `<span onclick="removeFilter('${tag}')">${tag} ✖</span>`
    ).join(" ");
}


function clearFilters() {
    activeFilters = [];
    renderFilters();
    renderJobs();
}


fetchData();