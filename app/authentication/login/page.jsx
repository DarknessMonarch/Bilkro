"use client";

import { toast } from 'sonner';
import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import { useState, useEffect, useRef } from "react";
import Loader from "@/app/components/StateLoader";
import LogoImg from "@/public/assets/logo.png";
import styles from "@/app/styles/auth.module.css";
import { useRouter, useSearchParams } from "next/navigation";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";

export default function SignUp() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [referral, setReferral] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [terms, setTerms] = useState(false);
  const searchParams = useSearchParams();
  const { register } = useAuthStore();
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const referralParam = searchParams.get("referral");
    if (referralParam) {
      setReferral(referralParam);
    }
  }, [searchParams]);


  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.country) {
      toast.error("Country is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        country: formData.country,
      };

      if (referral) {
        userData.referredBy = referral;
      }

      const result = await register(userData);

      if (result.success) {
        toast.success(result.message);
        router.push("verification", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authComponent}>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formLogo}>
            <Image
              className={styles.logo}
              src={LogoImg}
              alt="logo"
              width={100}
              priority={true}
            />
          </div>
          <div className={styles.formHeader}>
            <h1>Create an account</h1>
            <p>Please enter your details to sign up</p>
          </div>

          <div>
            <label htmlFor="username" className={styles.formLabel}>Username</label>
            <div className={styles.authInput}>
              <UserNameIcon className={styles.authIcon} />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <div className={styles.authInput}>
              <EmailIcon className={styles.authIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className={styles.formInput}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <div className={styles.authInput}>
              <PasswordIcon className={styles.authIcon} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={styles.showBtn}
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? (
                  <ShowPasswordIcon className={styles.authIcon} />
                ) : (
                  <HidePasswordIcon className={styles.authIcon} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.formInput}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
            <div className={styles.authInput}>
              <PasswordIcon className={styles.authIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={styles.showBtn}
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? (
                  <ShowPasswordIcon className={styles.authIcon} />
                ) : (
                  <HidePasswordIcon className={styles.authIcon} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.termsContainer}>
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              required
            />
            <label
              onClick={() => router.push("/page/terms", { scroll: false })}
              htmlFor="terms"
            >
              I accept the Terms and Conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Sign up"}
          </button>

          <div className={styles.signupPrompt}>
            Already have an account?{" "}
            <span
              className={styles.signupLink}
              onClick={() => router.push("login", { scroll: false })}
            >
              Sign in
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}