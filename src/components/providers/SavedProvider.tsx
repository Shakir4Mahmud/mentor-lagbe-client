"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

type SavedContextType = {
  savedIds: string[];
  idsLoaded: boolean;
  isLoggedIn: boolean;
  isStudent: boolean;
  toggleSaved: (tuitionId: string) => Promise<void>;
};

const SavedContext = createContext<SavedContextType>({
  savedIds: [],
  idsLoaded: false,
  isLoggedIn: false,
  isStudent: false,
  toggleSaved: async () => {},
});

export function useSaved() {
  return useContext(SavedContext);
}

export default function SavedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  let role = "";
  let userId = "";
  let isLoggedIn = false;

  if (user) {
    isLoggedIn = true;
    userId = user.id;
    if (user.role) {
      role = user.role;
    }
  }

  const isStudent = role === "student";

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [idsLoaded, setIdsLoaded] = useState(false);

  // Student login thakle save kora id gulo ekbar server theke ani
  useEffect(() => {
    if (!isStudent) {
      return;
    }

    async function loadSaved() {
      try {
        const data = await apiFetch<{ ids: string[] }>("/api/bookmarks");
        setSavedIds(data.ids);
      } catch {
        // load na hole khali thakbe
      }
      setIdsLoaded(true);
    }

    loadSaved();
  }, [isStudent, userId]);

  // Student na hole kono saved dekhabo na
  let visibleIds: string[] = [];
  if (isStudent) {
    visibleIds = savedIds;
  }

  async function toggleSaved(tuitionId: string) {
    const alreadySaved = visibleIds.includes(tuitionId);

    try {
      if (alreadySaved) {
        await apiFetch("/api/bookmarks/" + tuitionId, { method: "DELETE" });

        const remaining = savedIds.filter((id) => id !== tuitionId);
        setSavedIds(remaining);
        toast.success("Removed from saved tuitions");
      } else {
        await apiFetch("/api/bookmarks/" + tuitionId, { method: "POST" });

        const updated = savedIds.concat([tuitionId]);
        setSavedIds(updated);
        toast.success("Tuition saved");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  }

  return (
    <SavedContext.Provider
      value={{
        savedIds: visibleIds,
        idsLoaded: idsLoaded,
        isLoggedIn: isLoggedIn,
        isStudent: isStudent,
        toggleSaved: toggleSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}