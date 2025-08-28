"use client";

import { useId, useMemo, useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordStrengthInput({ password, setPassword }) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const checkStrength = (pass) =>
    [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ].map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));

  const strength = checkStrength(password);

  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="space-y-2">
      {/* Label and Input */}
      <Label htmlFor={id}>Password</Label>
      <div className="relative">
        <Input
          id={id}
          className="pe-9"
          placeholder="Password"
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby={
            password.length > 0 ? `${id}-description` : undefined
          }
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md outline-none transition-all focus-visible:z-10"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      </div>

      {/* Only show strength if password is not empty */}
      {password.length > 0 && (
        <>
          {/* Strength Meter */}
          <div
            className="bg-border mt-3 h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            />
          </div>

          {/* Strength Description */}
          <p
            id={`${id}-description`}
            className="text-sm font-medium text-foreground"
          >
            {getStrengthText(strengthScore)}. Must contain:
          </p>

          {/* Strength Rules */}
          <ul className="space-y-1.5" aria-label="Password requirements">
            {strength.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {req.met ? (
                  <CheckIcon className="text-emerald-500" size={16} />
                ) : (
                  <XIcon className="text-muted-foreground/80" size={16} />
                )}
                <span
                  className={`text-xs ${
                    req.met ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
