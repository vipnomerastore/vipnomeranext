"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import PhoneDescriptionalClient from "@/app/phone-descriptional/PhoneDescriptionalClient";
import { usePhoneModalManager } from "../hooks/usePhoneModalManager";

const PhoneModalManager: React.FC = () => {
  const { showPhoneModal, selectedPhone, closeModal } = usePhoneModalManager();
  const { user } = useAuthStore();
  const isPartner = user?.role?.name === "Партнёр";

  if (!showPhoneModal || !selectedPhone) {
    return null;
  }

  return (
    <PhoneDescriptionalClient
      number={selectedPhone}
      isPartner={isPartner}
      onClose={closeModal}
    />
  );
};

export default PhoneModalManager;
