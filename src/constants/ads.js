// Ad units, straight from each network's "Get code". Admins only switch
// placements on/off (admin panel → Ad Networks); the code itself lives here.
// Placement ids must match the backend's AD_PLACEMENTS.
//
// Adsterra: `key` is atOptions.key, `src` is the <script src> from the
// snippet (Adsterra rotates its ad domains, so copy it as given).
export const AD_UNITS = {
  adsterra: {
    marketplaceRailTop: {
      key: "87149336fd93cfa1c66a0948efbff05a",
      src: "https://bicea.org/22/87149336fd93cfa1c66a0948efbff05a",
      width: 300,
      height: 250,
    },
  },
};
