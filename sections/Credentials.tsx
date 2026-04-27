"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

/* ✅ Proper typing */
type Props = {
  setFormData: React.Dispatch<
    React.SetStateAction<FormDataType>
  >;
};

export default function Credentials({ setFormData }: Props) {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const usernameValid = /^[a-zA-Z0-9]{5,30}$/.test(username);

  const passwordValid =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const passwordMatch = password === confirmPassword;

  /* ✅ Push to parent */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      credentials: {
        userType,
        username,
        password,
      },
    }));
  }, [userType, username, password, setFormData]);

  return (
    <div id="credentials">
      <SectionCard title="Section A - Credentials">
        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label>User Type *</label>
            <select
              className="w-full border p-3 rounded"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="">Select</option>
              <option>Station</option>
              <option>QCA</option>
              <option>Owner</option>
              <option>AMR</option>
            </select>
          </div>

          <div>
            <label>Username *</label>
            <input
              className="w-full border p-3 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {username && !usernameValid && (
              <p className="text-red-500 text-sm">
                5-30 alphanumeric required
              </p>
            )}
          </div>

          <div>
            <label>Password *</label>
            <input
              type="password"
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && !passwordValid && (
              <p className="text-red-500 text-sm">
                8 chars + Uppercase + Number + Special char
              </p>
            )}
          </div>

          <div>
            <label>Confirm Password *</label>
            <input
              type="password"
              className="w-full border p-3 rounded"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
            {confirmPassword && !passwordMatch && (
              <p className="text-red-500 text-sm">
                Password not matched
              </p>
            )}
          </div>

        </div>
      </SectionCard>
    </div>
  );
}