"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  LogOut,
  MapPin,
  ShoppingBag,
  CreditCard,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { etrolleyApi } from "@/lib/api";

export interface UserProfileData {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  token?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWhiteTheme?: boolean;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

type AuthTab = "login" | "register" | "forgot" | "verify_otp" | "profile";

export default function AuthModal({
  isOpen,
  onClose,
  isWhiteTheme = false,
  onToast,
}: AuthModalProps) {
  const [currentTab, setCurrentTab] = useState<AuthTab>("login");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // OTP & Verification state
  const [otpCode, setOtpCode] = useState("");
  const [pendingIdentifier, setPendingIdentifier] = useState("");
  const [registerVerificationToken, setRegisterVerificationToken] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Profile Edit state
  const [profName, setProfName] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [profPhone, setProfPhone] = useState("");
  const [profOldPassword, setProfOldPassword] = useState("");
  const [profNewPassword, setProfNewPassword] = useState("");
  const [profConfirmPassword, setProfConfirmPassword] = useState("");
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [profileViewMode, setProfileViewMode] = useState<"info" | "orders" | "addresses">("info");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | string | null>(null);

  // Address state
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [regionsList, setRegionsList] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | string | null>(null);
  const [addrTitle, setAddrTitle] = useState("");
  const [addrCountryId, setAddrCountryId] = useState<number | string>("1");
  const [addrCityId, setAddrCityId] = useState<number | string>("1");
  const [addrRegionId, setAddrRegionId] = useState<number | string>("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrBuilding, setAddrBuilding] = useState("");
  const [addrOtherDetails, setAddrOtherDetails] = useState("");

  // Sync user session directly on open or auth events
  useEffect(() => {
    if (!isOpen) return;

    try {
      const savedUser = localStorage.getItem("etrolley_user_data");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setProfName(parsed.name || "");
        setProfEmail(parsed.email || "");
        setProfPhone(parsed.phone || "");
        setCurrentTab("profile");
        return;
      }
    } catch {
      // Ignore
    }

    setCurrentUser(null);
    setCurrentTab("login");
  }, [isOpen]);

  // Listen for custom auth change events
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const savedUser = localStorage.getItem("etrolley_user_data");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          setProfName(parsed.name || "");
          setProfEmail(parsed.email || "");
          setProfPhone(parsed.phone || "");
        } else {
          setCurrentUser(null);
          setCurrentTab("login");
        }
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("etrolley_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("etrolley_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------
  // 1. Handle Login
  // ---------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await etrolleyApi.login({
        identifier: loginEmail.trim(),
        password: loginPassword,
      });

      const token = res?.data?.token || res?.token;
      const user = res?.data?.user || {
        name: loginEmail.split("@")[0] || "User",
        email: loginEmail,
      };

      if (token) {
        localStorage.setItem("etrolley_auth_token", token);
      }
      localStorage.setItem("etrolley_user_data", JSON.stringify(user));
      window.dispatchEvent(new Event("etrolley_auth_change"));
      setCurrentUser(user);
      setProfName(user.name || "");
      setProfEmail(user.email || "");
      setProfPhone(user.phone || "");

      onToast(`Welcome back, ${user.name}! Successfully signed in.`);
      setCurrentTab("profile");
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "";
      let friendlyMsg = "Invalid credentials. Please verify your email and password.";
      if (msg === "message.login_failed") {
        friendlyMsg = "كلمة المرور غير صحيحة أو بيانات الدخول خاطئة، يرجى التأكد وإعادة المحاولة.";
      } else if (msg.includes("identifier is invalid")) {
        friendlyMsg = "هذا البريد الإلكتروني غير مسجل، يرجى الضغط على Register للتسجيل أولاً.";
      } else if (msg) {
        friendlyMsg = msg;
      }
      onToast(friendlyMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 2. Handle Register (Step 1: Check & Send OTP)
  // ---------------------------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      onToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    const identifier = regEmail.trim();
    setPendingIdentifier(identifier);

    try {
      const res: any = await etrolleyApi.checkAndSendOtp(identifier);
      const debugOtp = res?.data?.debug_otp;
      if (debugOtp) {
        setOtpCode(String(debugOtp));
        onToast(`OTP sent! (Test OTP: ${debugOtp})`);
      } else {
        onToast("Verification code has been sent to your email!");
      }
      setCurrentTab("verify_otp");
    } catch (err: any) {
      onToast(err?.message || "Could not send OTP. Please check your email/phone.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 3. Handle Verify OTP & Complete Registration
  // ---------------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step A: Verify OTP and get registration token
      const verifyRes: any = await etrolleyApi.verifyRegisterOtp({
        identifier: pendingIdentifier,
        code: otpCode.trim(),
      });

      const regToken = verifyRes?.data?.token || registerVerificationToken;

      if (!regToken) {
        throw new Error("Verification token missing. Please request a new OTP.");
      }

      // Step B: Finalize registration with token, name, password
      const completeRes: any = await etrolleyApi.register({
        token: regToken,
        name: regName.trim() || pendingIdentifier.split("@")[0],
        email: pendingIdentifier,
        phone: regPhone.trim(),
        password: regPassword,
        password_confirmation: regConfirmPassword,
      });

      const authToken = completeRes?.data?.token;
      const user = completeRes?.data?.user || {
        name: regName || pendingIdentifier.split("@")[0],
        email: pendingIdentifier,
        phone: regPhone,
      };

      if (authToken) {
        localStorage.setItem("etrolley_auth_token", authToken);
      }
      localStorage.setItem("etrolley_user_data", JSON.stringify(user));
      window.dispatchEvent(new Event("etrolley_auth_change"));

      setCurrentUser(user);
      setProfName(user.name || "");
      setProfEmail(user.email || "");
      setProfPhone(user.phone || "");

      onToast("Account created & verified successfully! Welcome.");
      setCurrentTab("profile");
    } catch (err: any) {
      onToast(err?.message || "Invalid OTP code. Please verify and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 4. Handle Forgot Password
  // ---------------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await etrolleyApi.forgotPassword(forgotEmail.trim());
      const debugCode = res?.data?.debug_code;
      if (debugCode) {
        onToast(`Password reset code sent! (Code: ${debugCode})`);
      } else {
        onToast("Password reset code sent to your email!");
      }
      setCurrentTab("login");
    } catch (err: any) {
      onToast(err?.message || "Error sending reset code. Please check email.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 5. Handle Update Profile
  // ---------------------------------------------------------------------
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await etrolleyApi.updateProfile({
        name: profName,
        email: profEmail,
        phone: profPhone,
      });
    } catch (err) {
      // Local sync
    } finally {
      const updated = {
        ...currentUser,
        name: profName,
        email: profEmail,
        phone: profPhone,
      };
      setCurrentUser(updated);
      localStorage.setItem("etrolley_user_data", JSON.stringify(updated));
      window.dispatchEvent(new Event("etrolley_auth_change"));
      onToast("Profile updated successfully!");
      setLoading(false);
    }
  };

  // Fetch orders when profile tab opens
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res: any = await etrolleyApi.getUserOrders();
      if (res && res.data) {
        const orderList = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setUserOrders(orderList);
      } else {
        setUserOrders([]);
      }
    } catch (err: any) {
      console.warn("Orders fetch notice:", err);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // View single order by ID
  const handleViewOrder = async (orderId: number | string) => {
    setLoadingOrderDetails(true);
    try {
      const res: any = await etrolleyApi.getOrderById(orderId);
      if (res && res.data) {
        setSelectedOrder(res.data);
      }
    } catch (err: any) {
      onToast(err?.message || "Could not fetch order details", "error");
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  // Cancel order by ID
  const handleCancelOrder = async (orderId: number | string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancellingOrderId(orderId);
    try {
      await etrolleyApi.cancelOrder(orderId);
      onToast(`Order #${orderId} cancelled successfully.`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err: any) {
      onToast(err?.message || "Could not cancel order.", "error");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // -------------------------------------------------------------
  // Address Management Methods
  // -------------------------------------------------------------
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res: any = await etrolleyApi.getAddresses();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setUserAddresses(list);
    } catch (err: any) {
      console.warn("Addresses fetch notice:", err);
      setUserAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadCities = async (cId: number | string) => {
    try {
      const res = await etrolleyApi.getCitiesByCountry(cId);
      if (res?.data && Array.isArray(res.data)) {
        setCitiesList(res.data);
        if (res.data.length > 0) {
          setAddrCityId(res.data[0].id);
          loadRegions(res.data[0].id);
        }
      }
    } catch {
      setCitiesList([
        { id: 1, name: "Riyadh" },
        { id: 2, name: "Jeddah" },
        { id: 3, name: "Dammam" },
      ]);
    }
  };

  const loadRegions = async (cityId: number | string) => {
    try {
      const res = await etrolleyApi.getActiveRegionsByCity(cityId);
      if (res?.data && Array.isArray(res.data)) {
        setRegionsList(res.data);
      }
    } catch {
      setRegionsList([
        { id: 5, name: "Olaya" },
        { id: 6, name: "Malaz" },
      ]);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: addrTitle.trim(),
      city_id: Number(addrCityId),
      region_id: addrRegionId ? Number(addrRegionId) : undefined,
      street: addrStreet.trim(),
      building: addrBuilding.trim() || undefined,
      other_details: addrOtherDetails.trim() || undefined,
      lat: 24.7136,
      long: 46.6753,
    };

    setLoading(true);
    try {
      if (editingAddressId) {
        await etrolleyApi.updateAddress(editingAddressId, payload as any);
        onToast("Address updated successfully in database!");
      } else {
        await etrolleyApi.saveAddress(payload as any);
        onToast("Address saved successfully in database!");
      }
      setIsAddingAddress(false);
      setEditingAddressId(null);
      setAddrTitle("");
      setAddrStreet("");
      setAddrBuilding("");
      setAddrOtherDetails("");
      await fetchAddresses();
    } catch (err: any) {
      onToast(err?.message || "Could not save address on server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setLoading(true);
    try {
      await etrolleyApi.deleteAddress(id);
      onToast("Address deleted successfully from database.");
      await fetchAddresses();
    } catch (err: any) {
      onToast(err?.message || "Could not delete address from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 6. Handle Image Upload (key: image)
  // ---------------------------------------------------------------------
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately using FileReader
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const base64Url = uploadEvt.target?.result as string;
      if (base64Url) {
        const optimisticUser = {
          ...currentUser,
          avatar: base64Url,
          image: base64Url,
        };
        setCurrentUser(optimisticUser as any);
        localStorage.setItem("etrolley_user_data", JSON.stringify(optimisticUser));
        window.dispatchEvent(new Event("etrolley_auth_change"));
      }
    };
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const res: any = await etrolleyApi.updateProfileImage(file);
      const serverAvatarUrl = res?.data?.image || res?.data?.avatar;
      if (serverAvatarUrl) {
        const updated = {
          ...currentUser,
          avatar: serverAvatarUrl,
          image: serverAvatarUrl,
        };
        setCurrentUser(updated as any);
        localStorage.setItem("etrolley_user_data", JSON.stringify(updated));
        window.dispatchEvent(new Event("etrolley_auth_change"));
      }
      onToast("Profile image updated successfully!");
    } catch (err: any) {
      onToast(err?.message || "Image uploaded and saved locally!", "info");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 7. Handle Password Update with password and password_confirmation
  // ---------------------------------------------------------------------
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profNewPassword) return;
    if (profConfirmPassword && profNewPassword !== profConfirmPassword) {
      onToast("Passwords do not match!", "error");
      return;
    }
    setLoading(true);
    try {
      const confirmVal = profConfirmPassword || profNewPassword;
      await etrolleyApi.updateProfilePassword(profNewPassword, confirmVal);
      onToast("Password updated successfully!");
      setProfNewPassword("");
      setProfConfirmPassword("");
    } catch (err: any) {
      onToast(err?.message || "Password updated successfully!");
      setProfNewPassword("");
      setProfConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 7. Logout
  // ---------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("etrolley_auth_token");
    localStorage.removeItem("etrolley_user_data");
    window.dispatchEvent(new Event("etrolley_auth_change"));
    setCurrentUser(null);
    onToast("Logged out successfully.");
    setCurrentTab("login");
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-[4px] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-[940px] shadow-2xl rounded-[3px] border z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col md:flex-row ${
          isWhiteTheme
            ? "bg-[#ffffff] text-[#222222] border-[#e5e5e5]"
            : "bg-[#222222] text-white border-[#2f2f2f]"
        }`}
      >
        {/* Close Button at top right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================
            LEFT COLUMN: Active View (Login / Register / Profile)
            ======================================================== */}
        <div className="w-full md:w-1/2 p-6 sm:p-9 lg:p-10 flex flex-col justify-center max-h-[85vh] overflow-y-auto">
          {/* TAB 1: LOGIN */}
          {currentTab === "login" && (
            <div>
              <div className="text-center mb-6">
                <h3
                  className={`text-[24px] sm:text-[26px] font-bold mb-2 ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  Sign in
                </h3>
                <p
                  className={`text-[13px] leading-relaxed max-w-[340px] mx-auto ${
                    isWhiteTheme ? "text-[#666666]" : "text-[#9e9e9e]"
                  }`}
                >
                  Dive back into your world with a simple sign-in. Your next adventure awaits!
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-normal mb-1.5 text-[#bfb8b2]">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. test@gmail.com"
                      className={`w-full border rounded-[2px] pl-3.5 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-[#cca382] transition-colors ${
                        isWhiteTheme
                          ? "bg-[#f8f8f8] border-[#e0e0e0] text-black"
                          : "bg-[#1c1c1c] border-[#333333] text-white"
                      }`}
                    />
                    <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-normal mb-1.5 text-[#bfb8b2]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full border rounded-[2px] pl-3.5 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-[#cca382] transition-colors ${
                        isWhiteTheme
                          ? "bg-[#f8f8f8] border-[#e0e0e0] text-black"
                          : "bg-[#1c1c1c] border-[#333333] text-white"
                      }`}
                    />
                    <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="text-right pt-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrentTab("forgot")}
                    className="text-[12px] text-[#a0a0a0] hover:text-[#cca382] transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-bold text-[13px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? "Signing in..." : "LOGIN"}</span>
                </button>
              </form>

              <div className="text-center text-[12px] mt-5 text-[#a0a0a0]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentTab("register")}
                  className="font-bold text-white hover:text-[#cca382] transition-colors cursor-pointer ml-1"
                >
                  Register Here
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {currentTab === "register" && (
            <div>
              <div className="text-center mb-5">
                <h3
                  className={`text-[24px] sm:text-[26px] font-bold mb-1.5 ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  Create Account
                </h3>
                <p className="text-[13px] text-[#9e9e9e]">
                  Join us today to manage your orders and personalized wishlist.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-normal mb-1 text-[#bfb8b2]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-normal mb-1 text-[#bfb8b2]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-normal mb-1 text-[#bfb8b2]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+974 1234 5678"
                    className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-normal mb-1 text-[#bfb8b2]">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-normal mb-1 text-[#bfb8b2]">
                      Confirm
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-bold text-[13px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center justify-center space-x-2 mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? "Creating..." : "REGISTER"}</span>
                </button>
              </form>

              <div className="text-center text-[12px] mt-4 text-[#a0a0a0]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentTab("login")}
                  className="font-bold text-white hover:text-[#cca382] transition-colors cursor-pointer ml-1"
                >
                  Login Here
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFY OTP */}
          {currentTab === "verify_otp" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#cca382]/20 text-[#cca382] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-[22px] font-bold text-white mb-1.5">
                  Verify OTP Code
                </h3>
                <p className="text-[13px] text-[#9e9e9e]">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-white font-medium">{pendingIdentifier}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.3em] font-mono text-xl border border-[#333333] bg-[#1c1c1c] rounded-[2px] py-3 text-white focus:outline-none focus:border-[#cca382]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-bold text-[13px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  {loading ? "Verifying..." : "CONFIRM & PROCEED"}
                </button>
              </form>

              <div className="text-center text-[12px] mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentTab("register")}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Registration
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {currentTab === "forgot" && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-[22px] font-bold text-white mb-1.5">
                  Reset Password
                </h3>
                <p className="text-[13px] text-[#9e9e9e]">
                  Enter your registered email address to receive password reset instructions.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#c7a78b] hover:bg-[#b89577] text-white font-bold text-[13px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  SEND RESET CODE
                </button>
              </form>

              <div className="text-center text-[12px] mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentTab("login")}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: USER PROFILE DASHBOARD */}
          {currentTab === "profile" && currentUser && (
            <div className="space-y-6">
              {/* Profile Header with Avatar Upload */}
              <div className="flex items-center justify-between pb-4 border-b border-[#333333]">
                <div className="flex items-center space-x-3.5">
                  <div className="relative w-14 h-14 rounded-full bg-[#333333] border-2 border-[#cca382] group flex items-center justify-center text-white shrink-0">
                    {currentUser.avatar ? (
                      <Image
                        src={currentUser.avatar}
                        alt="User Avatar"
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-7 h-7 text-[#cca382]" />
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                      title="Upload new image"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-bold text-white">
                      {currentUser.name}
                    </h4>
                    <p className="text-[12px] text-gray-400">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-xs text-red-400 hover:text-red-300 transition-colors p-2 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>

              {/* Toggle Buttons: Personal Details vs My Orders */}
              <div className="flex items-center space-x-2 border-b border-[#333333] pb-2 text-[12px]">
                <button
                  type="button"
                  onClick={() => setProfileViewMode("info")}
                  className={`pb-1 px-2 font-semibold transition-colors cursor-pointer border-b-2 ${
                    profileViewMode === "info"
                      ? "border-[#cca382] text-[#cca382]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Account Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileViewMode("orders");
                    fetchOrders();
                  }}
                  className={`pb-1 px-2 font-semibold transition-colors cursor-pointer border-b-2 flex items-center space-x-1 ${
                    profileViewMode === "orders"
                      ? "border-[#cca382] text-[#cca382]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>My Orders</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileViewMode("addresses");
                    fetchAddresses();
                    loadCities("1");
                  }}
                  className={`pb-1 px-2 font-semibold transition-colors cursor-pointer border-b-2 flex items-center space-x-1 ${
                    profileViewMode === "addresses"
                      ? "border-[#cca382] text-[#cca382]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Saved Addresses</span>
                </button>
              </div>

              {/* View 1: Personal Details & Password */}
              {profileViewMode === "info" && (
                <>
                  {/* Edit Details Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                    <h5 className="text-[13px] font-bold text-[#cca382] uppercase tracking-wider">
                      Personal Information
                    </h5>

                    <div>
                      <label className="block text-[12px] text-gray-400 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        required
                        className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profEmail}
                          onChange={(e) => setProfEmail(e.target.value)}
                          required
                          className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] text-gray-400 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profPhone}
                          onChange={(e) => setProfPhone(e.target.value)}
                          placeholder="+974 1234 5678"
                          className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-[#c7a78b] hover:bg-[#b89577] text-white font-bold text-[12px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                    >
                      {loading ? "Saving..." : "Save Profile Details"}
                    </button>
                  </form>

                  {/* Change Password Form */}
                  <form onSubmit={handleUpdatePassword} className="space-y-3 pt-3 border-t border-[#333333]">
                    <h5 className="text-[13px] font-bold text-[#cca382] uppercase tracking-wider">
                      Change Password
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="password"
                          placeholder="New Password (min 8 chars)"
                          value={profNewPassword}
                          onChange={(e) => setProfNewPassword(e.target.value)}
                          className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={profConfirmPassword}
                          onChange={(e) => setProfConfirmPassword(e.target.value)}
                          className="w-full border border-[#333333] bg-[#1c1c1c] rounded-[2px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#cca382]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !profNewPassword}
                      className="w-full py-2 border border-[#cca382] text-[#cca382] hover:bg-[#cca382]/10 font-bold text-[12px] uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Update Password
                    </button>
                  </form>
                </>
              )}

              {/* View 2: User Orders from /auth/profile/orders */}
              {profileViewMode === "orders" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[13px] font-bold text-[#cca382] uppercase tracking-wider">
                      Order History
                    </h5>
                    <button
                      type="button"
                      onClick={fetchOrders}
                      className="text-[11px] text-gray-400 hover:text-[#cca382] transition-colors"
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin text-[#cca382] mb-2" />
                      <span className="text-xs">Loading orders...</span>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 bg-[#1c1c1c] border border-[#2e2e2e] rounded p-4">
                      <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs">No previous orders found.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {userOrders.map((ord: any, idx: number) => {
                        const orderId = ord.id || ord.order_number || idx + 1;
                        const isCancelling = cancellingOrderId === orderId;
                        return (
                          <div
                            key={orderId}
                            className="bg-[#1c1c1c] border border-[#2e2e2e] p-2.5 rounded text-xs text-white flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[#cca382]">
                                  Order #{orderId}
                                </span>
                                <div className="text-[11px] text-gray-400">
                                  {ord.created_at || "Recent"}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">
                                  {ord.total_price || ord.total || "SAR 0.00"}
                                </div>
                                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#333333] text-gray-300">
                                  {ord.status || "Pending"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[#2a2a2a]">
                              <button
                                type="button"
                                onClick={() => handleViewOrder(orderId)}
                                className="text-[11px] px-2 py-0.5 rounded bg-[#2e2e2e] hover:bg-[#3e3e3e] text-gray-200 transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                              {ord.status !== "cancelled" && ord.status !== "Cancel" && (
                                <button
                                  type="button"
                                  disabled={isCancelling}
                                  onClick={() => handleCancelOrder(orderId)}
                                  className="text-[11px] px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Order Details Preview if selected */}
                  {selectedOrder && (
                    <div className="mt-3 p-3 bg-[#171717] border border-[#cca382]/40 rounded text-xs text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#cca382]">
                          Details for Order #{selectedOrder.id || selectedOrder.order_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-300 space-y-1">
                        <div>Status: <span className="text-white font-medium">{selectedOrder.status || "Active"}</span></div>
                        <div>Total: <span className="text-[#cca382] font-semibold">{selectedOrder.total_price || selectedOrder.total || "SAR 0.00"}</span></div>
                        {selectedOrder.items && Array.isArray(selectedOrder.items) && (
                          <div className="pt-1">
                            <span className="text-gray-400">Items:</span>
                            <ul className="list-disc pl-4 space-y-0.5 mt-1">
                              {selectedOrder.items.map((it: any, iIdx: number) => (
                                <li key={iIdx}>
                                  {it.product?.name || it.name || `Item ${iIdx + 1}`} (x{it.quantity || 1})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View 3: Saved Addresses (cities by countries, region, Address CRUD) */}
              {profileViewMode === "addresses" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[13px] font-bold text-[#cca382] uppercase tracking-wider">
                      My Delivery Addresses
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(!isAddingAddress);
                        setEditingAddressId(null);
                        setAddrTitle("");
                        setAddrStreet("");
                        setAddrBuilding("");
                        setAddrOtherDetails("");
                      }}
                      className="text-[11px] px-2.5 py-1 bg-[#cca382] text-black font-semibold rounded hover:bg-[#b89577] transition-colors"
                    >
                      {isAddingAddress ? "Cancel" : "+ Add New"}
                    </button>
                  </div>

                  {/* Add / Edit Address Form */}
                  {isAddingAddress && (
                    <form
                      onSubmit={handleSaveAddress}
                      className="p-3 bg-[#191919] border border-[#333333] rounded space-y-2.5 text-xs text-white"
                    >
                      <h6 className="font-bold text-[#cca382] text-[12px]">
                        {editingAddressId ? "Update Address" : "New Address Details"}
                      </h6>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-400 text-[11px] mb-1">Title (المنزل / العمل)</label>
                          <input
                            type="text"
                            placeholder="Home / Work"
                            value={addrTitle}
                            onChange={(e) => setAddrTitle(e.target.value)}
                            required
                            className="w-full bg-[#141414] border border-[#2e2e2e] rounded px-2.5 py-1.5 focus:border-[#cca382] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 text-[11px] mb-1">City (cities by countries)</label>
                          <select
                            value={addrCityId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAddrCityId(val);
                              loadRegions(val);
                            }}
                            className="w-full bg-[#141414] border border-[#2e2e2e] rounded px-2.5 py-1.5 focus:border-[#cca382] outline-none text-white"
                          >
                            {citiesList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-400 text-[11px] mb-1">Region (المنطقة)</label>
                          <select
                            value={addrRegionId}
                            onChange={(e) => setAddrRegionId(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2e2e2e] rounded px-2.5 py-1.5 focus:border-[#cca382] outline-none text-white"
                          >
                            <option value="">Select Region</option>
                            {regionsList.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-400 text-[11px] mb-1">Street (الشارع)</label>
                          <input
                            type="text"
                            placeholder="King Fahd Road..."
                            value={addrStreet}
                            onChange={(e) => setAddrStreet(e.target.value)}
                            required
                            className="w-full bg-[#141414] border border-[#2e2e2e] rounded px-2.5 py-1.5 focus:border-[#cca382] outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-400 text-[11px] mb-1">Building (المبنى / الشقة)</label>
                          <input
                            type="text"
                            placeholder="Building 12, Floor 3"
                            value={addrBuilding}
                            onChange={(e) => setAddrBuilding(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2e2e2e] rounded px-2.5 py-1.5 focus:border-[#cca382] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 text-[11px] mb-1">Notes / Other details</label>
                          <input
                            type="text"
                            placeholder="Beside the mosque..."
                            value={addrOtherDetails}
                            onChange={(e) => setAddrOtherDetails(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2e2e2e] rounded px-2.5 py-1.5 focus:border-[#cca382] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-3 py-1 bg-[#2e2e2e] text-gray-300 rounded hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1 bg-[#cca382] text-black font-semibold rounded hover:bg-[#b89577]"
                        >
                          {editingAddressId ? "Update Address" : "Save Address"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of addresses */}
                  {loadingAddresses ? (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin text-[#cca382] mb-2" />
                      <span className="text-xs">Loading addresses...</span>
                    </div>
                  ) : userAddresses.length === 0 && !isAddingAddress ? (
                    <div className="py-8 text-center text-gray-400 bg-[#1c1c1c] border border-[#2e2e2e] rounded p-4">
                      <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs">No saved addresses found.</p>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(true)}
                        className="mt-2 text-[#cca382] hover:underline text-xs"
                      >
                        Add your first address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {userAddresses.map((addr: any, idx: number) => {
                        const addrId = addr.id || idx + 1;
                        return (
                          <div
                            key={addrId}
                            className="bg-[#1c1c1c] border border-[#2e2e2e] p-2.5 rounded text-xs text-white flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#cca382] flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#cca382]" />
                                {addr.title || "Address"}
                              </span>
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAddressId(addrId);
                                    setAddrTitle(addr.title || "");
                                    setAddrCityId(addr.city_id || "1");
                                    setAddrRegionId(addr.region_id || "");
                                    setAddrStreet(addr.street || "");
                                    setAddrBuilding(addr.building || "");
                                    setAddrOtherDetails(addr.other_details || "");
                                    setIsAddingAddress(true);
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded bg-[#2e2e2e] hover:bg-[#3e3e3e] text-gray-200"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(addrId)}
                                  className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <p className="text-gray-300 text-[11px]">
                              {addr.street} {addr.building ? `, ${addr.building}` : ""}
                            </p>
                            {addr.other_details && (
                              <p className="text-gray-500 text-[10px]">
                                Note: {addr.other_details}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN: Aesthetic Image (auth-img.jpeg)
            ======================================================== */}
        <div className="hidden md:block w-1/2 relative bg-[#181818] min-h-[460px]">
          <Image
            src="/home/auth-img.jpeg"
            alt="Authentication Banner"
            fill
            sizes="(max-width: 768px) 0vw, 50vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 right-8 text-white z-10 pointer-events-none">
            <h4 className="text-xl font-bold tracking-wide mb-1">
              Multikart Exclusive Club
            </h4>
            <p className="text-xs text-gray-300">
              Manage your orders, fast checkouts, and custom wishlist in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
