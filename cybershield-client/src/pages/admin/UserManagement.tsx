import { useEffect, useMemo, useState } from "react";
import type { User } from "../../types/user";

import {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
  makeAdmin,
  makeUser,
} from "../../services/adminService";
import { toast } from "react-hot-toast";
import { confirmDelete } from "../../utils/alert";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text = search.toLowerCase();

      return (
        u.firstName.toLowerCase().includes(text) ||
        u.lastName.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text)
      );
    });
  }, [users, search]);

    const handleBlock = async (id: string) => {

    try {

        await blockUser(id);

        await loadUsers();

    } catch {

        toast.error("Unable to block user.");

    }

};

  const handleUnblock = async (id: string) => {

    try {

        await unblockUser(id);

        await loadUsers();

    } catch {

        toast.error("Unable to unblock user.");

    }

};

  const handleDelete = async (id: string) => {

    const result = await confirmDelete();

if (!result.isConfirmed)
    return;

    try {

        await deleteUser(id);

        await loadUsers();

    } catch (err) {

        console.error(err);

        toast.error("Unable to delete user.");

    }
};

  const handleMakeAdmin = async (id: string) => {

    try {

        await makeAdmin(id);

        await loadUsers();

    } catch {

        toast.error("Unable to promote user.");

    }

};

  const handleMakeUser = async (id: string) => {

    try {

        await makeUser(id);

        await loadUsers();

    } catch {

        toast.error("Unable to change role.");

    }

};
    if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Users...
        </h2>
      </div>
    );
  }

  return (
  <div className="space-y-8">

    {/* Header */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          User Management
        </h1>

        <p className="mt-2 text-slate-500">
          Manage users, roles and account status.
        </p>
      </div>

      <button
        onClick={loadUsers}
        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
      >
        Refresh
      </button>

    </div>

        <div className="rounded-xl bg-white p-6 shadow">

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
      />

    </div>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-slate-500">
            Total Users
        </h3>

        <p className="mt-3 text-4xl font-bold">
            {users.length}
        </p>
    </div>

    <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-slate-500">
            Active Users
        </h3>

        <p className="mt-3 text-4xl font-bold text-green-600">
            {users.filter(x => x.isActive).length}
        </p>
    </div>

    <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-slate-500">
            Blocked Users
        </h3>

        <p className="mt-3 text-4xl font-bold text-red-600">
            {users.filter(x => !x.isActive).length}
        </p>
    </div>

    <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-slate-500">
            Admins
        </h3>

        <p className="mt-3 text-4xl font-bold text-blue-600">
            {users.filter(x => x.role === "Admin").length}
        </p>
    </div>

</div>

<div className="overflow-hidden rounded-xl bg-white shadow">

    <div className="overflow-x-auto">

        <table className="min-w-full">

            <thead className="bg-slate-100">

                <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                        Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                        Role
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                        Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                        Created
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody>{
filteredUsers.length === 0 ? (

<tr>

<td
colSpan={6}
className="py-12 text-center text-slate-500"
>

No users found.

</td>

</tr>

) : (

filteredUsers.map((user) => (

<tr
key={user.id}
className="border-t hover:bg-slate-50 transition"
>

<td className="px-6 py-5">

<div className="font-semibold">

{user.firstName} {user.lastName}

</div>

</td>

<td className="px-6 py-5">

{user.email}

</td>
<td className="px-6 py-5">

<span
className={`rounded-full px-3 py-1 text-xs font-bold

${
user.role === "Admin"

? "bg-purple-100 text-purple-700"

: "bg-blue-100 text-blue-700"

}`}

>

{user.role}

</span>

</td>
<td className="px-6 py-5">

<span
className={`rounded-full px-3 py-1 text-xs font-bold

${
user.isActive

? "bg-green-100 text-green-700"

: "bg-red-100 text-red-700"

}`}

>

{user.isActive ? "Active" : "Blocked"}

</span>

</td>
<td className="px-6 py-5">

{new Date(user.createdAt).toLocaleDateString()}

</td>
<td className="px-6 py-5">

<div className="flex flex-wrap justify-center gap-2">

    {/* Block / Unblock */}

    {
        user.isActive ? (

            <button
                onClick={() => handleBlock(user.id)}
                className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
                Block
            </button>

        ) : (

            <button
                onClick={() => handleUnblock(user.id)}
                className="rounded bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
                Unblock
            </button>

        )
    }

    {/* Admin / User */}

    {
        user.role === "User" ? (

            <button
                onClick={() => handleMakeAdmin(user.id)}
                className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Make Admin
            </button>

        ) : (

            <button
                onClick={() => handleMakeUser(user.id)}
                className="rounded bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
                Make User
            </button>

        )
    }

    {/* Delete */}

    <button
        onClick={() => handleDelete(user.id)}
        className="rounded bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black"
    >
        Delete
    </button>

</div>

</td>

</tr>

))

)
}
            </tbody>

        </table>

    </div>

</div>

</div>
);
}