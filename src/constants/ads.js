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
    // Marketplace right rail, second slot (below "From Immpression").
    // Zone: marketplace-rail-300x250. String.raw keeps the snippet's
    // backslashes exactly as HilltopAds gave them.
    marketplaceRailSecond: {
      width: 300,
      height: 250,
      code: String.raw`
<script>
(function(kyakv){
var d = document,
    s = d.createElement('script'),
    l = d.currentScript || d.scripts[d.scripts.length - 1];
s.settings = kyakv || {};
s.src = "\/\/quarrelsomebitter.com\/b\/XOV\/sUd.Gvlm0\/YfW\/cA\/tewmc9NugZGUwl_kbPsTVci1MNmDYgE1oOgD\/EGtrNpzyUY0iO\/DTUQ4\/NZQt";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
`,
    },
  },
};
