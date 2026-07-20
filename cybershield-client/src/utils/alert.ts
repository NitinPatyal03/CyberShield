import Swal from "sweetalert2";

export const confirmDelete = async () => {
  return await Swal.fire({
    title: "Delete User?",
    text: "This action cannot be undone.",
    icon: "warning",

    showCancelButton: true,

    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",

    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",

    reverseButtons: true,
  });
};

export const confirmBlock = async () => {
  return await Swal.fire({
    title: "Block User?",
    text: "User won't be able to login.",

    icon: "warning",

    showCancelButton: true,

    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",

    confirmButtonText: "Block",
  });
};

export const confirmLogout = async () => {
  return await Swal.fire({
    title: "Logout",

    text: "Do you want to logout?",

    icon: "question",

    showCancelButton: true,

    confirmButtonText: "Logout",

    confirmButtonColor: "#2563eb",

    cancelButtonText: "Cancel",
  });
};