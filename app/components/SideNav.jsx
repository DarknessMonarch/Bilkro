"use client";

import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import Logo from "@/public/assets/logo.png";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/sideNav.module.css";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { useEffect, useState, useCallback } from "react";
import { IoCartOutline as CartIcon } from "react-icons/io5";
import { BiMoneyWithdraw as SalesIcon } from "react-icons/bi";
import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";
import { TbReportAnalytics as ReportIcon } from "react-icons/tb";
import { HiOutlineHome as DashboardIcon } from "react-icons/hi2";
import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { MdOutlineInventory2 as InventoryIcon } from "react-icons/md";

export default function SideNav() {
  const { isAuth, isAdmin, logout } = useAuthStore();
  const { isOpen, toggleOpen } = useDrawerStore();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarClasses = `${styles.sideContainer} ${
    isMobile
      ? isOpen
        ? styles.showSideNav
        : styles.hideSideNav
      : styles.showSideNav
  }`;

  const handleLogout = useCallback(async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [logout]);

  return (
    <div className={sidebarClasses}>
      {isMobile && (
        <div onClick={toggleOpen} className={styles.toggleMenuButton}>
          <div className={styles.closeIconBtn}>
            <CloseIcon
              className={styles.toggleMenuIcon}
              aria-label="Toggle menu"
              alt="toggle menu icon"
            />
          </div>
          <Image
            src={Logo}
            height={35}
            alt="logo"
            priority
            className={styles.logo}
          />
        </div>
      )}
      <div className={styles.sideTop}>
        {!isMobile && (
          <div>
            <Image
              src={Logo}
              height={35}
              alt="logo"
              priority
              className={styles.sideTopLogo}
            />
          </div>
        )}

          <Link
            href="/page/dashboard/?card=revenue"
            className={styles.sideLink}
          >
            <div
              className={`${styles.innerSideLink} ${
                pathname === "/page/dashboard" ||
                pathname.startsWith("/page/dashboard/")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <DashboardIcon
                alt="dashboard icon"
                aria-label="dashboard icon"
                className={styles.linkIcon}
              />
              <h1>Dashboard</h1>
            </div>
          </Link>
        <Link href="/page/inventory" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/inventory" ||
              pathname.startsWith("/page/inventory/")
                ? styles.activeLink
                : ""
            }`}
          >
            <InventoryIcon
              alt="inventory icon"
              aria-label="inventory icon"
              className={styles.linkIcon}
            />
            <h1>Inventory</h1>
          </div>
        </Link>
        <Link href="/page/reports" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/reports" ||
              pathname.startsWith("/page/reports/")
                ? styles.activeLink
                : ""
            }`}
          >
            <ReportIcon
              alt="reports icon"
              aria-label="reports icon"
              className={styles.linkIcon}
            />
            <h1>Reports</h1>
          </div>
        </Link>

        <Link href="/page/cart" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/cart" || pathname.startsWith("/page/cart/")
                ? styles.activeLink
                : ""
            }`}
          >
            <CartIcon alt="cart icon" className={styles.linkIcon} />
            <h1>Cart</h1>
          </div>
        </Link>
        <Link href="/page/sales" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/sales" || pathname.startsWith("/page/sales/")
                ? styles.activeLink
                : ""
            }`}
          >
            <SalesIcon
              alt="sales icon"
              aria-label="sales icon"
              className={styles.linkIcon}
            />
            <h1>Sales</h1>
          </div>
        </Link>
      </div>
        <div className={styles.sideBottomContainer}>
          <Link href="/page/settings" className={styles.sideLink}>
            <div
              className={`${styles.innerSideLink} ${
                pathname === "/page/settings" ||
                pathname.startsWith("/page/settings/")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <SettingsIcon
                alt="settings icon"
                aria-label="settings icon"
                className={styles.linkIcon}
              />
              <h1>settings</h1>
            </div>
          </Link>
          <div
            className={`${styles.sideLink} ${styles.bottomLink}`}
            onClick={handleLogout}
          >
            <LogoutIcon
              alt="logout icon"
              aria-label="logout icon"
              className={styles.linkIcon}
            />
            <h1>Logout</h1>
          </div>
        </div>
    </div>
  );
}
