import type { Metadata } from "next";
import AdminClient from "@/components/admin/AdminClient";

export const metadata: Metadata = {
  title: "Admin · Nocturne Kitchen & Bar",
  description: "Staff dashboard for managing the Nocturne menu.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
