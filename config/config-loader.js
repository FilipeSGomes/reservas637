(function () {
  var registry = window.CLIENT_CONFIG_REGISTRY || {};
  var clients = registry.clients || {};
  var currentScript = document.currentScript;
  var currentSrc = currentScript && currentScript.src ? currentScript.src : "";
  var baseUrl = currentSrc ? currentSrc.replace(/[^/]+$/, "") : "config/";
  var params = new URLSearchParams(window.location.search);
  var requestedClientId = params.get("client") || "";
  var storedClientId = "";

  try {
    storedClientId = window.localStorage.getItem("reservas637:selected-client") || "";
  } catch (error) {
    storedClientId = "";
  }

  function normalizeClientId(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getHostnameClientId() {
    var hostnameMap = registry.hostnameMap || {};
    var hostname = window.location.hostname || "";
    if (hostnameMap[hostname]) {
      return hostnameMap[hostname];
    }

    if (hostname.endsWith(".fisamtech.com")) {
      var subdomain = normalizeClientId(hostname.replace(".fisamtech.com", "").split(".").shift());
      if (clients[subdomain]) {
        return subdomain;
      }
    }

    return "";
  }

  function isKnownTenantDomain() {
    var hostname = window.location.hostname || "";
    if (!hostname.endsWith(".fisamtech.com")) {
      return true;
    }

    return Boolean(getHostnameClientId());
  }

  function isLocalPreviewHost() {
    var hostname = window.location.hostname || "";
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";
  }

  var hostnameClientId = getHostnameClientId();

  if (!isKnownTenantDomain()) {
    throw new Error("Subdominio de cliente nao cadastrado.");
  }

  var selectedClientId = normalizeClientId(
    hostnameClientId ||
      (isLocalPreviewHost() ? requestedClientId : "") ||
      storedClientId ||
      registry.defaultClientId ||
      "637"
  );

  if (!clients[selectedClientId]) {
    selectedClientId = normalizeClientId(registry.defaultClientId || "637");
  }

  var selectedClient = clients[selectedClientId] || clients["637"];
  if (!selectedClient || !selectedClient.configPath) {
    throw new Error("Nenhuma configuracao de cliente encontrada.");
  }

  try {
    window.localStorage.setItem("reservas637:selected-client", selectedClientId);
  } catch (error) {
    // Local storage may be unavailable in private mode; query/hostname selection still works.
  }

  window.SELECTED_CLIENT_ID = selectedClientId;
  window.SELECTED_CLIENT_META = selectedClient;
  document.write('<script src="' + baseUrl + selectedClient.configPath + '"><\/script>');
})();
