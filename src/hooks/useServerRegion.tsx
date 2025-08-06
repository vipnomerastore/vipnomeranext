import { cookies, headers } from "next/headers";
import { getRegionFromRequest } from "@/shared/utils/server-region";

export async function getServerRegion(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();

    const regionCookie = cookieStore.get("region")?.value;
    const host = headersList.get("host") || "";

    return getRegionFromRequest(host, regionCookie);
  } catch (error) {
    console.error("Error getting server region:", error);
    return null;
  }
}

/**
 * Серверный компонент для отображения региона
 */
export async function ServerRegionInfo() {
  const region = await getServerRegion();

  if (!region) return null;

  return (
    <div data-server-region={region} style={{ display: "none" }}>
      {/* Скрытый элемент для передачи региона на клиент */}
    </div>
  );
}
