"use client";
import { useFirebaseNotifications } from "@/hooks/usePermission";

function FMS_Provider() {
  useFirebaseNotifications();
  return null;
}

export default FMS_Provider;
