// Ad units: paste each network's code exactly as its dashboard gives it
// ("Get code"). Admins only switch placements on/off (admin panel → Ad
// Networks); the code itself lives here. Network/placement ids must match
// the backend's AD_PLACEMENTS and the admin panel's AD_NETWORKS.
//
// An empty `code` renders nothing, even if the placement is switched on.
export const AD_UNITS = {
  adsterra: {
    // Marketplace right rail, first slot
    marketplaceRailTop: {
      width: 300,
      height: 250,
      code: `
<script>
  atOptions = {
    'key' : '87149336fd93cfa1c66a0948efbff05a',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://bicea.org/22/87149336fd93cfa1c66a0948efbff05a"></script>
`,
    },
  },
  hilltop: {
    // Marketplace right rail, second slot (under the Adsterra banner)
    marketplaceRailSecond: {
      width: 300,
      height: 250,
      code: ``,
    },
  },
};
