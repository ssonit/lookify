
'use client';

import { PageTitle } from "@/components/page-title";
import { ProfileSettingsForm } from "@/components/profile-settings-form";

export default function EditProfilePage() {
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Chỉnh sửa hồ sơ" backHref="/profile" />
      <ProfileSettingsForm />
    </div>
  );
}
