"use client";

import { useState } from "react";

import { NewAdminTab } from "@/components/admin/settings/NewAdminTab";
import { PasswordTab } from "@/components/admin/settings/PasswordTab";
import { ProfileTab } from "@/components/admin/settings/ProfileTab";

const TABS = [
  { id: "profile", label: "Mon profil", icon: "fa-user-circle" },
  { id: "password", label: "Mot de passe", icon: "fa-lock" },
  { id: "new-admin", label: "Nouveau compte", icon: "fa-user-plus" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Paramètres du compte</h1>
      </div>

      <div className="admin-settings-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-settings-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`} aria-hidden="true" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "password" && <PasswordTab />}
      {activeTab === "new-admin" && <NewAdminTab />}
    </>
  );
}
