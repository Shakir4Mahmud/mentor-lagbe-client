import Link from "next/link";
import { PlusCircle } from "lucide-react";
import MyTuitions from "@/components/dashboard/MyTuitions";
import { Button } from "@/components/ui/button";

export default function MyTuitionsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Tuitions</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your tuition posts, their approval status and availability.
          </p>
        </div>

        <Button asChild className="rounded-full">
          <Link href="/dashboard/tutor/post-tuition">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <MyTuitions />
      </div>
    </div>
  );
}