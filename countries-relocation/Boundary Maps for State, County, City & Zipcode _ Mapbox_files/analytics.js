(function () {
  if (typeof window === undefined) return;

  // Initialize Segment
  // ==========================================
  // This needs to happen *right away*, before the user calls
  // initializeMapboxAnalytics(). It will create the global analytics variable
  // and will stub out its methods, queuing invocations that will be replayed
  // when you analytics.load(), so you can use those methods freely even before
  // analytics.js is downloaded and initialized (with load()).
  //
  // ------ Start code from Segment snippet ------
  // The following code is copied from analytics.js.
  // Update occasionally from https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/
  // Note that it *does not* include the lines that run analytics.load()
  // and analytics.page(): we do that in initializeMapboxAnalytics.

  // Create a queue, but don't obliterate an existing one!
  var analytics = (window.analytics = window.analytics || []);
  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return;
  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error("Segment snippet included twice.");
    }
    return;
  }
  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true;
  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    "trackSubmit",
    "trackClick",
    "trackLink",
    "trackForm",
    "pageview",
    "identify",
    "reset",
    "group",
    "track",
    "ready",
    "alias",
    "debug",
    "page",
    "once",
    "off",
    "on",
    "addSourceMiddleware",
    "addIntegrationMiddleware",
    "setAnonymousId",
    "addDestinationMiddleware",
  ];
  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };
  // For each of our methods, generate a queueing stub.
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }
  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function (key, options) {
    // Create an async script element based on your key.
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
    // Insert our script next to the first script element.
    var first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(script, first);
    analytics._loadOptions = options;
  };
  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = "4.15.2";
  // ------ End code from Segment snippet ------

  // If you change these, update the documentation.
  var defaultSegmentIntegrations = [
    "Segment.io",
    "Google Analytics",
    "Google Analytics 4 Web",
    "Metrics",
    "Amazon Kinesis",
    "Amazon S3",
    "Customer.io",
    "Drift",
  ];

  var SEGMENT_WRITE_KEY_DEFAULT_PRODUCTION = "fl0c8p240n";
  var SEGMENT_WRITE_KEY_DEFAULT_STAGING = "0biiejpgfj";
  var MARKETO_MUNCHKIN_ID_DEFAULT = "117-NXK-490";
  var didInitialize = false;

  /**
   * @param {Object} [options]
   * @param {string} [options.segmentWriteKey]
   * @param {string} [options.segmentWriteKeyStaging]
   * @param {{ [string]: boolean }} [options.segmentIntegrations]
   * @param {boolean} [options.marketoMunchkin]
   * @param {string} [options.marketoMunchkinId]
   */
  window.initializeMapboxAnalytics = function (options) {
    if (didInitialize) return;
    didInitialize = true;

    options = options || {};

    // Initialize Raven / Sentry
    // ==========================================

    if (options.sentry) {
      var ravenVersion = "3.26.4";
      var sentryDsn = options.sentry.sentryDsn;
      var ravenOptions = options.sentry.ravenOptions || {}; // object of sentry's default config options (https://docs.sentry.io/clients/javascript/config/). Gets passed directly to Raven. Fallback to empty object if no options are given.
      ravenOptions.shouldSendCallback = true; // all instances should default to true

      if (window.Raven) return;
      var scriptElement = document.createElement("script");
      scriptElement.crossOrigin = "anonymous";
      scriptElement.type = "text/javascript";

      // uses Raven's async functionality to queue up any errors that occur before raven is ready to run https://docs.sentry.io/clients/javascript/install/#async-loading
      var scriptIife =
        '; (function (a, b, g, e, h) { var k = a.SENTRY_SDK, f = function (a) { f.data.push(a) }; f.data = []; var l = a[e]; a[e] = function (c, b, e, d, h) { f({ e: [].slice.call(arguments) }); l && l.apply(a, arguments) }; var m = a[h]; a[h] = function (c) { f({ p: c.reason }); m && m.apply(a, arguments) }; var n = b.getElementsByTagName(g)[0]; b = b.createElement(g); b.src = k.url; b.crossorigin = "anonymous"; b.addEventListener("load", function () { try { a[e] = l; a[h] = m; var c = f.data, b = a.Raven; b.config(k.dsn, k.options).install(); var g = a[e]; if (c.length) for (var d = 0; d < c.length; d++)c[d].e ? g.apply(b.TraceKit, c[d].e) : c[d].p && b.captureException(c[d].p) } catch (p) { console.log(p) } }); n.parentNode.insertBefore(b, n) })(window, document, "script", "onerror", "onunhandledrejection");';
      var inlineScript = document.createTextNode(
        "window.SENTRY_SDK = {url: 'https://cdn.ravenjs.com/" +
          ravenVersion +
          "/raven.min.js', dsn: " +
          "'" +
          sentryDsn +
          "'" +
          ", options: " +
          JSON.stringify(ravenOptions) +
          "}" +
          scriptIife
      );

      scriptElement.appendChild(inlineScript);
      scriptElement.onerror = handleRavenError;
      document.head.appendChild(scriptElement);

      function handleRavenError(error) {
        console.log("Raven failed to initialize");
        if (error) console.log(error);
      }
    }

    if (typeof options.marketoMunchkin === "undefined") {
      options.marketoMunchkin = true;
    }

    var isProduction =
      window.MapboxPageShellProduction === true ||
      /mapbox\.com$/.test(window.location.hostname);

    var segmentWriteKeyProduction =
      options.segmentWriteKey || SEGMENT_WRITE_KEY_DEFAULT_PRODUCTION;
    var segmentWriteKeyStaging = (function () {
      if (options.segmentWriteKeyStaging) {
        return options.segmentWriteKeyStaging;
      }
      if (options.segmentWriteKey) {
        return options.segmentWriteKey;
      }
      return SEGMENT_WRITE_KEY_DEFAULT_STAGING;
    })();

    var segmentWriteKey = isProduction
      ? segmentWriteKeyProduction
      : segmentWriteKeyStaging;

    var integrations = { All: false };
    for (var i = 0; i < defaultSegmentIntegrations.length; i++) {
      integrations[defaultSegmentIntegrations[i]] = true;
    }
    if (options.segmentIntegrations) {
      for (var integrationKey in options.segmentIntegrations) {
        if (options.segmentIntegrations.hasOwnProperty(integrationKey)) {
          integrations[integrationKey] =
            options.segmentIntegrations[integrationKey];
        }
      }
    }

    analytics._writeKey = segmentWriteKey;
    analytics.load(segmentWriteKey, { integrations: integrations });

    // check if window.mbxMetadata exists
    function getMbxMetdata() {
      return typeof window.mbxMetadata !== "undefined"
        ? window.mbxMetadata
        : {};
    }

    // send mbxMetadata along with page, if available
    var pageProperties = getMbxMetdata();

    // default page-view event sent along when no mbxMetadata exists on window
    analytics.page(pageProperties);

    // Done initializing Segment ===================
    // Initialize Marketo Munchkin
    // ==========================================
    if (options.marketoMunchkin) {
      var munchkinId = options.marketoMunchkinId || MARKETO_MUNCHKIN_ID_DEFAULT;
      // This is the Munchkin insertion script provided by Marketo
      // ref http://developers.marketo.com/javascript-api/lead-tracking/#embedding_the_code
      // with an added check to see if the Munchkin global variable exists,
      // to avoid Marketo's stupid runtime errors.
      (function () {
        var didInit = false;
        function initMunchkin() {
          if (didInit === false) {
            didInit = true;
            if (typeof Munchkin !== "undefined") {
              Munchkin.init(munchkinId, { asyncOnly: true });
            }
          }
        }
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "//munchkin.marketo.net/munchkin.js";
        s.onreadystatechange = function () {
          if (this.readyState == "complete" || this.readyState == "loaded") {
            initMunchkin();
          }
        };
        s.onload = initMunchkin;
        document.getElementsByTagName("head")[0].appendChild(s);
      })();
    }

    // Push-state analytics
    // ==========================================
    // We need to fire page change events when HTML5 history is used in
    // client-side routing to change URLs dynamically.
    if (typeof window === undefined) return;
    if (!window.analytics || !window.history || !window.history.pushState)
      return;
    if (window.pushStateAnalyticsInitialized) return;

    window.pushStateAnalyticsInitialized = true;

    var previousLocation;
    function informAnalytics(properties) {
      properties = properties || {};
      // This delay gives react-helmet or some other such thing a moment to update
      // the <title>, which Segment reads.
      setTimeout(function () {
        properties.referrer = previousLocation;
        // Refresh mbxMetadata and append to properties
        var metadata = getMbxMetdata();
        if (metadata) {
          for (var attribute in metadata) {
            properties[attribute] = metadata[attribute];
          }
        }
        window.analytics.page(properties);
        // Munchkin is the global variable initialized by Marketo's
        // Munchkin script. It also needs to know about page changes.
        if (window.Munchkin && window.Munchkin.munchkinFunction) {
          window.Munchkin.munchkinFunction("visitWebPage", {
            url: window.location.pathname,
            params: window.location.search.replace(/^\?/, ""),
          });
        }
        previousLocation = window.location.href;
      }, 300);
    }

    // Monkey-patches window.history.pushState so we fire an analytics event when
    // it is used.
    var originalPushState = window.history.pushState;
    window.history.pushState = function () {
      previousLocation = window.location.href;
      informAnalytics({ clientSideRouting: "pushstate" });
      originalPushState.apply(window.history, arguments);
    };

    // Also trigger an analytics event when the back and forward browser buttons
    // are used.
    window.addEventListener("popstate", function () {
      informAnalytics({ clientSideRouting: "popstate" });
    });
  };
})();
