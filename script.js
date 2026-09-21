// ========================================
// HEALTHDESK JAVASCRIPT
// PART 3
// LOGIN + SIGN UP + APPOINTMENTS
// ========================================


// ========================================
// LOGIN / SIGN UP ELEMENTS
// ========================================

const loginSection =
    document.getElementById("loginSection");

const signupSection =
    document.getElementById("signupSection");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");


// ========================================
// SWITCH TO SIGN UP
// ========================================

if (showSignup) {

    showSignup.addEventListener("click", function () {

        loginSection.classList.add("hidden");

        signupSection.classList.remove("hidden");

    });

}


// ========================================
// SWITCH TO LOGIN
// ========================================

if (showLogin) {

    showLogin.addEventListener("click", function () {

        signupSection.classList.add("hidden");

        loginSection.classList.remove("hidden");

    });

}


// ========================================
// SIGN UP
// ========================================

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("signupName").value;

            const studentId =
                document.getElementById("signupStudentId").value;

            const email =
                document.getElementById("signupEmail").value;

            const password =
                document.getElementById("signupPassword").value;


            // Get existing users

            let users =
                JSON.parse(
                    localStorage.getItem("healthdeskUsers")
                ) || [];


            // Check if email already exists

            const existingUser =
                users.find(function (user) {

                    return user.email === email;

                });


            if (existingUser) {

                alert(
                    "An account with this email already exists."
                );

                return;

            }


            // Create new user

            const newUser = {

                name: name,

                studentId: studentId,

                email: email,

                password: password

            };


            // Save user

            users.push(newUser);


            localStorage.setItem(
                "healthdeskUsers",
                JSON.stringify(users)
            );


            alert(
                "Account created successfully! You can now login."
            );


            // Clear form

            signupForm.reset();


            // Return to login

            signupSection.classList.add("hidden");

            loginSection.classList.remove("hidden");

        }
    );

}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;


            // Get users

            const users =
                JSON.parse(
                    localStorage.getItem("healthdeskUsers")
                ) || [];


            // Find matching user

            const user =
                users.find(function (account) {

                    return (
                        account.email === email &&
                        account.password === password
                    );

                });


            if (!user) {

                alert(
                    "Incorrect email or password."
                );

                return;

            }


            // Save logged-in user

            localStorage.setItem(
                "healthdeskCurrentUser",
                JSON.stringify(user)
            );


            // Go to dashboard

            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "healthdeskCurrentUser"
            );


            alert(
                "You have been logged out."
            );


            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// CHECK LOGIN
// ========================================

const currentUser =
    JSON.parse(
        localStorage.getItem("healthdeskCurrentUser")
    );


// Pages that require login

const protectedPages = [

    "dashboard.html",

    "appointment.html",

    "appointments.html"

];


const currentPage =
    window.location.pathname
        .split("/")
        .pop();


if (
    protectedPages.includes(currentPage) &&
    !currentUser
) {

    window.location.href =
        "index.html";

}


// ========================================
// SHOW USER NAME ON DASHBOARD
// ========================================

const welcomeTitle =
    document.querySelector(".welcome-section h1");


if (
    welcomeTitle &&
    currentUser
) {

    welcomeTitle.textContent =
        "Welcome, " + currentUser.name + " 👋";

}


// ========================================
// APPOINTMENT FORM
// ========================================

const appointmentForm =
    document.getElementById("appointmentForm");


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // Make sure user is logged in

            if (!currentUser) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "index.html";

                return;

            }


            const appointmentDate =
                document.getElementById(
                    "appointmentDate"
                ).value;


            const appointmentTime =
                document.getElementById(
                    "appointmentTime"
                ).value;


            const reason =
                document.getElementById(
                    "reason"
                ).value;


            const notes =
                document.getElementById(
                    "notes"
                ).value;


            const appointment = {

                id: Date.now(),

                studentName:
                    currentUser.name,

                studentId:
                    currentUser.studentId,

                email:
                    currentUser.email,

                date:
                    appointmentDate,

                time:
                    appointmentTime,

                reason:
                    reason,

                notes:
                    notes,

                status:
                    "Pending"

            };


            let appointments =
                JSON.parse(
                    localStorage.getItem(
                        "healthdeskAppointments"
                    )
                ) || [];


            appointments.push(
                appointment
            );


            localStorage.setItem(
                "healthdeskAppointments",
                JSON.stringify(appointments)
            );


            alert(
                "Appointment requested successfully!"
            );


            appointmentForm.reset();


            window.location.href =
                "appointments.html";

        }
    );

}


// ========================================
// DISPLAY APPOINTMENTS
// ========================================

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );


if (appointmentsList) {

    let appointments =
        JSON.parse(
            localStorage.getItem(
                "healthdeskAppointments"
            )
        ) || [];


    // Only show appointments belonging
    // to the logged-in student

    if (currentUser) {

        appointments =
            appointments.filter(
                function (appointment) {

                    return (
                        appointment.email ===
                        currentUser.email
                    );

                }
            );

    }


    // No appointments

    if (appointments.length === 0) {

        appointmentsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>No Appointments Yet</h2>

                <p>
                    You haven't booked a clinic appointment yet.
                </p>

                <a
                    href="appointment.html"
                    class="btn primary-btn">

                    Book an Appointment

                </a>

            </div>

        `;

    }


    // Display appointments

    else {

        appointmentsList.innerHTML = "";


        appointments.forEach(
            function (appointment) {

                const appointmentCard =
                    document.createElement(
                        "div"
                    );


                appointmentCard.className =
                    "appointment-card";


                appointmentCard.innerHTML = `

                    <div class="appointment-header">

                        <h2>
                            🩺 Clinic Appointment
                        </h2>

                        <span class="appointment-status">

                            ${appointment.status}

                        </span>

                    </div>


                    <div class="appointment-details">

                        <p>
                            <strong>Date:</strong>
                            ${appointment.date}
                        </p>

                        <p>
                            <strong>Time:</strong>
                            ${appointment.time}
                        </p>

                        <p>
                            <strong>Reason:</strong>
                            ${appointment.reason}
                        </p>

                        ${
                            appointment.notes
                            ?
                            `
                            <p>
                                <strong>Notes:</strong>
                                ${appointment.notes}
                            </p>
                            `
                            :
                            ""
                        }

                    </div>


                    <button
                        class="cancel-btn"
                        onclick="
                            cancelAppointment(
                                ${appointment.id}
                            )
                        ">

                        Cancel Appointment

                    </button>

                `;


                appointmentsList.appendChild(
                    appointmentCard
                );

            }
        );

    }

}


// ========================================
// CANCEL APPOINTMENT
// ========================================

function cancelAppointment(id) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!confirmCancel) {

        return;

    }


    let appointments =
        JSON.parse(
            localStorage.getItem(
                "healthdeskAppointments"
            )
        ) || [];


    appointments =
        appointments.filter(
            function (appointment) {

                return appointment.id !== id;

            }
        );


    localStorage.setItem(
        "healthdeskAppointments",
        JSON.stringify(appointments)
    );


    location.reload();

}
/* =========================
   ADMIN DASHBOARD
========================= */

const adminAppointmentsContainer =
    document.getElementById("adminAppointments");

if (adminAppointmentsContainer) {

    loadAdminAppointments();

}


function loadAdminAppointments() {

    const appointments =
        JSON.parse(
            localStorage.getItem("healthdeskAppointments")
        ) || [];


    const total =
        document.getElementById("adminTotal");

    const pending =
        document.getElementById("adminPending");

    const approved =
        document.getElementById("adminApproved");


    if (total) {
        total.textContent = appointments.length;
    }


    if (pending) {

        pending.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Pending"
            ).length;

    }


    if (approved) {

        approved.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Approved"
            ).length;

    }


    if (!adminAppointmentsContainer) {
        return;
    }


    if (appointments.length === 0) {

        adminAppointmentsContainer.innerHTML = `

            <div class="empty-dashboard">

                <span>📋</span>

                <p>
                    No student appointments yet.
                </p>

            </div>

        `;

        return;
    }


    adminAppointmentsContainer.innerHTML = "";


    appointments.forEach(appointment => {

        const card =
            document.createElement("div");

        card.className =
            "admin-appointment";


        const statusClass =
            appointment.status
                .toLowerCase()
                .replace(" ", "-");


        card.innerHTML = `

            <div class="admin-appointment-header">

                <h3>
                    ${appointment.studentName}
                </h3>

                <span class="admin-status status-${statusClass}">
                    ${appointment.status}
                </span>

            </div>


            <div class="admin-details">

                <div>
                    <strong>Student ID:</strong>
                    ${appointment.studentId}
                </div>

                <div>
                    <strong>Email:</strong>
                    ${appointment.email}
                </div>

                <div>
                    <strong>Date:</strong>
                    ${appointment.date}
                </div>

                <div>
                    <strong>Time:</strong>
                    ${appointment.time}
                </div>

                <div>
                    <strong>Reason:</strong>
                    ${appointment.reason}
                </div>

                <div>
                    <strong>Notes:</strong>
                    ${appointment.notes || "None"}
                </div>

            </div>


            <div class="admin-actions">

                ${
                    appointment.status === "Pending"
                    ? `
                        <button
                            class="approve-btn"
                            onclick="updateAppointmentStatus(${appointment.id}, 'Approved')">
                            ✓ Approve
                        </button>

                        <button
                            class="reject-btn"
                            onclick="updateAppointmentStatus(${appointment.id}, 'Rejected')">
                            ✕ Reject
                        </button>
                    `
                    : ""
                }


                ${
                    appointment.status === "Approved"
                    ? `
                        <button
                            class="complete-btn"
                            onclick="updateAppointmentStatus(${appointment.id}, 'Completed')">
                            ✓ Mark Completed
                        </button>
                    `
                    : ""
                }

            </div>

        `;


        adminAppointmentsContainer.appendChild(card);

    });

}


/* UPDATE APPOINTMENT STATUS */

function updateAppointmentStatus(id, newStatus) {

    let appointments =
        JSON.parse(
            localStorage.getItem("healthdeskAppointments")
        ) || [];


    appointments =
        appointments.map(appointment => {

            if (appointment.id === id) {

                appointment.status =
                    newStatus;

            }

            return appointment;

        });


    localStorage.setItem(
        "healthdeskAppointments",
        JSON.stringify(appointments)
    );


    loadAdminAppointments();

}