// STORAGE
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editingIndex = null;

function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

// STATS
function updateStats() {
    document.getElementById("total").innerText = jobs.length;
    document.getElementById("applied").innerText = jobs.filter(j => j.status === "Applied").length;
    document.getElementById("interview").innerText = jobs.filter(j => j.status === "Interview").length;
    document.getElementById("offer").innerText = jobs.filter(j => j.status === "Offer").length;
    document.getElementById("rejected").innerText = jobs.filter(j => j.status === "Rejected").length;
    updateCharts();
}

// RENDER JOBS
function renderJobs(filteredJobs = null) {
    const list = document.getElementById("jobList");
    const displayJobs = filteredJobs || jobs;
    
    if (displayJobs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No applications yet</h3>
                <p>Start tracking your job applications by adding your first one above!</p>
            </div>
        `;
        updateStats();
        return;
    }

    list.innerHTML = "";
    displayJobs.forEach((job, index) => {
        const actualIndex = filteredJobs ? jobs.indexOf(job) : index;
        const div = document.createElement("div");
        div.className = "job-card";
        div.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-company">${job.company}</div>
                    <div class="job-role">${job.role}</div>
                </div>
                <span class="status-badge ${job.status}" onclick="changeStatus(${actualIndex})">${job.status}</span>
            </div>
            <div class="job-details">
                ${job.location ? `<div class="job-detail-item">📍 ${job.location}</div>` : ''}
                ${job.salary ? `<div class="job-detail-item">💰 ${job.salary}</div>` : ''}
                ${job.dateApplied ? `<div class="job-detail-item">📅 ${job.dateApplied}</div>` : ''}
            </div>
            ${job.notes ? `<div class="job-notes">📝 ${job.notes}</div>` : ''}
            <div class="job-actions">
                <button onclick="editJob(${actualIndex})">✏️ Edit</button>
                <button onclick="deleteJob(${actualIndex})" class="btn-secondary">🗑️ Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
    updateStats();
}

// ADD OR EDIT
function addJob() {
    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const location = document.getElementById("location").value.trim();
    const salary = document.getElementById("salary").value.trim();
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value.trim();
    const dateApplied = document.getElementById("dateApplied").value;

    if (!company || !role) {
        alert("⚠️ Company and Role are required!");
        return;
    }

    const jobData = { company, role, location, salary, status, notes, dateApplied };

    if (editingIndex !== null) {
        jobs[editingIndex] = jobData;
        editingIndex = null;
        document.getElementById("formTitle").innerText = "Add New Application";
        document.getElementById("cancelBtn").style.display = "none";
    } else {
        jobs.unshift(jobData);
    }

    saveJobs();
    renderJobs();
    clearForm();
}

function clearForm() {
    document.getElementById("company").value = "";
    document.getElementById("role").value = "";
    document.getElementById("location").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("status").value = "Applied";
    document.getElementById("notes").value = "";
    document.getElementById("dateApplied").value = "";
}

function cancelEdit() {
    editingIndex = null;
    clearForm();
    document.getElementById("formTitle").innerText = "Add New Application";
    document.getElementById("cancelBtn").style.display = "none";
}

// DELETE
function deleteJob(index) {
    if (confirm("🗑️ Are you sure you want to delete this application?")) {
        jobs.splice(index, 1);
        saveJobs();
        renderJobs();
    }
}

// EDIT
function editJob(index) {
    const job = jobs[index];
    document.getElementById("company").value = job.company;
    document.getElementById("role").value = job.role;
    document.getElementById("location").value = job.location || "";
    document.getElementById("salary").value = job.salary || "";
    document.getElementById("status").value = job.status;
    document.getElementById("notes").value = job.notes || "";
    document.getElementById("dateApplied").value = job.dateApplied || "";
    
    editingIndex = index;
    document.getElementById("formTitle").innerText = "Edit Application";
    document.getElementById("cancelBtn").style.display = "inline-block";
    
    document.getElementById("dashboard").scrollIntoView({ behavior: 'smooth' });
}

// CHANGE STATUS
function changeStatus(index) {
    const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];
    let current = jobs[index].status;
    let next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    jobs[index].status = next;
    saveJobs();
    renderJobs();
}

// SEARCH
function searchJobs() {
    const term = document.getElementById("searchBox").value.toLowerCase();
    const filtered = jobs.filter(j => 
        j.company.toLowerCase().includes(term) || 
        j.role.toLowerCase().includes(term) || 
        (j.location && j.location.toLowerCase().includes(term))
    );
    renderJobs(filtered);
}

// FILTER
function filterJobs() {
    const status = document.getElementById("filterStatus").value;
    if (!status) {
        renderJobs();
        return;
    }
    const filtered = jobs.filter(j => j.status === status);
    renderJobs(filtered);
}

// CHARTS
let pieChart, barChart;
function updateCharts() {
    const wishlist = jobs.filter(j => j.status === "Wishlist").length;
    const applied = jobs.filter(j => j.status === "Applied").length;
    const interview = jobs.filter(j => j.status === "Interview").length;
    const offer = jobs.filter(j => j.status === "Offer").length;
    const rejected = jobs.filter(j => j.status === "Rejected").length;

    const pieData = {
        labels: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
        datasets: [{
            data: [wishlist, applied, interview, offer, rejected],
            backgroundColor: [
                "rgba(106, 27, 154, 0.8)",
                "rgba(21, 101, 192, 0.8)",
                "rgba(255, 152, 0, 0.8)",
                "rgba(76, 175, 80, 0.8)",
                "rgba(244, 67, 54, 0.8)"
            ],
            borderColor: [
                "rgba(106, 27, 154, 1)",
                "rgba(21, 101, 192, 1)",
                "rgba(255, 152, 0, 1)",
                "rgba(76, 175, 80, 1)",
                "rgba(244, 67, 54, 1)"
            ],
            borderWidth: 3,
            hoverOffset: 15,
            hoverBorderWidth: 4
        }]
    };

    const barData = {
        labels: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
        datasets: [{
            label: "Applications",
            data: [wishlist, applied, interview, offer, rejected],
            backgroundColor: [
                "rgba(106, 27, 154, 0.85)",
                "rgba(21, 101, 192, 0.85)",
                "rgba(255, 152, 0, 0.85)",
                "rgba(76, 175, 80, 0.85)",
                "rgba(244, 67, 54, 0.85)"
            ],
            borderColor: [
                "rgba(106, 27, 154, 1)",
                "rgba(21, 101, 192, 1)",
                "rgba(255, 152, 0, 1)",
                "rgba(76, 175, 80, 1)",
                "rgba(244, 67, 54, 1)"
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
        }]
    };

    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    const ctxPie = document.getElementById("pieChart").getContext("2d");
    const ctxBar = document.getElementById("barChart").getContext("2d");

    pieChart = new Chart(ctxPie, {
        type: "doughnut",
        data: pieData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    position: "bottom",
                    labels: {
                        padding: 15,
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });

    barChart = new Chart(ctxBar, {
        type: "bar",
        data: barData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { 
                        stepSize: 1,
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        color: '#667eea'
                    },
                    grid: {
                        color: 'rgba(102, 126, 234, 0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        color: '#2c3e50'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// INIT
renderJobs();