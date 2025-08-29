"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import { SERVER_URL } from "@/shared/api";
import Button from "@/shared/ui/Button";
import styles from "./MyListings.module.scss";

interface StrapiSellResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  phone: string;
  operator: string;
  price: string;
  email: string;
  sell_number: string;
  comment?: string;
  isPaid: "НА МОДЕРАЦИИ" | "ВЫСТАВЛЕН НА ПРОДАЖУ" | "ПРОДАН";
}

const MyListings = memo(() => {
  const [listings, setListings] = useState<StrapiSellResponse[]>([]);
  const { jwt, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !jwt || !user?.email) {
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/forma-srochnyj-vykups`);

        if (response.data?.data) {
          const allListings = response.data.data;

          const userListings = allListings.filter(
            (listing: StrapiSellResponse) => {
              const listingEmail = listing.email?.toLowerCase().trim();

              const currentUserEmail = user.email.toLowerCase().trim();

              return listingEmail === currentUserEmail;
            }
          );

          setListings(userListings);
        }
      } catch (error: unknown) {
        console.error(error);
      }
    };

    fetchListings();
  }, [isAuthenticated, jwt, user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string | null | undefined) => {
    if (!price) return "0";

    const numPrice = parseFloat(price.replace(/[^\d]/g, ""));

    return isNaN(numPrice) ? "0" : numPrice.toLocaleString("ru-RU");
  };

  const getStatusClass = (listing: StrapiSellResponse) => {
    const status = listing.isPaid;

    switch (status) {
      case "ВЫСТАВЛЕН НА ПРОДАЖУ":
        return styles.statusActive;
      case "ПРОДАН":
        return styles.statusSold;
      case "НА МОДЕРАЦИИ":
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Мои объявления</h1>

          <p className={styles.subtitle}>
            Всего объявлений:{" "}
            <span className={styles.count}>{listings.length}</span>
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/redemption">
            <Button variant="default" arrow>
              Добавить номер
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.listings}>
        {listings.map((listing) => (
          <div key={listing.id} className={styles.listingCard}>
            <div className={styles.listingHeader}>
              <div className={styles.phoneInfo}>
                <h3 className={styles.phoneNumber}>{listing.sell_number}</h3>

                <span className={styles.operator}>{listing.operator}</span>
              </div>

              <div className={styles.priceInfo}>
                <span className={styles.price}>
                  {formatPrice(listing.price)} ₽
                </span>

                <span className={`${styles.status} ${getStatusClass(listing)}`}>
                  {listing.isPaid}
                </span>
              </div>
            </div>

            <div className={styles.listingBody}>
              <div className={styles.contactInfo}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Имя:</span>

                    <span className={styles.infoValue}>{listing.name}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Телефон:</span>

                    <span className={styles.infoValue}>{listing.phone}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>

                    <span className={styles.infoValue}>{listing.email}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Создано:</span>

                    <span className={styles.infoValue}>
                      {formatDate(listing.createdAt)}
                    </span>
                  </div>
                </div>

                {listing.comment && (
                  <div className={styles.comment}>
                    <div className={styles.commentLabel}>Комментарий:</div>
                    <div className={styles.commentText}>{listing.comment}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

MyListings.displayName = "MyListings";
export default MyListings;
