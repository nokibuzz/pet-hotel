"use client";

import { useState } from "react";
import Button from "../Button";
import EditableField from "../inputs/EditableField";

const ProfileCard = ({ currentUser }) => {
  const [name, setName] = useState(currentUser?.name ?? "");
  const [originalName, setOriginalName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [hasChanged, setHasChanged] = useState(false);

  const detectChanges = (newName, newEmail) => {
    setHasChanged(newName !== originalName || newEmail !== originalEmail);
  };

  const handleSubmit = () => {
    setOriginalName(name);
    setOriginalEmail(email);
    setHasChanged(false);
    console.log("Saved Name:", name);
    console.log("Saved Email:", email);
    console.log("submit");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">My Profile</h2>

      <div className="grid grid-cols-1 gap-4">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <img
            src="/images/placeholder.png"
            alt="Profile"
            className="rounded-full w-24 h-24"
          />
        </div>

        {/* Editable Fields */}
        <EditableField
          label="Name"
          value={name}
          onFieldChange={(newName) => {
            setName(newName);
            detectChanges(newName, email);
          }}
        />
        <EditableField
          label="Email"
          value={email}
          onFieldChange={(newEmail) => {
            setEmail(newEmail);
            detectChanges(name, newEmail);
          }}
        />

        {/* Save Button */}
        {hasChanged && (
          <div className="flex justify-center">
            <Button
              disabled={false}
              label="Save"
              onClick={handleSubmit}
              small
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
