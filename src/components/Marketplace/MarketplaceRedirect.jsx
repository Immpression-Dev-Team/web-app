import { Navigate, useLocation } from "react-router-dom";

// The marketplace is the home page now; old /marketplace links (including
// ?q= / ?sort= and #anchors) land on / with the same query and hash.
export default function MarketplaceRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}
