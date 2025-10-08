import { redirect } from "next/navigation";

export default function IdPage({ params }: { params: { id: string } }) {
  redirect(`/dashboard/${params.id}/summary`);
}
