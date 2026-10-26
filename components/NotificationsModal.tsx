"use client";

import React, { useState, useEffect } from "react";
import { Bell, Trash2, X, Loader2, CheckCircle2 } from "lucide-react";
import { etrolleyApi } from "@/lib/api";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWhiteTheme?: boolean;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  isWhiteTheme = false,
  onToast,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res: any = await etrolleyApi.getNotifications();
      const list = Array.isArray(res?.data)
        ? res.data
        : (res?.data?.data || []);
      setNotifications(list);
    } catch (err: any) {
      console.warn("Notifications fetch notice:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all notifications?")) return;
    setClearing(true);
    try {
      await etrolleyApi.clearAllNotifications();
      setNotifications([]);
      onToast("All notifications deleted successfully.", "success");
    } catch (err: any) {
      onToast(err?.message || "Could not clear notifications.", "error");
    } finally {
      setClearing(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    setDeletingId(id);
    try {
      await etrolleyApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => String(n.id) !== String(id)));
      onToast("Notification removed.", "success");
    } catch (err: any) {
      onToast(err?.message || "Could not delete notification.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-[4px] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-[540px] shadow-2xl rounded-[3px] border z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col ${
          isWhiteTheme
            ? "bg-[#ffffff] border-[#e0e0e0] text-[#222222]"
            : "bg-[#181818] border-[#333333] text-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isWhiteTheme ? "border-[#ececec] bg-[#f9f9f9]" : "border-[#2a2a2a] bg-[#141414]"
          }`}
        >
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-full bg-[#cca382]/20 text-[#cca382] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white tracking-wide">
                Notifications
              </h3>
              <p className="text-[11px] text-gray-400">
                {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearing}
                className="flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-[2px] bg-red-950/70 hover:bg-red-900 border border-red-800/60 text-red-200 transition-colors cursor-pointer"
                title="Delete all notifications"
              >
                {clearing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#cca382]" />
              <span>Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#2e2e2e] rounded-[4px] p-6 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-[#242424] text-gray-500 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-semibold text-gray-300 mb-1">No Notifications</h4>
              <p className="text-xs text-gray-500">You are all caught up with your latest updates.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((notif: any) => {
                const notifId = notif.id || notif._id;
                const isDeleting = deletingId === notifId;

                return (
                  <div
                    key={notifId}
                    className="p-3.5 bg-[#141414] border border-[#262626] rounded-[3px] hover:border-[#383838] transition-colors relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#cca382] shrink-0" />
                          <h5 className="text-[13px] font-semibold text-white truncate">
                            {notif.title || notif.subject || "Notification"}
                          </h5>
                        </div>
                        <p className="text-[12px] text-gray-300 leading-relaxed break-words pl-4 rtl:pl-0 rtl:pr-4">
                          {notif.body || notif.message || notif.text}
                        </p>
                        {notif.created_at && (
                          <span className="inline-block text-[10px] text-gray-500 mt-1 pl-4 rtl:pl-0 rtl:pr-4">
                            {notif.created_at}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(notifId)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded hover:bg-[#202020] shrink-0"
                        title="Delete this notification"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
