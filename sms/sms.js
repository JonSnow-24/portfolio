let students = [];
let selectedPhoto = "";
let attendance = {};

/* =====================================================
   INLINE SEARCH TOGGLE
   ===================================================== */

function toggleInlineSearch() {
  const wrap = document.getElementById("inlineSearchWrap");
  const btn = document.getElementById("searchToggleBtn");
  const input = document.getElementById("searchInput");
  if (!wrap) return;
  const isOpen = wrap.classList.toggle("open");
  if (btn) btn.classList.toggle("active", isOpen);
  if (isOpen && input) {
    setTimeout(() => input.focus(), 200);
  } else if (input) {
    input.value = "";
    displayStudents();
  }
}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const notificationToggle = document.getElementById("notificationToggle");

  const notificationPanel = document.getElementById("notificationPanel");

  const attendanceHistoryModal = document.getElementById(
    "attendanceHistoryModal",
  );

  document.addEventListener("click", function (event) {
    if (!notificationPanel) return;

    const clickedInsidePanel = notificationPanel.contains(event.target);

    const clickedToggle =
      notificationToggle && notificationToggle.contains(event.target);

    if (!clickedInsidePanel && !clickedToggle) {
      notificationPanel.classList.remove("show");
    }

    if (attendanceHistoryModal && event.target === attendanceHistoryModal) {
      closeAttendanceHistoryPanel();
    }
  });

  loadStudents();
  loadAttendance();
  loadTheme();

  displayStudents();
  updateDashboard();

  renderAttendance();
  renderAttendanceHistory();

  /* ---------- Photo Upload ---------- */

  const photoInput = document.getElementById("studentPhoto");

  if (photoInput) {
    photoInput.addEventListener("change", handlePhotoUpload);
  }

  /* ---------- Student Form ---------- */

  const studentForm = document.getElementById("studentForm");

  if (studentForm) {
    studentForm.addEventListener("submit", saveStudent);
  }

  /* ---------- Modal ---------- */

  const modal = document.getElementById("studentModal");

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeForm();
      }
    });
  }

  /* ---------- Search ---------- */

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", displayStudents);
  }

  /* ---------- Course Filter ---------- */

  const courseFilter = document.getElementById("courseFilter");

  if (courseFilter) {
    courseFilter.addEventListener("change", displayStudents);
  }

  /* ---------- Hero Add Student Button ---------- */

  const addStudentButton = document.querySelector(".hero .primary-btn");

  if (addStudentButton) {
    addStudentButton.addEventListener("click", function (event) {
      event.preventDefault();

      openForm();
    });
  }
});

/* =====================================================
   LOAD STUDENTS
   ===================================================== */

function loadStudents() {
  try {
    const saved = localStorage.getItem("students");

    students = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(students)) {
      students = [];
    }
  } catch (error) {
    console.error("Error loading students:", error);

    students = [];
  }
}

/* =====================================================
   SAVE STUDENTS
   ===================================================== */

function saveStudents() {
  try {
    localStorage.setItem("students", JSON.stringify(students));

    return true;
  } catch (error) {
    console.error("LocalStorage error:", error);

    showToast("Storage full. Please use a smaller photo.");

    return false;
  }
}

/* =====================================================
   SIDEBAR
   ===================================================== */

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !overlay) return;

  sidebar.classList.toggle("open");

  overlay.classList.toggle("show");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");

  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !overlay) return;

  sidebar.classList.remove("open");

  overlay.classList.remove("show");
}

window.toggleSidebar = toggleSidebar;

window.closeSidebar = closeSidebar;

/* =====================================================
   ATTENDANCE HISTORY PANEL
   ===================================================== */

function openAttendanceHistoryPanel() {
  const modal = document.getElementById("attendanceHistoryModal");

  if (modal) {
    modal.classList.add("show");
  }

  renderAttendanceHistory();
}

function closeAttendanceHistoryPanel() {
  const modal = document.getElementById("attendanceHistoryModal");

  if (modal) {
    modal.classList.remove("show");
  }
}

window.openAttendanceHistoryPanel = openAttendanceHistoryPanel;

window.closeAttendanceHistoryPanel = closeAttendanceHistoryPanel;

/* =====================================================
   DARK MODE
   ===================================================== */

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  localStorage.setItem("darkMode", dark);

  updateThemeIcon();
}

function loadTheme() {
  const darkMode = localStorage.getItem("darkMode");

  if (darkMode === "true") {
    document.body.classList.add("dark");
  }

  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");

  if (!icon) return;

  if (document.body.classList.contains("dark")) {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
}

window.toggleDarkMode = toggleDarkMode;

/* =====================================================
   OPEN FORM
   ===================================================== */

function openForm() {
  const modal = document.getElementById("studentModal");

  const form = document.getElementById("studentForm");

  if (!modal || !form) {
    console.error("Student modal or form not found.");

    return;
  }

  /* Reset form */

  form.reset();

  /* Reset edit mode */

  const editIndex = document.getElementById("editIndex");

  if (editIndex) {
    editIndex.value = "";
  }

  /* Change title */

  const modalTitle = document.getElementById("modalTitle");

  if (modalTitle) {
    modalTitle.textContent = "Add New Student";
  }

  /* Reset photo */

  selectedPhoto = "";

  resetPhotoPreview();

  /* Show modal */

  modal.classList.add("show");
}

window.openForm = openForm;

/* =====================================================
   CLOSE FORM
   ===================================================== */

function closeForm() {
  const modal = document.getElementById("studentModal");

  if (!modal) return;

  modal.classList.remove("show");
}

window.closeForm = closeForm;

/* =====================================================
   PHOTO UPLOAD
   ===================================================== */

function handlePhotoUpload(event) {
  const file = event.target.files[0];

  if (!file) return;

  /* Check image */

  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file.");

    event.target.value = "";

    return;
  }

  /* Maximum 2 MB */

  if (file.size > 2 * 1024 * 1024) {
    showToast("Photo must be less than 2 MB.");

    event.target.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    selectedPhoto = event.target.result;

    showPhotoPreview(selectedPhoto);
  };

  reader.onerror = function () {
    showToast("Unable to read the photo.");
  };

  reader.readAsDataURL(file);
}

/* =====================================================
   PHOTO PREVIEW
   ===================================================== */

function showPhotoPreview(photo) {
  const preview = document.getElementById("photoPreview");

  const removeButton = document.getElementById("removePhotoBtn");

  if (!preview) return;

  preview.innerHTML = "";

  const image = document.createElement("img");

  image.src = photo;

  image.alt = "Student Photo";

  preview.appendChild(image);

  if (removeButton) {
    removeButton.classList.add("show");
  }
}

/* =====================================================
   RESET PHOTO
   ===================================================== */

function resetPhotoPreview() {
  const preview = document.getElementById("photoPreview");

  const removeButton = document.getElementById("removePhotoBtn");

  const input = document.getElementById("studentPhoto");

  if (preview) {
    preview.innerHTML = '<i class="fa-solid fa-user"></i>';
  }

  if (removeButton) {
    removeButton.classList.remove("show");
  }

  if (input) {
    input.value = "";
  }
}

/* =====================================================
   REMOVE PHOTO
   ===================================================== */

function removePhoto() {
  selectedPhoto = "";

  resetPhotoPreview();

  showToast("Photo removed.");
}

window.removePhoto = removePhoto;

/* =====================================================
   SAVE / UPDATE STUDENT
   ===================================================== */

function saveStudent(event) {
  event.preventDefault();

  const editIndexElement = document.getElementById("editIndex");

  const editIndex = editIndexElement ? editIndexElement.value : "";

  /* ---------- Get Form Data ---------- */

  const student = {
    id: document.getElementById("studentId").value.trim(),

    name: document.getElementById("studentName").value.trim(),

    gender: document.getElementById("gender").value,

    course: document.getElementById("course").value,

    semester: document.getElementById("semester").value,

    email: document.getElementById("email").value.trim(),

    phone: document.getElementById("phone").value.trim(),

    /* NEW */

    fatherName: document.getElementById("fatherName").value.trim(),

    motherName: document.getElementById("motherName").value.trim(),

    address: document.getElementById("address").value.trim(),

    dob: document.getElementById("dob").value,

    photo: selectedPhoto,
  };

  if (!student.course || !student.semester || !student.phone) {
    showToast("Course, semester and phone are required.");

    return;
  }

  /* ---------- Duplicate ID ---------- */

  const duplicate = students.some(function (item, index) {
    return (
      String(item.id || "").toLowerCase() === student.id.toLowerCase() &&
      index !== Number(editIndex)
    );
  });

  if (duplicate) {
    showToast("Student ID already exists.");

    return;
  }

  /* ---------- ADD ---------- */

  if (editIndex === "") {
    students.push(student);

    showToast("Student added successfully.");

    addNotification(
      `New student added: ${student.name || "Student"}`,
      `Student record for ${student.name || "this student"} has been saved successfully.`,
      "fa-user-plus",
      "blue",
    );
  } else {
    /* ---------- UPDATE ---------- */
    const index = Number(editIndex);

    if (Number.isInteger(index) && students[index]) {
      students[index] = student;

      showToast("Student updated successfully.");

      addNotification(
        `Student updated: ${student.name || "Student"}`,
        `Student record for ${student.name || "this student"} was updated successfully.`,
        "fa-pen-to-square",
        "purple",
      );
    } else {
      showToast("Unable to update student.");

      return;
    }
  }

  /* ---------- Save ---------- */

  if (!saveStudents()) {
    return;
  }

  displayStudents();

  renderAttendance();

  updateDashboard();

  closeForm();
}
/* =====================================================
   DISPLAY STUDENTS
   ===================================================== */

function displayStudents() {
  const table = document.getElementById("studentTable");

  const emptyMessage = document.getElementById("emptyMessage");

  if (!table || !emptyMessage) {
    return;
  }

  const searchInput = document.getElementById("searchInput");

  const courseFilter = document.getElementById("courseFilter");

  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const selectedCourse = courseFilter ? courseFilter.value : "all";

  /* Clear table */

  table.innerHTML = "";

  /* ---------- Filter Students ---------- */

  const filteredStudents = students

    .map(function (student, index) {
      return {
        student: student,

        index: index,
      };
    })

    .filter(function (item) {
      const student = item.student;

      const name = String(student.name || "").toLowerCase();

      const id = String(student.id || "").toLowerCase();

      const email = String(student.email || "").toLowerCase();

      const phone = String(student.phone || "").toLowerCase();

      const course = String(student.course || "").toLowerCase();

      const fatherName = String(student.fatherName || "").toLowerCase();

      const motherName = String(student.motherName || "").toLowerCase();

      const address = String(student.address || "").toLowerCase();

      const dob = String(student.dob || "").toLowerCase();

      const searchMatch =
        !search ||
        name.includes(search) ||
        id.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        course.includes(search) ||
        fatherName.includes(search) ||
        motherName.includes(search) ||
        address.includes(search) ||
        dob.includes(search);

      const courseMatch =
        selectedCourse === "all" ||
        String(student.course || "").toLowerCase() ===
          String(selectedCourse).toLowerCase();

      return searchMatch && courseMatch;
    });

  /* ---------- Empty State ---------- */

  if (filteredStudents.length === 0) {
    emptyMessage.style.display = "block";

    return;
  }

  emptyMessage.style.display = "none";

  /* ---------- Create Rows ---------- */

  filteredStudents.forEach(function (item) {
    const student = item.student;

    const index = item.index;

    const row = document.createElement("tr");

    /* =========================================
               SERIAL NUMBER
               ========================================= */

    const serialCell = document.createElement("td");

    serialCell.textContent = index + 1;

    /* =========================================
           PHOTO
   ========================================= */

    const photoCell = document.createElement("td");

    const photo = document.createElement("div");

    photo.className = "student-photo";

    if (student.photo) {
      const image = document.createElement("img");

      image.src = student.photo;
      image.alt = student.name || "Student";

      photo.appendChild(image);
    } else {
      photo.innerHTML = '<i class="fa-solid fa-user"></i>';
    }

    photoCell.appendChild(photo);

    /* =========================================
           STUDENT NAME
   ========================================= */

    const studentCell = document.createElement("td");

    const studentName = document.createElement("span");

    studentName.textContent = student.name || "—";

    studentCell.appendChild(studentName);

    /* =========================================
               ID
               ========================================= */

    const idCell = document.createElement("td");

    idCell.textContent = student.id || "";

    /* =========================================
               COURSE
               ========================================= */

    const courseCell = document.createElement("td");

    courseCell.textContent = student.course || "";

    /* =========================================
               SEMESTER
               ========================================= */

    const semesterCell = document.createElement("td");

    semesterCell.textContent = student.semester || "";

    /* =========================================
               GENDER
               ========================================= */

    const genderCell = document.createElement("td");

    genderCell.textContent = student.gender || "";

    /* =========================================
               EMAIL
               ========================================= */

    const emailCell = document.createElement("td");

    emailCell.textContent = student.email || "";

    /* =========================================
               PHONE
               ========================================= */

    const phoneCell = document.createElement("td");

    phoneCell.textContent = student.phone || "";

    /* =========================================
               FATHER NAME
               ========================================= */

    const fatherNameCell = document.createElement("td");

    fatherNameCell.textContent = student.fatherName || "";

    /* =========================================
               MOTHER NAME
               ========================================= */

    const motherNameCell = document.createElement("td");

    motherNameCell.textContent = student.motherName || "";

    /* =========================================
               ADDRESS
               ========================================= */

    const addressCell = document.createElement("td");

    addressCell.textContent = student.address || "";

    /* =========================================
               DOB
               ========================================= */

    const dobCell = document.createElement("td");

    dobCell.textContent = student.dob || "";

    /* =========================================
               ACTIONS
               ========================================= */

    const actionsCell = document.createElement("td");

    /* ---------- EDIT ---------- */

    const editButton = document.createElement("button");

    editButton.type = "button";

    editButton.className = "action-btn";

    editButton.title = "Edit";

    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';

    editButton.addEventListener("click", function () {
      editStudent(index);
    });

    /* ---------- DELETE ---------- */

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "action-btn delete";

    deleteButton.title = "Delete";

    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    deleteButton.addEventListener("click", function () {
      deleteStudent(index);
    });

    /* Add buttons */

    actionsCell.appendChild(editButton);

    actionsCell.appendChild(deleteButton);

    /* =================================================
               ADD ALL CELLS TO ROW
               ================================================= */

    row.appendChild(serialCell);

    row.appendChild(photoCell);

    row.appendChild(studentCell);

    row.appendChild(idCell);

    row.appendChild(courseCell);

    row.appendChild(semesterCell);

    row.appendChild(genderCell);

    row.appendChild(emailCell);

    row.appendChild(phoneCell);

    /* NEW COLUMNS */

    row.appendChild(fatherNameCell);

    row.appendChild(motherNameCell);

    row.appendChild(addressCell);

    row.appendChild(dobCell);

    row.appendChild(actionsCell);

    /* Add row to table */

    table.appendChild(row);
  });
}
/* =====================================================
   EDIT STUDENT
   ===================================================== */

function editStudent(index) {
  const student = students[index];

  if (!student) return;

  const modal = document.getElementById("studentModal");

  if (!modal) return;

  document.getElementById("modalTitle").textContent = "Edit Student";

  document.getElementById("editIndex").value = index;

  document.getElementById("studentId").value = student.id || "";

  document.getElementById("studentName").value = student.name || "";

  document.getElementById("gender").value = student.gender || "";

  document.getElementById("course").value = student.course || "";

  document.getElementById("semester").value = student.semester || "";

  document.getElementById("email").value = student.email || "";

  document.getElementById("phone").value = student.phone || "";

  /* ---------- NEW FIELDS ---------- */

  document.getElementById("fatherName").value = student.fatherName || "";

  document.getElementById("motherName").value = student.motherName || "";

  document.getElementById("address").value = student.address || "";

  document.getElementById("dob").value = student.dob || "";

  /* ---------- Photo ---------- */

  selectedPhoto = student.photo || "";

  if (selectedPhoto) {
    showPhotoPreview(selectedPhoto);
  } else {
    resetPhotoPreview();
  }

  modal.classList.add("show");
}

window.editStudent = editStudent;

/* =====================================================
   DELETE STUDENT
   ===================================================== */

function deleteStudent(index) {
  const student = students[index];

  if (!student) return;

  const confirmed = confirm(
    "Are you sure you want to delete " + student.name + "?",
  );

  if (!confirmed) return;

  students.splice(index, 1);

  if (!saveStudents()) {
    return;
  }

  /* Remove attendance */

  if (student.id) {
    Object.keys(attendance).forEach(function (date) {
      if (attendance[date] && attendance[date][student.id]) {
        delete attendance[date][student.id];
      }

      if (attendance[date] && Object.keys(attendance[date]).length === 0) {
        delete attendance[date];
      }
    });

    saveAttendance();
  }

  displayStudents();

  updateDashboard();

  renderAttendance();

  renderAttendanceHistory();

  showToast("Student deleted successfully.");

  addNotification(
    `Student deleted: ${student.name || "Student"}`,
    `Student record for ${student.name || "this student"} has been deleted.`,
    "fa-trash",
    "red",
  );
}

window.deleteStudent = deleteStudent;

/* =====================================================
   DASHBOARD
   ===================================================== */

function updateDashboard() {
  const totalStudents = document.getElementById("totalStudents");

  const totalCourses = document.getElementById("totalCourses");

  const maleStudents = document.getElementById("maleStudents");

  const femaleStudents = document.getElementById("femaleStudents");

  const courseStats = document.getElementById("courseStats");

  const courseCounts = new Map();

  students.forEach((student) => {
    const course = String(student.course || "").trim();

    if (!course) return;

    const courseKey = course.toLowerCase();
    const currentCourse = courseCounts.get(courseKey);

    courseCounts.set(courseKey, {
      name: currentCourse ? currentCourse.name : course,
      count: currentCourse ? currentCourse.count + 1 : 1,
    });
  });

  if (totalStudents) {
    totalStudents.textContent = students.length;
  }

  if (totalCourses) {
    totalCourses.textContent = courseCounts.size;
  }

  if (maleStudents) {
    maleStudents.textContent = students.filter(
      (student) => String(student.gender || "").toLowerCase() === "male",
    ).length;
  }

  if (femaleStudents) {
    femaleStudents.textContent = students.filter(
      (student) => String(student.gender || "").toLowerCase() === "female",
    ).length;
  }

  if (courseStats) {
    courseStats.replaceChildren();

    courseCounts.forEach(({ name, count }) => {
      const card = document.createElement("div");
      card.className = "stat-card course-stat-card";

      const icon = document.createElement("div");
      icon.className = "stat-icon green";
      icon.innerHTML = '<i class="fa-solid fa-laptop-code"></i>';

      const content = document.createElement("div");
      const label = document.createElement("span");
      label.textContent = `${name} Students`;

      const value = document.createElement("h3");
      value.textContent = count;

      content.append(label, value);
      card.append(icon, content);
      courseStats.appendChild(card);
    });
  }
}

/* =====================================================
   ATTENDANCE
   ===================================================== */

function loadAttendance() {
  try {
    const saved = localStorage.getItem("attendance");

    attendance = saved ? JSON.parse(saved) : {};

    if (typeof attendance !== "object" || attendance === null) {
      attendance = {};
    }
  } catch (error) {
    console.error("Error loading attendance:", error);

    attendance = {};
  }
}

function saveAttendance() {
  try {
    localStorage.setItem("attendance", JSON.stringify(attendance));

    return true;
  } catch (error) {
    console.error("Attendance storage error:", error);

    return false;
  }
}

/* =====================================================
   ATTENDANCE RENDER
   ===================================================== */

function renderAttendance() {
  const tableBody = document.getElementById("attendanceTableBody");

  if (!tableBody) return;

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance[today] || {};

  tableBody.innerHTML = "";

  /* ===============================
       ATTENDANCE COUNTS
       =============================== */

  const totalEl = document.getElementById("attendanceTotal");

  const presentEl = document.getElementById("attendancePresent");

  const absentEl = document.getElementById("attendanceAbsent");

  const lateEl = document.getElementById("attendanceLate");

  const presentCount = Object.values(todayAttendance).filter(
    (status) => status === "present",
  ).length;

  const absentCount = Object.values(todayAttendance).filter(
    (status) => status === "absent",
  ).length;

  const lateCount = Object.values(todayAttendance).filter(
    (status) => status === "late",
  ).length;

  if (totalEl) totalEl.textContent = students.length;

  if (presentEl) presentEl.textContent = presentCount;

  if (absentEl) absentEl.textContent = absentCount;

  if (lateEl) lateEl.textContent = lateCount;

  /* ===============================
       NO STUDENTS
       =============================== */

  if (students.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="4"
                    style="text-align:center; padding:25px;">
                    No students available.
                </td>
            </tr>
        `;

    return;
  }

  /* ===============================
       SHOW ALL STUDENTS
       =============================== */

  students.forEach(function (student, index) {
    // Default status = NIL
    const currentStatus = todayAttendance[student.id] || "nil";

    const row = document.createElement("tr");

    row.innerHTML = `

            <!-- NO. -->
            <td>
                ${index + 1}
            </td>


            <!-- STUDENT -->
            <td>

                <div class="student-info">

                    <div class="student-photo small-photo">

                        ${
                          student.photo
                            ? `
                                    <img
                                        src="${student.photo}"
                                        alt="${student.name || "Student"}"
                                    >
                                  `
                            : `
                                    <span>
                                        ${
                                          student.name
                                            ? student.name
                                                .split(" ")
                                                .map((word) => word.charAt(0))
                                                .join("")
                                                .substring(0, 2)
                                                .toUpperCase()
                                            : "ST"
                                        }
                                    </span>
                                  `
                        }

                    </div>


                    <div class="student-text">

                        <strong>
                            ${student.name || "Student"}
                        </strong>

                        <span>
                            ${student.id || "--"}
                        </span>

                    </div>

                </div>

            </td>


            <!-- STATUS -->
            <td>

                <span class="attendance-status ${currentStatus}">

                    ${
                      currentStatus === "nil"
                        ? "Not Marked"
                        : currentStatus.charAt(0).toUpperCase() +
                          currentStatus.slice(1)
                    }

                </span>

            </td>


            <!-- MARK BUTTONS -->
            <td>

                <div class="attendance-actions">

                    <button
                        type="button"
                        class="mark-btn present ${
                          currentStatus === "present" ? "active" : ""
                        }"
                        data-student-id="${student.id}"
                        data-status="present">

                        Present

                    </button>


                    <button
                        type="button"
                        class="mark-btn absent ${
                          currentStatus === "absent" ? "active" : ""
                        }"
                        data-student-id="${student.id}"
                        data-status="absent">

                        Absent

                    </button>


                    <button
                        type="button"
                        class="mark-btn late ${
                          currentStatus === "late" ? "active" : ""
                        }"
                        data-student-id="${student.id}"
                        data-status="late">

                        Late

                    </button>

                </div>

            </td>

        `;

    tableBody.appendChild(row);
  });

  /* ===============================
       BUTTON CLICK EVENTS
       =============================== */

  tableBody.querySelectorAll(".mark-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      const studentId = button.dataset.studentId;

      const status = button.dataset.status;

      setAttendance(studentId, status);
    });
  });
}

/* =====================================================
   SET ATTENDANCE
   ===================================================== */

function setAttendance(studentId, status) {
  const today = new Date().toISOString().split("T")[0];

  if (!attendance[today]) {
    attendance[today] = {};
  }

  attendance[today][studentId] = status;

  saveAttendance();

  renderAttendance();

  renderAttendanceHistory();

  showToast(`Attendance marked ${status}.`);
}

window.setAttendance = setAttendance;

/* =====================================================
   ATTENDANCE HISTORY
   ===================================================== */

function formatHistoryDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderAttendanceHistory() {
  const body = document.getElementById("attendanceHistoryBody");

  const dateFilter = document.getElementById("attendanceDateFilter");

  if (!body) return;

  body.innerHTML = "";

  let dates = Object.keys(attendance).sort().reverse();

  if (dateFilter && dateFilter.value) {
    dates = dates.filter((date) => date === dateFilter.value);
  }

  if (dates.length === 0) {
    body.innerHTML =
      '<tr><td colspan="4" class="empty-history">No attendance history available.</td></tr>';

    return;
  }

  dates.forEach(function (date) {
    const records = attendance[date] || {};

    students.forEach(function (student) {
      const status = records[student.id] || "nil";

      const row = document.createElement("tr");

      const dateCell = document.createElement("td");

      dateCell.textContent = formatHistoryDate(date);

      const studentCell = document.createElement("td");

      studentCell.textContent = student.name || "Student";

      const idCell = document.createElement("td");

      idCell.textContent = student.id || "--";

      const statusCell = document.createElement("td");

      const statusBadge = document.createElement("span");

      statusBadge.className = `attendance-status ${status}`;

      statusBadge.textContent =
        status === "nil"
          ? "Not Marked"
          : status.charAt(0).toUpperCase() + status.slice(1);

      statusCell.appendChild(statusBadge);

      row.appendChild(dateCell);

      row.appendChild(studentCell);

      row.appendChild(idCell);

      row.appendChild(statusCell);

      body.appendChild(row);
    });
  });
}

/* =====================================================
   NOTIFICATIONS
   ===================================================== */

let notifications = [];

function loadNotifications() {
  try {
    const saved = localStorage.getItem("notifications");

    notifications = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(notifications)) {
      notifications = [];
    }
  } catch (error) {
    console.error("Error loading notifications:", error);

    notifications = [];
  }
}

function saveNotifications() {
  try {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Notification storage error:", error);
  }
}

function addNotification(title, message, icon, type) {
  loadNotifications();

  notifications.unshift({
    title: title,

    message: message,

    icon: icon || "fa-bell",

    type: type || "blue",

    time: new Date().toISOString(),

    read: false,
  });

  /* Keep last 30 */

  notifications = notifications.slice(0, 30);

  saveNotifications();

  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById("notificationList");

  const badge = document.getElementById("notificationBadge");

  if (!container) return;

  loadNotifications();

  container.innerHTML = "";

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  if (badge) {
    badge.textContent = "";
    badge.style.display = unreadCount > 0 ? "block" : "none";
  }

  if (notifications.length === 0) {
    container.innerHTML =
      '<p class="empty-notifications">No notifications.</p>';

    return;
  }

  notifications.forEach(function (notification) {
    const item = document.createElement("div");

    item.className = `notification-item ${
      notification.read ? "read" : "unread"
    }`;

    const icon = document.createElement("div");

    icon.className = `notification-icon ${notification.type || "blue"}`;

    icon.innerHTML = `<i class="fa-solid ${
      notification.icon || "fa-bell"
    }"></i>`;

    const content = document.createElement("div");

    content.className = "notification-content";

    const title = document.createElement("strong");

    title.textContent = notification.title || "";

    const message = document.createElement("p");

    message.textContent = notification.message || "";

    const time = document.createElement("small");

    time.textContent = formatNotificationTime(notification.time);

    content.appendChild(title);

    content.appendChild(message);

    content.appendChild(time);

    item.appendChild(icon);

    item.appendChild(content);

    item.addEventListener("click", function () {
      notification.read = true;

      saveNotifications();

      renderNotifications();
    });

    container.appendChild(item);
  });
}

function formatNotificationTime(time) {
  if (!time) return "";

  const date = new Date(time);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${formattedTime} • ${formattedDate}`;
}

/* =====================================================
   NOTIFICATION PANEL
   ===================================================== */

function toggleNotificationPanel() {
  const panel = document.getElementById("notificationPanel");

  if (!panel) return;

  panel.classList.toggle("show");

  if (panel.classList.contains("show")) {
    renderNotifications();
  }
}

function markAllNotificationsRead() {
  loadNotifications();

  notifications.forEach(function (notification) {
    notification.read = true;
  });

  saveNotifications();

  renderNotifications();

  showToast("All notifications marked as read.");
}

function clearNotifications() {
  notifications = [];

  saveNotifications();

  renderNotifications();

  showToast("Notifications cleared.");
}

window.toggleNotificationPanel = toggleNotificationPanel;

window.markAllNotificationsRead = markAllNotificationsRead;

window.clearNotifications = clearNotifications;

/* =====================================================
   TOAST
   ===================================================== */

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");

    toast.id = "toast";

    toast.className = "toast";

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toast.hideTimer);

  toast.hideTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

/* =====================================================
   INITIAL NOTIFICATIONS LOAD
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  loadNotifications();

  renderNotifications();
});

/* =====================================================
   AUTO ATTENDANCE RESET - EVERY NIGHT AT 12:00 AM
   ===================================================== */

function scheduleAttendanceReset() {
  const now = new Date();

  const nextMidnight = new Date();

  nextMidnight.setHours(24, 0, 0, 0);

  const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

  setTimeout(function () {
    // New day:
    // all students remain visible
    // but their status becomes NIL
    renderAttendance();

    renderAttendanceHistory();

    // Schedule next midnight
    scheduleAttendanceReset();
  }, timeUntilMidnight);
}

scheduleAttendanceReset();
