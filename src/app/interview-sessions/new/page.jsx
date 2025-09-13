import { dynamic } from "next";

export const dynamic = "force-dynamic";

import NewSessionClient from "./NewSessionClient";

export default function Page() {
  return <NewSessionClient />;
}
