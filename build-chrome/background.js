var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/url-pattern/lib/url-pattern.js
var require_url_pattern = __commonJS({
  "node_modules/url-pattern/lib/url-pattern.js"(exports, module) {
    var slice = [].slice;
    (function(root, factory) {
      if ("function" === typeof define && define.amd != null) {
        return define([], factory);
      } else if (typeof exports !== "undefined" && exports !== null) {
        return module.exports = factory();
      } else {
        return root.UrlPattern = factory();
      }
    })(exports, function() {
      var P, UrlPattern2, astNodeContainsSegmentsForProvidedParams, astNodeToNames, astNodeToRegexString, baseAstNodeToRegexString, concatMap, defaultOptions, escapeForRegex, getParam, keysAndValuesToObject, newParser, regexGroupCount, stringConcatMap, stringify;
      escapeForRegex = function(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      };
      concatMap = function(array, f) {
        var i, length, results;
        results = [];
        i = -1;
        length = array.length;
        while (++i < length) {
          results = results.concat(f(array[i]));
        }
        return results;
      };
      stringConcatMap = function(array, f) {
        var i, length, result;
        result = "";
        i = -1;
        length = array.length;
        while (++i < length) {
          result += f(array[i]);
        }
        return result;
      };
      regexGroupCount = function(regex) {
        return new RegExp(regex.toString() + "|").exec("").length - 1;
      };
      keysAndValuesToObject = function(keys, values) {
        var i, key, length, object, value;
        object = {};
        i = -1;
        length = keys.length;
        while (++i < length) {
          key = keys[i];
          value = values[i];
          if (value == null) {
            continue;
          }
          if (object[key] != null) {
            if (!Array.isArray(object[key])) {
              object[key] = [object[key]];
            }
            object[key].push(value);
          } else {
            object[key] = value;
          }
        }
        return object;
      };
      P = {};
      P.Result = function(value, rest) {
        this.value = value;
        this.rest = rest;
      };
      P.Tagged = function(tag, value) {
        this.tag = tag;
        this.value = value;
      };
      P.tag = function(tag, parser) {
        return function(input) {
          var result, tagged;
          result = parser(input);
          if (result == null) {
            return;
          }
          tagged = new P.Tagged(tag, result.value);
          return new P.Result(tagged, result.rest);
        };
      };
      P.regex = function(regex) {
        return function(input) {
          var matches, result;
          matches = regex.exec(input);
          if (matches == null) {
            return;
          }
          result = matches[0];
          return new P.Result(result, input.slice(result.length));
        };
      };
      P.sequence = function() {
        var parsers;
        parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return function(input) {
          var i, length, parser, rest, result, values;
          i = -1;
          length = parsers.length;
          values = [];
          rest = input;
          while (++i < length) {
            parser = parsers[i];
            result = parser(rest);
            if (result == null) {
              return;
            }
            values.push(result.value);
            rest = result.rest;
          }
          return new P.Result(values, rest);
        };
      };
      P.pick = function() {
        var indexes, parsers;
        indexes = arguments[0], parsers = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return function(input) {
          var array, result;
          result = P.sequence.apply(P, parsers)(input);
          if (result == null) {
            return;
          }
          array = result.value;
          result.value = array[indexes];
          return result;
        };
      };
      P.string = function(string) {
        var length;
        length = string.length;
        return function(input) {
          if (input.slice(0, length) === string) {
            return new P.Result(string, input.slice(length));
          }
        };
      };
      P.lazy = function(fn) {
        var cached;
        cached = null;
        return function(input) {
          if (cached == null) {
            cached = fn();
          }
          return cached(input);
        };
      };
      P.baseMany = function(parser, end, stringResult, atLeastOneResultRequired, input) {
        var endResult, parserResult, rest, results;
        rest = input;
        results = stringResult ? "" : [];
        while (true) {
          if (end != null) {
            endResult = end(rest);
            if (endResult != null) {
              break;
            }
          }
          parserResult = parser(rest);
          if (parserResult == null) {
            break;
          }
          if (stringResult) {
            results += parserResult.value;
          } else {
            results.push(parserResult.value);
          }
          rest = parserResult.rest;
        }
        if (atLeastOneResultRequired && results.length === 0) {
          return;
        }
        return new P.Result(results, rest);
      };
      P.many1 = function(parser) {
        return function(input) {
          return P.baseMany(parser, null, false, true, input);
        };
      };
      P.concatMany1Till = function(parser, end) {
        return function(input) {
          return P.baseMany(parser, end, true, true, input);
        };
      };
      P.firstChoice = function() {
        var parsers;
        parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return function(input) {
          var i, length, parser, result;
          i = -1;
          length = parsers.length;
          while (++i < length) {
            parser = parsers[i];
            result = parser(input);
            if (result != null) {
              return result;
            }
          }
        };
      };
      newParser = function(options) {
        var U;
        U = {};
        U.wildcard = P.tag("wildcard", P.string(options.wildcardChar));
        U.optional = P.tag("optional", P.pick(1, P.string(options.optionalSegmentStartChar), P.lazy(function() {
          return U.pattern;
        }), P.string(options.optionalSegmentEndChar)));
        U.name = P.regex(new RegExp("^[" + options.segmentNameCharset + "]+"));
        U.named = P.tag("named", P.pick(1, P.string(options.segmentNameStartChar), P.lazy(function() {
          return U.name;
        })));
        U.escapedChar = P.pick(1, P.string(options.escapeChar), P.regex(/^./));
        U["static"] = P.tag("static", P.concatMany1Till(P.firstChoice(P.lazy(function() {
          return U.escapedChar;
        }), P.regex(/^./)), P.firstChoice(P.string(options.segmentNameStartChar), P.string(options.optionalSegmentStartChar), P.string(options.optionalSegmentEndChar), U.wildcard)));
        U.token = P.lazy(function() {
          return P.firstChoice(U.wildcard, U.optional, U.named, U["static"]);
        });
        U.pattern = P.many1(P.lazy(function() {
          return U.token;
        }));
        return U;
      };
      defaultOptions = {
        escapeChar: "\\",
        segmentNameStartChar: ":",
        segmentValueCharset: "a-zA-Z0-9-_~ %",
        segmentNameCharset: "a-zA-Z0-9",
        optionalSegmentStartChar: "(",
        optionalSegmentEndChar: ")",
        wildcardChar: "*"
      };
      baseAstNodeToRegexString = function(astNode, segmentValueCharset) {
        if (Array.isArray(astNode)) {
          return stringConcatMap(astNode, function(node) {
            return baseAstNodeToRegexString(node, segmentValueCharset);
          });
        }
        switch (astNode.tag) {
          case "wildcard":
            return "(.*?)";
          case "named":
            return "([" + segmentValueCharset + "]+)";
          case "static":
            return escapeForRegex(astNode.value);
          case "optional":
            return "(?:" + baseAstNodeToRegexString(astNode.value, segmentValueCharset) + ")?";
        }
      };
      astNodeToRegexString = function(astNode, segmentValueCharset) {
        if (segmentValueCharset == null) {
          segmentValueCharset = defaultOptions.segmentValueCharset;
        }
        return "^" + baseAstNodeToRegexString(astNode, segmentValueCharset) + "$";
      };
      astNodeToNames = function(astNode) {
        if (Array.isArray(astNode)) {
          return concatMap(astNode, astNodeToNames);
        }
        switch (astNode.tag) {
          case "wildcard":
            return ["_"];
          case "named":
            return [astNode.value];
          case "static":
            return [];
          case "optional":
            return astNodeToNames(astNode.value);
        }
      };
      getParam = function(params, key, nextIndexes, sideEffects) {
        var index, maxIndex, result, value;
        if (sideEffects == null) {
          sideEffects = false;
        }
        value = params[key];
        if (value == null) {
          if (sideEffects) {
            throw new Error("no values provided for key `" + key + "`");
          } else {
            return;
          }
        }
        index = nextIndexes[key] || 0;
        maxIndex = Array.isArray(value) ? value.length - 1 : 0;
        if (index > maxIndex) {
          if (sideEffects) {
            throw new Error("too few values provided for key `" + key + "`");
          } else {
            return;
          }
        }
        result = Array.isArray(value) ? value[index] : value;
        if (sideEffects) {
          nextIndexes[key] = index + 1;
        }
        return result;
      };
      astNodeContainsSegmentsForProvidedParams = function(astNode, params, nextIndexes) {
        var i, length;
        if (Array.isArray(astNode)) {
          i = -1;
          length = astNode.length;
          while (++i < length) {
            if (astNodeContainsSegmentsForProvidedParams(astNode[i], params, nextIndexes)) {
              return true;
            }
          }
          return false;
        }
        switch (astNode.tag) {
          case "wildcard":
            return getParam(params, "_", nextIndexes, false) != null;
          case "named":
            return getParam(params, astNode.value, nextIndexes, false) != null;
          case "static":
            return false;
          case "optional":
            return astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes);
        }
      };
      stringify = function(astNode, params, nextIndexes) {
        if (Array.isArray(astNode)) {
          return stringConcatMap(astNode, function(node) {
            return stringify(node, params, nextIndexes);
          });
        }
        switch (astNode.tag) {
          case "wildcard":
            return getParam(params, "_", nextIndexes, true);
          case "named":
            return getParam(params, astNode.value, nextIndexes, true);
          case "static":
            return astNode.value;
          case "optional":
            if (astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes)) {
              return stringify(astNode.value, params, nextIndexes);
            } else {
              return "";
            }
        }
      };
      UrlPattern2 = function(arg1, arg2) {
        var groupCount, options, parsed, parser, withoutWhitespace;
        if (arg1 instanceof UrlPattern2) {
          this.isRegex = arg1.isRegex;
          this.regex = arg1.regex;
          this.ast = arg1.ast;
          this.names = arg1.names;
          return;
        }
        this.isRegex = arg1 instanceof RegExp;
        if (!("string" === typeof arg1 || this.isRegex)) {
          throw new TypeError("argument must be a regex or a string");
        }
        if (this.isRegex) {
          this.regex = arg1;
          if (arg2 != null) {
            if (!Array.isArray(arg2)) {
              throw new Error("if first argument is a regex the second argument may be an array of group names but you provided something else");
            }
            groupCount = regexGroupCount(this.regex);
            if (arg2.length !== groupCount) {
              throw new Error("regex contains " + groupCount + " groups but array of group names contains " + arg2.length);
            }
            this.names = arg2;
          }
          return;
        }
        if (arg1 === "") {
          throw new Error("argument must not be the empty string");
        }
        withoutWhitespace = arg1.replace(/\s+/g, "");
        if (withoutWhitespace !== arg1) {
          throw new Error("argument must not contain whitespace");
        }
        options = {
          escapeChar: (arg2 != null ? arg2.escapeChar : void 0) || defaultOptions.escapeChar,
          segmentNameStartChar: (arg2 != null ? arg2.segmentNameStartChar : void 0) || defaultOptions.segmentNameStartChar,
          segmentNameCharset: (arg2 != null ? arg2.segmentNameCharset : void 0) || defaultOptions.segmentNameCharset,
          segmentValueCharset: (arg2 != null ? arg2.segmentValueCharset : void 0) || defaultOptions.segmentValueCharset,
          optionalSegmentStartChar: (arg2 != null ? arg2.optionalSegmentStartChar : void 0) || defaultOptions.optionalSegmentStartChar,
          optionalSegmentEndChar: (arg2 != null ? arg2.optionalSegmentEndChar : void 0) || defaultOptions.optionalSegmentEndChar,
          wildcardChar: (arg2 != null ? arg2.wildcardChar : void 0) || defaultOptions.wildcardChar
        };
        parser = newParser(options);
        parsed = parser.pattern(arg1);
        if (parsed == null) {
          throw new Error("couldn't parse pattern");
        }
        if (parsed.rest !== "") {
          throw new Error("could only partially parse pattern");
        }
        this.ast = parsed.value;
        this.regex = new RegExp(astNodeToRegexString(this.ast, options.segmentValueCharset));
        this.names = astNodeToNames(this.ast);
      };
      UrlPattern2.prototype.match = function(url) {
        var groups, match;
        match = this.regex.exec(url);
        if (match == null) {
          return null;
        }
        groups = match.slice(1);
        if (this.names) {
          return keysAndValuesToObject(this.names, groups);
        } else {
          return groups;
        }
      };
      UrlPattern2.prototype.stringify = function(params) {
        if (params == null) {
          params = {};
        }
        if (this.isRegex) {
          throw new Error("can't stringify patterns generated from a regex");
        }
        if (params !== Object(params)) {
          throw new Error("argument must be an object or undefined");
        }
        return stringify(this.ast, params, {});
      };
      UrlPattern2.escapeForRegex = escapeForRegex;
      UrlPattern2.concatMap = concatMap;
      UrlPattern2.stringConcatMap = stringConcatMap;
      UrlPattern2.regexGroupCount = regexGroupCount;
      UrlPattern2.keysAndValuesToObject = keysAndValuesToObject;
      UrlPattern2.P = P;
      UrlPattern2.newParser = newParser;
      UrlPattern2.defaultOptions = defaultOptions;
      UrlPattern2.astNodeToRegexString = astNodeToRegexString;
      UrlPattern2.astNodeToNames = astNodeToNames;
      UrlPattern2.getParam = getParam;
      UrlPattern2.astNodeContainsSegmentsForProvidedParams = astNodeContainsSegmentsForProvidedParams;
      UrlPattern2.stringify = stringify;
      return UrlPattern2;
    });
  }
});

// src/lib/config.ts
var import_url_pattern = __toESM(require_url_pattern(), 1);
var REWST_DOMAINS = ["rewst.io", "rewst.asia", "rewst.eu", "localhost"];
var VSCODE_SERVER_URL = "http://127.0.0.1:27121";
var EXPIRY_MS = 12 * 60 * 60 * 1e3;
var orgPattern = new import_url_pattern.default("/organizations/:orgId(/*)");
var templatePattern = new import_url_pattern.default("/organizations/:orgId/templates/:templateId(/*)");
var scriptPattern = new import_url_pattern.default("/organizations/:orgId/scripts/:templateId(/*)");

// src/lib/browser-api.ts
var browserAPI = chrome?.browser || chrome;

// src/lib/url-patterns.ts
function isRewstDomain(hostname) {
  const result = REWST_DOMAINS.some((domain) => hostname.endsWith(domain));
  console.log(`[Rewst Buddy] isRewstDomain("${hostname}") = ${result} (checking against: ${REWST_DOMAINS.join(", ")})`);
  return result;
}
function extractOrgId(url) {
  console.log(`[Rewst Buddy] extractOrgId called with: ${url}`);
  try {
    const urlObj = new URL(url);
    console.log(`[Rewst Buddy]   hostname: ${urlObj.hostname}, pathname: ${urlObj.pathname}`);
    if (!isRewstDomain(urlObj.hostname)) {
      console.log(`[Rewst Buddy]   -> Not a Rewst domain, returning null`);
      return null;
    }
    const match = orgPattern.match(urlObj.pathname);
    console.log(`[Rewst Buddy]   -> Pattern match result:`, match);
    const orgId = match?.orgId || null;
    console.log(`[Rewst Buddy]   -> Extracted orgId: ${orgId}`);
    return orgId;
  } catch (e) {
    console.error(`[Rewst Buddy]   -> Error parsing URL:`, e);
    return null;
  }
}
function extractTemplateInfo(url) {
  console.log(`[Rewst Buddy] extractTemplateInfo called with: ${url}`);
  try {
    const urlObj = new URL(url);
    if (!isRewstDomain(urlObj.hostname)) {
      return null;
    }
    let match = templatePattern.match(urlObj.pathname);
    if (match?.orgId && match?.templateId) {
      console.log(`[Rewst Buddy]   -> Matched template:`, match);
      return { orgId: match.orgId, templateId: match.templateId };
    }
    match = scriptPattern.match(urlObj.pathname);
    if (match?.orgId && match?.templateId) {
      console.log(`[Rewst Buddy]   -> Matched script:`, match);
      return { orgId: match.orgId, templateId: match.templateId };
    }
    console.log(`[Rewst Buddy]   -> No template/script match`);
    return null;
  } catch (e) {
    console.error(`[Rewst Buddy]   -> Error parsing URL:`, e);
    return null;
  }
}

// src/lib/cookies.ts
async function sendSessionForOrg(url, orgId) {
  console.log(`[Rewst Buddy] ========== SENDING SESSION ==========`);
  console.log(`[Rewst Buddy] URL: ${url}`);
  console.log(`[Rewst Buddy] OrgId: ${orgId}`);
  console.log(`[Rewst Buddy] Target server: ${VSCODE_SERVER_URL}`);
  try {
    console.log(`[Rewst Buddy] Fetching cookies for URL: ${url}`);
    const cookies = await new Promise((resolve) => {
      browserAPI.cookies.getAll({ url }, resolve);
    });
    console.log(`[Rewst Buddy] Total cookies found: ${cookies.length}`);
    console.log(`[Rewst Buddy] All cookies:`, cookies.map((c) => ({ name: c.name, domain: c.domain })));
    const sessionCookies = cookies.filter(
      (c) => c.name.toLowerCase().includes("session")
    );
    console.log(`[Rewst Buddy] Session cookies found: ${sessionCookies.length}`);
    console.log(`[Rewst Buddy] Session cookie names:`, sessionCookies.map((c) => c.name));
    if (sessionCookies.length === 0) {
      console.log("[Rewst Buddy] No session cookies found - aborting send");
      return;
    }
    const cookieString = sessionCookies.map((c) => `${c.name}=${c.value}`).join("; ");
    const payload = { action: "addSession", cookies: cookieString };
    console.log(`[Rewst Buddy] Sending payload:`, { action: payload.action, cookiesLength: cookieString.length });
    const response = await fetch(VSCODE_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log(`[Rewst Buddy] Response status: ${response.status} ${response.statusText}`);
    const result = await response.json();
    console.log("[Rewst Buddy] VSCode response:", result);
  } catch (error) {
    console.error("[Rewst Buddy] Error sending to VSCode server:", error);
    console.log("[Rewst Buddy] VSCode server may not be running");
  }
  console.log(`[Rewst Buddy] ======================================`);
}

// src/lib/listeners.ts
function setupTabListener() {
  browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(`[Rewst Buddy] tabs.onUpdated event:`, {
      tabId,
      status: changeInfo.status,
      url: changeInfo.url || tab.url || "(none)",
      title: tab.title
    });
    if (changeInfo.status !== "complete") {
      console.log(`[Rewst Buddy]   -> Skipping: status is "${changeInfo.status}", not "complete"`);
      return;
    }
    if (!tab.url) {
      console.log(`[Rewst Buddy]   -> Skipping: no tab URL`);
      return;
    }
    console.log(`[Rewst Buddy]   -> Processing completed navigation to: ${tab.url}`);
    const orgId = extractOrgId(tab.url);
    if (!orgId) {
      console.log(`[Rewst Buddy]   -> No orgId extracted, skipping`);
      return;
    }
    console.log(`[Rewst Buddy]   -> Found orgId: ${orgId}`);
    sendSessionForOrg(tab.url, orgId);
  });
}
function setupMessageListener() {
  browserAPI.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    console.log("[Rewst Buddy] Message received:", request);
    if (request.action === "open") {
      browserAPI.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0];
        if (!tab.url) {
          console.log("[Rewst Buddy] No URL found for active tab");
          sendResponse({ success: false, error: "No URL found" });
          return;
        }
        const templateInfo = extractTemplateInfo(tab.url);
        if (!templateInfo) {
          console.log("[Rewst Buddy] URL does not match template/script pattern");
          sendResponse({ success: false, error: "Not a template or script page" });
          return;
        }
        const payload = {
          action: "openTemplate",
          orgId: templateInfo.orgId,
          templateId: templateInfo.templateId
        };
        console.log("[Rewst Buddy] Sending openTemplate request:", payload);
        try {
          const response = await fetch(VSCODE_SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const result = await response.json();
          console.log("[Rewst Buddy] Server response:", result);
          sendResponse({ success: true, result });
        } catch (error) {
          console.error("[Rewst Buddy] Error sending to server:", error);
          sendResponse({ success: false, error: "VS Code server not running" });
        }
      });
      return true;
    }
  });
}

// src/background.ts
setupTabListener();
setupMessageListener();
console.log("[Rewst Buddy] ==========================================");
console.log("[Rewst Buddy] Background script loaded");
console.log("[Rewst Buddy] Configuration:");
console.log(`[Rewst Buddy]   Domains: ${REWST_DOMAINS.join(", ")}`);
console.log(`[Rewst Buddy]   VSCode Server: ${VSCODE_SERVER_URL}`);
console.log(`[Rewst Buddy]   Cache expiry: ${EXPIRY_MS / 1e3 / 60 / 60} hours`);
console.log("[Rewst Buddy] ==========================================");
