import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react/jsx-runtime";

export default function AdminRoute({
    children,
}: {
    children: JSX.Element;
}) {
    const token = localStorage.getItem("token");

    if (!token)
        return <Navigate to="/login" />;

    const decoded: any = jwtDecode(token);

    const role =
        decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

        console.log("Role:", role);

    if (role !== "Admin")
        return <Navigate to="/dashboard" />;

    return children;
}