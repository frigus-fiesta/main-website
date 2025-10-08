/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import React, { useState, useEffect } from 'react';
import { X, User, Mail, MapPin, Edit3, Save, Loader2, AlertCircle, CheckCircle, Phone, Bell, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface UserProfile {
  uuid: string;
  full_name: string;
  email: string;
  avatar_url: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bio: string;
  email_notifications: boolean;
  user_login_info: string;
  created_at: string;
  updated_at: string;
}

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userUuid: string;
}

const SECTIONS = [
  { key: "personal", label: "Personal Info", icon: User },
  { key: "contact", label: "Contact", icon: Phone },
  { key: "address", label: "Address", icon: MapPin },
  { key: "preferences", label: "Preferences", icon: Bell },
  { key: "about", label: "About", icon: Info },
];

type SectionKey = typeof SECTIONS[number]["key"];

const MyAccountModal: React.FC<MyAccountModalProps> = ({ isOpen, onClose, userUuid }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("personal");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [avatarUrlEdited, setAvatarUrlEdited] = useState(false);

  const baseUrl = 'https://backend-server.frigus-fiesta.workers.dev';

  // Validation functions
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (touchedFields.full_name && !formData.full_name?.trim()) {
      errors.full_name = 'Full name is required';
    }
    if (touchedFields.email && !formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (
      touchedFields.email &&
      formData.email &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      errors.email = 'Please enter a valid email address';
    }
    if (touchedFields.phone && formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (avatarUrlEdited && formData.avatar_url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.avatar_url)) {
      errors.avatar_url = 'Please enter a valid image URL';
    }
    if (touchedFields.pincode && formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }
    setFormErrors(errors);
    
return Object.keys(errors).length === 0;
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!userUuid) {
      setError('User UUID is required');
      
return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${baseUrl}/general/get-user-profile-from-uuid/${userUuid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data:any = await response.json();
      if (data.success && data.data) {
        setUserProfile(data.data);
        setFormData(data.data);
        setAvatarPreview(data.data.avatar_url || "");
        setAvatarUrlEdited(false);
        setTouchedFields({});
      } else {
        throw new Error(data.message || 'Failed to fetch profile data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    if (!userUuid || !formData) {
      setError('Missing required data for update');
      
return;
    }
    if (!validateForm()) {
      setError('Please fix the form errors before saving');
      
return;
    }
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updateData = {
        full_name: formData.full_name?.trim() || '',
        avatar_url: formData.avatar_url?.trim() || '',
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
        city: formData.city?.trim() || '',
        state: formData.state?.trim() || '',
        pincode: formData.pincode?.trim() || '',
        email_notifications: formData.email_notifications ? 'true' : 'false',
        bio: formData.bio?.trim() || '',
        email: formData.email?.trim() || '',
      };
      const response = await fetch(
        `${baseUrl}/general/profile/update/${userUuid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );
      const data:any = await response.json();
      if (response.ok && data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setFormErrors({});
        await fetchUserProfile();
      } else {
        throw new Error(data.message || `Update failed: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof UserProfile, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    if (field === "avatar_url") {
      setAvatarPreview(typeof value === "string" ? value : "");
      setAvatarUrlEdited(true);
    }
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile();
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(userProfile || {});
    setAvatarPreview(userProfile?.avatar_url || "");
    setError(null);
    setSuccess(null);
    setFormErrors({});
    setTouchedFields({});
    setAvatarUrlEdited(false);
  };

  // Handle avatar error
  const handleAvatarError = () => {
    setAvatarPreview("");
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  // Fetch profile when modal opens
  useEffect(() => {
    if (isOpen && userUuid) {
      fetchUserProfile();
    }
  }, [isOpen, userUuid]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      
return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      
return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen) return null;

  // Sidebar navigation
  const Sidebar = () => (
    <nav
      className="flex flex-row gap-2 overflow-x-auto border-b bg-white/70 p-2 shadow-sm backdrop-blur-lg sm:flex-col sm:gap-0 sm:border-b-0 sm:border-r sm:p-0 sm:shadow-none"
      aria-label="Profile sections"
    >
      {SECTIONS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={`group flex flex-1 items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all sm:flex-none sm:justify-start sm:px-6 sm:py-4 ${
            activeSection === key
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg"
              : "text-gray-700 hover:bg-yellow-50"
          }`}
          onClick={() => setActiveSection(key as SectionKey)}
          aria-current={activeSection === key ? "page" : undefined}
        >
          <Icon className="size-5 shrink-0" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );

  // Section content renderers
  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                value={formData.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  formErrors.full_name ? "border-red-500" : "border-gray-200"
                } ${!isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="Enter your full name"
              />
              {formErrors.full_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  formErrors.email ? "border-red-500" : "border-gray-200"
                } ${!isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="Enter your email address"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            {/* Avatar URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar_url || ""}
                onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  formErrors.avatar_url ? "border-red-500" : "border-gray-200"
                } ${!isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="https://example.com/avatar.jpg"
              />
              {formErrors.avatar_url && (
                <p className="mt-1 text-sm text-red-600">{formErrors.avatar_url}</p>
              )}
            </div>
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-white border-opacity-30 bg-white bg-opacity-20">
                {avatarPreview ? (
                  <Image
                    width={80}
                    height={80}
                    src={avatarPreview}
                    alt="Profile Avatar"
                    className="size-full object-cover"
                    onError={handleAvatarError}
                  />
                ) : (
                  <User className="size-10 text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-500">Avatar Preview</span>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-6">
            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  formErrors.phone ? "border-red-500" : "border-gray-200"
                } ${!isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="+1 (555) 123-4567"
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>
            {/* Email Notifications */}
            <div className="flex items-center gap-3 rounded-lg bg-white/60 p-4 shadow-sm backdrop-blur-sm">
              <input
                type="checkbox"
                id="email-notifications"
                checked={formData.email_notifications || false}
                onChange={(e) => handleInputChange("email_notifications", e.target.checked)}
                disabled={!isEditing}
                className="size-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 disabled:opacity-50"
              />
              <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                Receive email notifications
              </label>
            </div>
          </div>
        );
      case "address":
        return (
          <div className="space-y-6">
            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
                rows={3}
                className={`w-full resize-none rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  !isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="Enter your full address"
              />
            </div>
            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={formData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  !isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="Enter your city"
              />
            </div>
            {/* State */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">State/Province</label>
              <input
                type="text"
                value={formData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  !isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="Enter your state"
              />
            </div>
            {/* Pincode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Pincode/ZIP</label>
              <input
                type="text"
                value={formData.pincode || ""}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                disabled={!isEditing}
                className={`w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  formErrors.pincode ? "border-red-500" : "border-gray-200"
                } ${!isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="123456"
              />
              {formErrors.pincode && (
                <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>
              )}
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-6">
            {/* Email Notifications (duplicate for easy access) */}
            <div className="flex items-center gap-3 rounded-lg bg-white/60 p-4 shadow-sm backdrop-blur-sm">
              <input
                type="checkbox"
                id="email-notifications-pref"
                checked={formData.email_notifications || false}
                onChange={(e) => handleInputChange("email_notifications", e.target.checked)}
                disabled={!isEditing}
                className="size-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 disabled:opacity-50"
              />
              <label htmlFor="email-notifications-pref" className="text-sm font-medium text-gray-700">
                Receive email notifications
              </label>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                disabled={!isEditing}
                rows={4}
                className={`w-full resize-none rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
                  !isEditing ? "bg-gray-50" : "bg-white/50"}`}
                placeholder="Tell us about yourself..."
              />
            </div>
            {/* Member Since */}
            <div className="text-sm text-gray-500">
              Member since {userProfile ? formatDate(userProfile.created_at) : '-'}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="relative mx-2 flex max-h-[95vh] w-full max-w-[95vw] flex-col overflow-y-auto rounded-xl border border-white/20 bg-white/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-3xl md:max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-gray-400 transition-all duration-300 hover:bg-yellow-50 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        {/* Responsive Sidebar */}
        <div className="flex h-full flex-col sm:flex-row">
          {/* Sidebar (collapsible on mobile) */}
          <aside
            className={`${showSidebar ? 'block' : 'hidden'} border-b border-gray-200 bg-white/70 sm:block sm:w-56 sm:border-b-0 sm:border-r`}
          >
            <Sidebar />
          </aside>
          {/* Sidebar toggle for mobile */}
          <button
            className="absolute left-2 top-3 z-10 block rounded-full bg-white/80 p-2 shadow hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:hidden"
            onClick={() => setShowSidebar((v) => !v)}
            aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
            type="button"
          >
            {showSidebar ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="mb-4 size-12 animate-spin text-yellow-500" />
                <p className="text-lg text-gray-600">Loading your profile...</p>
              </div>
            )}
            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50/80 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-5 shrink-0 text-red-500" />
                  <span className="font-medium text-red-700">Error</span>
                </div>
                <p className="mt-1 text-red-600">{error}</p>
              </div>
            )}
            {/* Success State */}
            {success && (
              <div className="mb-6 rounded-lg border-l-4 border-green-500 bg-green-50/80 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 shrink-0 text-green-500" />
                  <span className="font-medium text-green-700">Success</span>
                </div>
                <p className="mt-1 text-green-600">{success}</p>
              </div>
            )}
            {/* Profile Content */}
            {userProfile && !isLoading && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Header */}
                <div className="relative mb-8 flex flex-col items-center gap-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-white shadow-lg sm:flex-row sm:items-end">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-white border-opacity-30 bg-white bg-opacity-20 sm:size-32">
                      {avatarPreview ? (
                        <Image
                          width={80} 
                          height={80}
                          src={avatarPreview}
                          alt="Profile Avatar"
                          className="size-full object-cover"
                          onError={handleAvatarError}
                        />
                      ) : (
                        <User className="size-12 text-white sm:size-16" />
                      )}
                    </div>
                  </div>
                  {/* Profile Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="mb-2 text-2xl font-bold sm:text-3xl">
                      {userProfile.full_name || 'Welcome!'}
                    </h3>
                    <p className="mb-1 flex items-center justify-center gap-2 text-yellow-100 sm:justify-start">
                      <Mail className="size-4" />
                      {userProfile.email}
                    </p>
                    <p className="text-sm text-yellow-100">
                      Member since {formatDate(userProfile.created_at)}
                    </p>
                  </div>
                </div>
                {/* Section Content */}
                <div>{renderSection()}</div>
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:w-auto"
                    >
                      <Edit3 className="size-5" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex w-full flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="size-5 animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <Save className="size-5" /> Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-gray-600 px-8 py-3 font-bold text-white shadow-lg transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyAccountModal;