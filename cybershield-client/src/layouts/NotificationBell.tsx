import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUnreadCount } from "../services/alertService";
export default function NotificationBell() {

    const [count, setCount] = useState(0);

    const loadUnread = async () => {
        try {
            const unread = await getUnreadCount();
            setCount(unread);
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        loadUnread();

        const interval = setInterval(loadUnread, 30000);

        return () => clearInterval(interval);

    }, []);

    return (
        <Link
            to="/alerts"
            className="relative"
        >
            <Bell className="w-6 h-6" />

            {count > 0 && (

                <span
                    className="absolute
                    -top-2
                    -right-2
                    bg-red-600
                    text-white
                    rounded-full
                    text-xs
                    px-2
                    py-0.5"
                >
                    {count}
                </span>

            )}
        </Link>
    );
}